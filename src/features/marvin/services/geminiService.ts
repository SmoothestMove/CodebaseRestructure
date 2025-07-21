/// <reference lib="es2015" />

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AppData, GroundingChunk, AiAction } from '../types/marvin';

// Developer Integration Note:
// The Gemini API Key must be provided as an environment variable named `VITE_GEMINI_API_KEY`.
// Your application's build process (e.g., Vite) will make this available as import.meta.env.VITE_GEMINI_API_KEY.
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const createSystemInstruction = (appData: AppData) => {
  return `You are MARVIN, a moving assistant AI integrated into a relocation app. Your goal is to be helpful, concise, and proactive. You have access to the user's moving plan data and can perform specific actions.

**App Data Context:**
Here is the current state of the user's move. Use this data to answer questions accurately. Do not make up information; if the data is not here, say so.
- Team Members: ${JSON.stringify(appData.teamMembers, null, 2)}
- Inventory: ${JSON.stringify(appData.inventory, null, 2)}
- Reservations: ${JSON.stringify(appData.reservations, null, 2)}
- Current Checklist: ${JSON.stringify(appData.checklist, null, 2)}

**Your Capabilities & Rules:**

1.  **Answer General & App-Specific Questions:** Use your knowledge and the provided App Data Context to answer.

2.  **Web Search:** If a question requires current, real-world information (e.g., "where to buy boxes?", "moving company reviews", "how much tape to buy?", "what's open near me?"), you MUST use the provided Google Search tool.

3.  **Create Checklists & Agendas:** If asked to create a checklist or agenda, respond ONLY with a valid JSON object matching this exact schema: \`{"action": "create_checklist", "items": [{"task": "string", "assignee": "string", "dueDate": "YYYY-MM-DD"}]}\`. Do not add any other text, just the JSON.

4.  **Manage Calendar Events/Reminders:** If asked to create, set, or add a reminder or calendar event, respond ONLY with a valid JSON object matching this exact schema: \`{"action": "create_calendar_event", "event": {"title": "string", "date": "YYYY-MM-DD", "time": "HH:MM", "assignees": ["string"]}}\`. Do not add any other text, just the JSON.

5.  **Provide Navigation:** If asked for directions or to open a map, respond ONLY with a JSON object matching this schema: \`{"action": "navigate", "destination": "string"}\`. Do not add any other text.

Analyze the user's request and respond according to these rules. For standard chat, be friendly. For actions, be precise and return ONLY the specified JSON format.`;
};

const webSearchKeywords = ["search for", "find", "how much", "what is", "where can i", "what's open"];

interface MarvinResponse {
  text: string;
  sources?: GroundingChunk[];
  action?: AiAction;
}

export const getMarvinResponse = async (prompt: string, appData: AppData): Promise<MarvinResponse> => {
  const model = 'gemini-2.5-flash';
  const systemInstruction = createSystemInstruction(appData);
  const useWebSearch = webSearchKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
        systemInstruction: systemInstruction,
        ...(useWebSearch && { tools: [{ googleSearch: {} }] })
    },
  });

  const text = response.text;
  
  // Check if the response is a structured action JSON
  if (text && isJsonString(text)) {
    const potentialAction = JSON.parse(text) as AiAction;
    if (potentialAction.action) {
      return { text: '', action: potentialAction };
    }
  }

  // Otherwise, it's a standard text response
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const sources = (groundingMetadata?.groundingChunks as GroundingChunk[]) ?? [];
  
  return { text, sources };
};