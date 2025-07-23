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
- Calendar Events: ${JSON.stringify(appData.calendar, null, 2)}

**Your Capabilities & Rules:**

1.  **Answer General & App-Specific Questions:** Use your knowledge and the provided App Data Context to answer questions about the user's move, including upcoming events, schedule conflicts, and calendar information.

2.  **Web Search:** If a question requires current, real-world information (e.g., "where to buy boxes?", "moving company reviews", "how much tape to buy?", "what's open near me?"), you MUST use the provided Google Search tool.

3.  **Create Checklists & Agendas:** If asked to create a checklist or agenda, respond ONLY with a valid JSON object matching this exact schema: \`{"action": "create_checklist", "items": [{"task": "string", "assignee": "string", "dueDate": "YYYY-MM-DD"}]}\`. Do not add any other text, just the JSON.

4.  **Calendar Management:** You can perform various calendar operations:
   - **Create Events:** \`{"action": "create_calendar_event", "event": {"title": "string", "date": "YYYY-MM-DD", "time": "HH:MM", "endTime": "HH:MM", "description": "string", "assignees": ["string"], "allDay": false}}\`
   - **Update Events:** \`{"action": "update_calendar_event", "eventId": "string", "event": {"title": "string", "date": "YYYY-MM-DD", "time": "HH:MM", "endTime": "HH:MM", "description": "string", "assignees": ["string"], "allDay": false}}\`
   - **Delete Events:** \`{"action": "delete_calendar_event", "eventId": "string"}\`
   - **Query Events:** \`{"action": "query_calendar", "query": {"dateRange": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}, "assignee": "string", "searchTerm": "string"}}\`
   - **Schedule Conflicts:** When creating events, check existing calendar data for conflicts and suggest alternative times.
   - **Smart Scheduling:** Consider team member availability and existing reservations when scheduling.

5.  **Provide Navigation:** If asked for directions or to open a map, respond ONLY with a JSON object matching this schema: \`{"action": "navigate", "destination": "string"}\`. Do not add any other text.

6.  **Calendar Queries:** Answer questions about upcoming events, schedule conflicts, free time slots, and team member availability based on the calendar data provided.

**Calendar Integration Guidelines:**
- Always check existing calendar events before scheduling new ones
- Suggest optimal times based on existing schedule and team availability
- Provide helpful reminders about upcoming moving-related events
- Consider time zones and business hours when scheduling
- Offer to reschedule conflicting events when necessary

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