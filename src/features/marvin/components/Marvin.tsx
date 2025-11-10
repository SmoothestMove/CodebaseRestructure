/// <reference lib="dom" />
/// <reference lib="es2015" />

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppData, Message, MessageSender, ChecklistItem, AiAction, AddExpenseAction, CreateBudgetCategoryAction, QueryBudgetAction } from '../types/marvin';
import { getMarvinResponse } from '../services/geminiService';
import { ttsService } from '../services/ttsService';
import { wakeWordService } from '../services/wakeWordService';
import { BotIcon, SendIcon, UserIcon, WebSourceIcon, LoadingIcon, MicrophoneIcon, SpeakerOnIcon, SpeakerOffIcon, SettingsIcon } from './icons';

// Extend the window object for TypeScript to recognize SpeechRecognition APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * @interface MarvinProps
 * @property {AppData} appData - The application data.
 * @property {function(any): Promise<any>} onCalendarAction - A callback function for calendar actions.
 * @property {function(string): void} onNavigate - A callback function for navigation actions.
 * @property {function(Omit<ChecklistItem, 'id' | 'completed'>[]): void} onUpdateChecklist - A callback function for updating the checklist.
 * @property {function(): void} onWakeWordDetected - A callback function for when the wake word is detected.
 * @property {function(AddExpenseAction | CreateBudgetCategoryAction | QueryBudgetAction): Promise<any>} [onBudgetAction] - A callback function for budget actions.
 */
interface MarvinProps {
  appData: AppData;
  onCalendarAction: (action: any) => Promise<any>;
  onNavigate: (destination: string) => void;
  onUpdateChecklist: (items: Omit<ChecklistItem, 'id' | 'completed'>[]) => void;
  onWakeWordDetected: () => void;
  onBudgetAction?: (action: AddExpenseAction | CreateBudgetCategoryAction | QueryBudgetAction) => Promise<any>;
}

const promptStarters = [
  "Create a moving agenda for this week.",
  "How many boxes are packed?",
  "Add a $50 expense for moving boxes to supplies.",
  "Show me my budget summary.",
  "Search for moving companies near me.",
  "Set a reminder for Saturday."
];

/**
 * The main component for the MARVIN assistant.
 * @param {MarvinProps} props - The props for the component.
 * @returns {JSX.Element} The rendered Marvin component.
 */
