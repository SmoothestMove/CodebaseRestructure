/// <reference lib="dom" />
/// <reference lib="es2015" />

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppData, Message, MessageSender, CalendarEvent, ChecklistItem, GroundingChunk, AiAction } from '../types/marvin';
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

interface MarvinProps {
  appData: AppData;
  onCalendarAction: (event: CalendarEvent) => void;
  onNavigate: (destination: string) => void;
  onUpdateChecklist: (items: Omit<ChecklistItem, 'id' | 'completed'>[]) => void;
  onWakeWordDetected: () => void;
}

const promptStarters = [
  "Create a moving agenda for this week.",
  "How many boxes are packed?",
  "Search for moving companies near me.",
  "Set a reminder for Saturday."
];

export const Marvin: React.FC<MarvinProps> = ({ appData, onCalendarAction, onNavigate, onUpdateChecklist, onWakeWordDetected }) => {
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
  
  // Wake Word State
  const [isWakeWordEnabled, setIsWakeWordEnabled] = useState(false);
  const [wakeWordStatus, setWakeWordStatus] = useState<'idle' | 'initializing' | 'listening' | 'error'>('idle');
  const [picovoiceAccessKey, setPicovoiceAccessKey] = useState('');
  const [picovoiceModelPath, setPicovoiceModelPath] = useState('');
  const [showWakeWordSettings, setShowWakeWordSettings] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleAction = useCallback((action: AiAction): string => {
    let confirmationText = '';
    if (action.action === 'create_calendar_event') {
      onCalendarAction(action.event);
      confirmationText = `I've created a calendar event for "${action.event.title}" on ${action.event.date}.`;
    } else if (action.action === 'create_checklist') {
      onUpdateChecklist(action.items);
      confirmationText = `I've added ${action.items.length} new tasks to your checklist.`;
    } else if (action.action === 'navigate') {
      onNavigate(action.destination);
      confirmationText = `Here are the directions to ${action.destination}.`;
    }
    return confirmationText;
  }, [onCalendarAction, onNavigate, onUpdateChecklist]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: MessageSender.USER };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    ttsService.stop();

    const speak = (textToSpeak: string) => {
        if (isTTSEnabled) {
            ttsService.speak(textToSpeak, selectedVoiceURI, {
                onStart: () => setIsSpeaking(true),
                onEnd: () => setIsSpeaking(false),
                onError: (error) => { console.error("TTS Error:", error); setIsSpeaking(false); }
            });
        }
    };

    try {
      const response = await getMarvinResponse(text, appData);
      let aiTextResponse = response.action ? handleAction(response.action) : response.text;
      if(aiTextResponse) {
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

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    if(wakeWordService.isRunning()) wakeWordService.stop();
    setIsWakeWordEnabled(false);
    ttsService.stop();
    setInputValue('');
    recognitionRef.current.start();
  }, [isListening]);

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
      if (event.results[0].isFinal) { sendMessage(transcript.trim()); }
    };
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => { console.error('Speech recognition error:', event.error); setIsListening(false); };
    recognitionRef.current = recognition;
    return () => ttsService.stop();
  }, [sendMessage]);
  
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
    setIsTTSEnabled(nextState => {
      if (nextState) ttsService.stop();
      return !nextState;
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
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }} className="flex items-center gap-2">
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

const LoadingMessage: React.FC = () => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-cyan-500"><BotIcon /></div>
    <div className="max-w-md md:max-w-lg"><div className="px-5 py-3 rounded-2xl bg-gray-700 rounded-bl-none flex items-center space-x-2"><LoadingIcon /><span className="text-gray-400">MARVIN is thinking...</span></div></div>
  </div>
);

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