export const Marvin: React.FC<MarvinProps> = ({ appData, onCalendarAction, onNavigate, onUpdateChecklist, onWakeWordDetected, onBudgetAction }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', text: "Hello! I'm MARVIN, your moving assistant. How can I help you plan your relocation today?", sender: MessageSender.AI }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  
  // Wake Word State
  const [isWakeWordEnabled, setIsWakeWordEnabled] = useState(false);
  // Note: wakeWordStatus is kept in state for future use
  const [, setWakeWordStatus] = useState<'idle' | 'initializing' | 'listening' | 'error'>('idle');
  const [picovoiceAccessKey, setPicovoiceAccessKey] = useState('');
  const [picovoiceModelPath, setPicovoiceModelPath] = useState('');
  const [showWakeWordSettings, setShowWakeWordSettings] = useState(false);
  
  // Speech recognition delay state
  const [speechDelayCountdown, setSpeechDelayCountdown] = useState<number | null>(null);
  const speechDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechDelayDuration = 2500; // 2.5 seconds delay
  const sendMessageRef = useRef<((text: string) => void) | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle delayed speech message sending
  const scheduleDelayedSpeechSend = useCallback((transcript: string) => {
    console.log('Scheduling delayed speech send:', transcript.substring(0, 50) + '...');
    
    // Clear any existing timer
    if (speechDelayTimerRef.current) {
      clearTimeout(speechDelayTimerRef.current);
      speechDelayTimerRef.current = null;
    }
    
    // Start countdown
    let remainingTime = Math.ceil(speechDelayDuration / 1000);
    setSpeechDelayCountdown(remainingTime);
    
    const countdownInterval = setInterval(() => {
      remainingTime -= 1;
      setSpeechDelayCountdown(remainingTime);
      
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
    
    // Set timer to send message
    speechDelayTimerRef.current = setTimeout(() => {
      console.log('Speech delay expired, sending message');
      clearInterval(countdownInterval);
      setSpeechDelayCountdown(null);
      // Call sendMessage that will be defined later
      if (sendMessageRef.current) {
        sendMessageRef.current(transcript.trim());
      }
    }, speechDelayDuration);
  }, [speechDelayDuration]);

  const cancelDelayedSpeechSend = useCallback(() => {
    if (speechDelayTimerRef.current) {
      console.log('Canceling delayed speech send');
      clearTimeout(speechDelayTimerRef.current);
      speechDelayTimerRef.current = null;
      setSpeechDelayCountdown(null);
    }
  }, []);

  // Cleanup speech delay timer on unmount
  useEffect(() => {
    return () => {
      if (speechDelayTimerRef.current) {
        clearTimeout(speechDelayTimerRef.current);
      }
    };
  }, []);

  useEffect(scrollToBottom, [messages]);
  
  // Load TTS voices
  useEffect(() => {
    const handleVoicesChanged = () => {
      const voices = ttsService.getAvailableVoices();
      setAvailableVoices(voices);
      setSelectedVoiceURI(currentURI => {
        const isCurrentValid = voices.some(v => v.voiceURI === currentURI);
        return (currentURI && isCurrentValid) ? currentURI : ttsService.getDefaultVoiceURI();
      });
    };
    ttsService.initialize(handleVoicesChanged);
    return () => ttsService.cleanup();
  }, []);
  
  // Load Wake Word settings from environment variables or localStorage
  useEffect(() => {
      // First check environment variables
      const envKey = import.meta.env.VITE_PICOVOICE_ACCESS_KEY;
      const envPath = 'Let--s-Move-Marvin_en_wasm_v3_0_0.ppn'; // Default model in public folder
      
      // Then check localStorage
      const savedKey = localStorage.getItem('picovoiceAccessKey');
      const savedPath = localStorage.getItem('picovoiceModelPath');
      
      // Use environment variables if available, otherwise use localStorage
      const finalKey = envKey || savedKey;
      const finalPath = (envKey ? envPath : savedPath) || envPath;
      
      if (finalKey) setPicovoiceAccessKey(finalKey);
      if (finalPath) setPicovoiceModelPath(finalPath);
      
      // If no settings are found, prompt user to configure them.
      if (!finalKey || !finalPath) {
        setShowWakeWordSettings(true);
      }
  }, []);

  const handleAction = useCallback(async (action: AiAction): Promise<string> => {
    console.log('Marvin handleAction called with:', action);
    try {
      if (action.action === 'create_calendar_event') {
        console.log('Calling onCalendarAction with:', action);
        try {
          const result = await onCalendarAction(action);
          console.log('onCalendarAction completed with result:', result);
          
          // Check if the result indicates success
          if (result && (result.success || result.id)) {
            return `I've created a calendar event for "${action.event.title}" on ${action.event.date}.`;
          } else {
            const errorMsg = result?.message || 'Unknown error occurred';
            console.error('Calendar action failed:', errorMsg);
            return `I couldn't create that event. ${errorMsg}`;
          }
        } catch (error) {
          console.error('Error in calendar action:', error);
          return `I encountered an error while creating your event: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      } else if (action.action === 'create_checklist') {
        onUpdateChecklist(action.items);
        return `I've added ${action.items.length} new tasks to your checklist.`;
      } else if (action.action === 'navigate') {
        onNavigate(action.destination);
        return `Here are the directions to ${action.destination}.`;
      } else if (action.action === 'add_expense' || action.action === 'create_budget_category' || action.action === 'query_budget') {
        if (onBudgetAction) {
          console.log('Calling onBudgetAction with:', action);
          const result = await onBudgetAction(action as AddExpenseAction | CreateBudgetCategoryAction | QueryBudgetAction);
          console.log('onBudgetAction completed with result:', result);
          if (action.action === 'add_expense') {
            const expenseAction = action as AddExpenseAction;
            return `I've added an expense of $${expenseAction.expense.amount} for ${expenseAction.expense.description}.`;
          } else if (action.action === 'create_budget_category') {
            const categoryAction = action as CreateBudgetCategoryAction;
            return `I've created a new budget category "${categoryAction.category.name}" with $${categoryAction.category.estimatedAmount}.`;
          } else if (action.action === 'query_budget') {
            return `I've retrieved your budget information.`;
          }
        } else {
          console.log('onBudgetAction not available');
          return 'Budget functionality is not available right now.';
        }
      } else {
        console.warn('Unknown action type:', action.action);
        return 'I received your request but I\'m not sure how to handle that action yet.';
      }
      return '';
    } catch (error) {
      console.error('Error executing action:', action.action, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Return a user-friendly error message instead of throwing
      if (errorMessage.includes('authenticated')) {
        return 'I need you to be logged in to perform this action. Please sign in and try again.';
      } else if (errorMessage.includes('move selected')) {
        return 'I need you to have an active move selected to perform this action. Please select or create a move first.';
      } else {
        return `I encountered an error: ${errorMessage}. Please try again.`;
      }
    }
  }, [onCalendarAction, onNavigate, onUpdateChecklist, onBudgetAction]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: MessageSender.USER };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    // Don't stop TTS here - let the speak() function handle stopping previous speech

    const speak = (textToSpeak: string) => {
        console.log('MARVIN speak() called:', { 
            textLength: textToSpeak.length, 
            isTTSEnabled, 
            selectedVoiceURI,
            availableVoicesCount: availableVoices.length 
        });
        
        if (isTTSEnabled) {
            setTtsError(null); // Clear previous errors
            console.log('Calling ttsService.speak()...');
            ttsService.speak(textToSpeak, selectedVoiceURI, {
                onStart: () => {
                    console.log('TTS onStart callback fired');
                    setIsSpeaking(true);
                },
                onEnd: () => {
                    console.log('TTS onEnd callback fired');
                    setIsSpeaking(false);
                },
                onError: (error) => { 
                    console.error("TTS Error:", error);
                    setTtsError(`Speech unavailable: ${error}`);
                    setIsSpeaking(false);
                }
            });
        } else {
            console.log('TTS disabled - not speaking');
            setIsSpeaking(false);
        }
    };

    try {
      const response = await getMarvinResponse(text, appData);
      let aiTextResponse = '';
      
      if (response.action) {
        console.log('Executing primary action:', response.action.action);
        const primaryResult = await handleAction(response.action);
        let allResults = [primaryResult];
        
        // Handle additional actions if present
        if (response.additionalActions && response.additionalActions.length > 0) {
          console.log('Executing additional actions:', response.additionalActions.length);
          for (const additionalAction of response.additionalActions) {
            try {
              const additionalResult = await handleAction(additionalAction);
              allResults.push(additionalResult);
            } catch (error) {
              console.error('Error executing additional action:', additionalAction.action, error);
              allResults.push(`Failed to ${additionalAction.action.replace('_', ' ')}.`);
            }
          }
        }
        
        // Combine all results into a comprehensive response
        aiTextResponse = allResults.filter(result => result && result.trim()).join(' ');
      } else {
        aiTextResponse = response.text;
      }
      
      if (aiTextResponse) {
        const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiTextResponse, sender: MessageSender.AI, sources: response.sources };
        setMessages(prev => [...prev, aiMessage]);
        speak(aiTextResponse);
      }
    } catch (error) {
      console.error("Error getting response from MARVIN:", error);
      const errorMessageText = "I'm having trouble connecting right now. Please try again in a moment.";
      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: errorMessageText, sender: MessageSender.AI };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMessageText);
    } finally {
      setIsLoading(false);
    }
  }, [appData, handleAction, isLoading, isTTSEnabled, selectedVoiceURI]);

  // Update the ref whenever sendMessage changes
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    if(wakeWordService.isRunning()) wakeWordService.stop();
    setIsWakeWordEnabled(false);
    ttsService.stop();
    cancelDelayedSpeechSend(); // Cancel any pending speech sends
    setInputValue('');
    recognitionRef.current.start();
  }, [isListening, cancelDelayedSpeechSend]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { console.warn("Speech Recognition API not supported."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setInputValue(transcript);
      
      // Check if any result is final
      const hasFinalResult = Array.from(event.results).some((result: any) => result.isFinal);
      
      if (hasFinalResult && transcript.trim()) {
        console.log('Final speech result detected, scheduling delayed send');
        scheduleDelayedSpeechSend(transcript);
      } else if (!hasFinalResult) {
        // If user is still speaking, cancel any pending send
        cancelDelayedSpeechSend();
      }
    };
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      // Don't cancel delayed speech here - let the timer complete naturally
    };
    recognition.onerror = (event: any) => { 
      console.error('Speech recognition error:', event.error); 
      setIsListening(false);
      cancelDelayedSpeechSend(); // Cancel on error
    };
    recognitionRef.current = recognition;
    // Don't stop TTS in cleanup - it cancels speech that's about to start
  }, [sendMessage, scheduleDelayedSpeechSend, cancelDelayedSpeechSend]);
  
  const handleWakeWord = useCallback(() => {
    onWakeWordDetected();
    if (isWakeWordEnabled) {
      setIsWakeWordEnabled(false);
    }
    setTimeout(startListening, 200);
  }, [onWakeWordDetected, startListening, isWakeWordEnabled]);

  const isWakeWordConfigured = picovoiceAccessKey && picovoiceModelPath;

  useEffect(() => {
    if (isWakeWordEnabled && isWakeWordConfigured) {
      setWakeWordStatus('initializing');
      wakeWordService.initialize(picovoiceAccessKey, picovoiceModelPath, handleWakeWord)
        .then(() => setWakeWordStatus(wakeWordService.isRunning() ? 'listening' : 'error'))
        .catch(() => setWakeWordStatus('error'));
      return () => wakeWordService.stop();
    } else {
      wakeWordService.stop();
      setWakeWordStatus('idle');
    }
  }, [isWakeWordEnabled, isWakeWordConfigured, picovoiceAccessKey, picovoiceModelPath, handleWakeWord]);

  const handleToggleTTS = () => {
    setIsTTSEnabled(prev => {
      const newState = !prev;
      if (!newState) {
        ttsService.stop();
        setIsSpeaking(false);
      }
      return newState;
    });
  };
  
  const handleSaveWakeWordSettings = () => {
    localStorage.setItem('picovoiceAccessKey', picovoiceAccessKey);
    localStorage.setItem('picovoiceModelPath', picovoiceModelPath);
    setShowWakeWordSettings(false);
    if (picovoiceAccessKey && picovoiceModelPath) {
      setIsWakeWordEnabled(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center gap-4 flex-wrap">
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold text-cyan-400">MARVIN</h1>
          <p className="text-xs text-gray-400">Moving Assistant & Relocation Visualization Integration Nexus</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mx-auto sm:mx-0">
            <div className="flex items-center gap-2" title={!isWakeWordConfigured ? 'Configure settings to enable wake word' : 'Toggle wake word detection'}>
                <label htmlFor="wake-word-toggle" className="text-sm font-medium text-gray-300">
                  Say "Let's Move Marvin"
                </label>
                <ToggleSwitch id="wake-word-toggle" enabled={isWakeWordEnabled} onChange={() => setIsWakeWordEnabled(p => !p)} disabled={!isWakeWordConfigured} />
            </div>
            <button onClick={() => setShowWakeWordSettings(p => !p)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Configure wake word">
              <SettingsIcon />
            </button>
            {isTTSEnabled && availableVoices.length > 0 && (
              <select value={selectedVoiceURI || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVoiceURI(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors max-w-[120px]" aria-label="Select voice">
                {availableVoices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
              </select>
            )}
            <button onClick={handleToggleTTS} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label={isTTSEnabled ? 'Mute audio' : 'Unmute audio'}>
              {isTTSEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
            </button>
        </div>
      </div>
      
      {showWakeWordSettings && (
        <div className="p-4 bg-gray-900 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-center mb-2">Wake Word Setup</h3>
          <p className="text-sm text-gray-400 text-center mb-4">
            Provide your <a href="https://console.picovoice.ai/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Picovoice AccessKey</a> and the model filename from your `public` folder.
          </p>
          <div className="space-y-3 max-w-lg mx-auto">
            <div>
              <label htmlFor="picovoice-key" className="block text-xs font-medium text-gray-300 mb-1">AccessKey</label>
              <input id="picovoice-key" type="text" value={picovoiceAccessKey} onChange={(e) => setPicovoiceAccessKey(e.target.value)} placeholder="Enter your Picovoice AccessKey" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label htmlFor="picovoice-path" className="block text-xs font-medium text-gray-300 mb-1">Model Filename (.ppn)</label>
              <input id="picovoice-path" type="text" value={picovoiceModelPath} onChange={(e) => setPicovoiceModelPath(e.target.value)} placeholder="e.g., Let-s-Move-Marvin_en_wasm_v3_0_0.ppn" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="mt-4 flex justify-end max-w-lg mx-auto">
              <button onClick={handleSaveWakeWordSettings} className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition-colors w-full sm:w-auto">
                Save Settings
              </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {ttsError && (
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-sm">⚠️ {ttsError}</span>
            </div>
            <button 
              onClick={() => setTtsError(null)} 
              className="text-yellow-400 hover:text-yellow-300 ml-2"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} isCurrentlySpeaking={isSpeaking && msg.id === messages[messages.length - 1].id && msg.sender === MessageSender.AI} />)}
        {isLoading && <LoadingMessage />}
        <div ref={chatEndRef} />
      </div>

      {messages.length <= 1 && !isLoading && !showWakeWordSettings && (
        <div className="px-6 pb-2">
            <p className="text-sm text-gray-400 mb-2">Try asking me:</p>
            <div className="grid grid-cols-2 gap-2">
                {promptStarters.map(prompt => <button key={prompt} onClick={() => sendMessage(prompt)} className="text-left text-xs bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">{prompt}</button>)}
            </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-700">
        {speechDelayCountdown !== null && (
          <div className="mb-2 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
              <span className="animate-pulse w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Sending in {speechDelayCountdown}s... (continue speaking to extend)</span>
              <button 
                onClick={cancelDelayedSpeechSend}
                className="ml-1 text-blue-300 hover:text-white"
                aria-label="Cancel sending"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); cancelDelayedSpeechSend(); sendMessage(inputValue); }} className="flex items-center gap-2">
          <input type="text" value={inputValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} placeholder={isListening ? "Listening..." : "Ask MARVIN anything..."} className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" disabled={isLoading} />
          <button type="button" onClick={startListening} disabled={!recognitionRef.current || isListening} className={`p-3 text-white rounded-full transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'}`} aria-label={isListening ? 'Stop listening' : 'Start listening'}>
            <MicrophoneIcon />
          </button>
          <button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            className={`rounded-full p-3 transition-colors flex-shrink-0 ${
              isLoading || !inputValue.trim() 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-cyan-500 hover:bg-cyan-600 cursor-pointer'
            } text-white`} 
            aria-label="Send message"
            title={!inputValue.trim() ? 'Type a message to send' : 'Send message'}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * A component for displaying a chat message.
 * @param {object} props - The props for the component.
 * @param {Message} props.message - The message to display.
 * @param {boolean} [props.isCurrentlySpeaking=false] - Whether the assistant is currently speaking the message.
 * @returns {JSX.Element} The rendered ChatMessage component.
 */
const ChatMessage: React.FC<{ message: Message, isCurrentlySpeaking?: boolean }> = ({ message, isCurrentlySpeaking = false }) => {
  const isUser = message.sender === MessageSender.USER;
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 transition-all ${isCurrentlySpeaking ? 'border-cyan-300 animate-pulse' : 'border-cyan-500'}`}><BotIcon /></div>}
      <div className={`max-w-md md:max-w-lg ${isUser ? 'order-1' : ''}`}>
        <div className={`px-5 py-3 rounded-2xl ${isUser ? 'bg-cyan-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}><p className="text-white whitespace-pre-wrap">{message.text}</p></div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 text-xs text-gray-400 space-y-1">
            <p className="font-semibold">Sources:</p>
            {message.sources.map((source, index) => <a key={index} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors"><WebSourceIcon /><span className="truncate">{source.web.title || new URL(source.web.uri).hostname}</span></a>)}
          </div>
        )}
      </div>
      {isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon /></div>}
    </div>
  );
};

/**
 * A component for displaying a loading message.
 * @returns {JSX.Element} The rendered LoadingMessage component.
 */
const LoadingMessage: React.FC = () => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-cyan-500"><BotIcon /></div>
    <div className="max-w-md md:max-w-lg"><div className="px-5 py-3 rounded-2xl bg-gray-700 rounded-bl-none flex items-center space-x-2"><LoadingIcon /><span className="text-gray-400">MARVIN is thinking...</span></div></div>
  </div>
);

/**
 * A toggle switch component.
 * @param {object} props - The props for the component.
 * @param {string} props.id - The ID of the component.
 * @param {boolean} props.enabled - Whether the switch is enabled.
 * @param {function(): void} props.onChange - A callback function for when the switch is toggled.
 * @param {boolean} [props.disabled] - Whether the switch is disabled.
 * @returns {JSX.Element} The rendered ToggleSwitch component.
 */
const ToggleSwitch = ({ id, enabled, onChange, disabled }: { id: string, enabled: boolean, onChange: () => void, disabled?: boolean }) => (
  <button 
    type="button" 
    id={id} 
    role="switch" 
    aria-checked={enabled} 
    onClick={disabled ? undefined : onChange} 
    disabled={disabled} 
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${enabled ? 'bg-cyan-600' : 'bg-gray-600'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-cyan-700'}`}
  >
    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
  </button>
);