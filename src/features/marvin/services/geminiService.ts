/// <reference lib="es2015" />

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { retryWithBackoff } from '@/lib/api/retry';
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

const extractJsonFromText = (text: string): string | null => {
  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  
  // Try to extract JSON from plain code blocks
  const plainCodeMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (plainCodeMatch) {
    const content = plainCodeMatch[1].trim();
    if (isJsonString(content)) {
      return content;
    }
  }
  
  // Return original text if no code blocks found
  return text.trim();
};

const createSystemInstruction = (appData: AppData) => {
  const locationContext = appData.location ? `
- User Location: ${appData.location.city ? `${appData.location.city}, ` : ''}${appData.location.state || ''} (${appData.location.latitude.toFixed(4)}, ${appData.location.longitude.toFixed(4)})` : `
- User Location: Not available (location access not granted or unavailable)`;

  return `You are MARVIN, a moving assistant AI integrated into a relocation app. Your goal is to be helpful, concise, and proactive. You have access to the user's moving plan data and can perform specific actions.

**App Data Context:**
Here is the current state of the user's move. Use this data to answer questions accurately. Do not make up information; if the data is not here, say so.
- Team Members: ${JSON.stringify(appData.teamMembers, null, 2)}
- Inventory: ${JSON.stringify(appData.inventory, null, 2)}
- Reservations: ${JSON.stringify(appData.reservations, null, 2)}
- Current Checklist: ${JSON.stringify(appData.checklist, null, 2)}
- Calendar Events: ${JSON.stringify(appData.calendar, null, 2)}
- Budget: ${JSON.stringify(appData.budget, null, 2)}${locationContext}

**Your Capabilities & Rules:**

1.  **Voice & Audio:** You have text-to-speech capabilities and can speak your responses aloud to users. When appropriate, mention that you can speak or that users can hear your responses. You support voice interaction through both speech recognition and synthesis.

2.  **Answer General & App-Specific Questions:** Use your knowledge and the provided App Data Context to answer questions about the user's move, including upcoming events, schedule conflicts, and calendar information.

3.  **Web Search & Location:** If a question requires current, real-world information (e.g., "where to buy boxes?", "moving company reviews", "how much tape to buy?", "what's open near me?"), you MUST use the provided Google Search tool. For location-based searches:
   - When user asks for places "near me", "nearby", or "within X miles", use their current location from the App Data Context above
   - If location is available, include the city/state in your search queries for better local results
   - If location is not available, inform the user and suggest they enable location access for better local recommendations
   - For searches like "stores near me" or "within 5-mile radius", be specific about the user's location in your search terms

4.  **Create Agendas via Calendar:** If asked to create an agenda or schedule, create calendar events instead using the calendar actions. The app doesn't currently support standalone checklists, so convert agenda requests into specific calendar events with dates and times.

5.  **Calendar Management:** You can perform various calendar operations:
   - **Create Events:** \`{"action": "create_calendar_event", "event": {"title": "string", "date": "YYYY-MM-DD", "time": "HH:MM", "endTime": "HH:MM", "description": "string", "assignees": ["string"], "allDay": false}}\`
   - **Update Events:** \`{"action": "update_calendar_event", "eventId": "string", "event": {"title": "string", "date": "YYYY-MM-DD", "time": "HH:MM", "endTime": "HH:MM", "description": "string", "assignees": ["string"], "allDay": false}}\`
   - **Delete Events:** \`{"action": "delete_calendar_event", "eventId": "string"}\`
   - **Query Events:** \`{"action": "query_calendar", "query": {"dateRange": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}, "assignee": "string", "searchTerm": "string"}}\`
   - **Schedule Conflicts:** When creating events, check existing calendar data for conflicts and suggest alternative times.
   - **Smart Scheduling:** Consider team member availability and existing reservations when scheduling.

6.  **Budget & Expense Management:** For budget-related requests, you can perform these actions:
   - **Add Expense:** \`{"action": "add_expense", "expense": {"categoryId": "string", "amount": number, "merchantName": "string", "description": "string", "date": "YYYY-MM-DD"}}\` (date is optional, defaults to today)
   - **Create Budget Category:** \`{"action": "create_budget_category", "category": {"name": "string", "estimatedAmount": number, "color": "#hexcolor", "icon": "icon-name"}}\` (color and icon are optional - if not provided, smart defaults will be chosen)
   - **Query Budget:** \`{"action": "query_budget", "query": {"type": "summary|by_category|recent_expenses|overspent_categories", "categoryId": "optional", "dateRange": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}}}\`

7.  **Budget Analysis & Guidance:**
   - Proactively alert users about overspent categories when relevant
   - Suggest budget optimizations based on spending patterns from the budget data
   - Remind users to track receipts and categorize expenses properly
   - Provide cost-saving tips for moving expenses based on their current spending
   - When adding expenses, always reference the category name in your confirmation

7.  **Provide Navigation:** If asked for directions or to open a map, respond ONLY with a JSON object matching this schema: \`{"action": "navigate", "destination": "string"}\`. Do not add any other text.

8.  **Calendar Queries:** Answer questions about upcoming events, schedule conflicts, free time slots, and team member availability based on the calendar data provided.

**Calendar Integration Guidelines:**
- Always check existing calendar events before scheduling new ones
- Suggest optimal times based on existing schedule and team availability
- Provide helpful reminders about upcoming moving-related events
- Consider time zones and business hours when scheduling
- Offer to reschedule conflicting events when necessary

**Agenda/Schedule Requests:**
- When users ask to "create an agenda" or "schedule tasks", create specific calendar events instead
- Break down weekly/daily agendas into individual calendar events with specific dates and times
- Use descriptive event titles and include helpful details in descriptions
- Suggest reasonable time slots based on typical moving activities (e.g., packing in evenings, moving company calls during business hours)

**Budget Integration Guidelines:**
- When adding expenses, use these standard category IDs: cat-1 (Packing Supplies), cat-2 (Transportation), cat-3 (Professional Services), cat-4 (New Home Essentials), cat-5 (Food & Refreshments), cat-6 (Miscellaneous/Contingency)
- Map user descriptions to appropriate category IDs (e.g., "boxes" → cat-1, "truck rental" → cat-2, "movers" → cat-3)
- Be helpful in suggesting the correct category if the user mentions something unclear
- Proactively mention when categories are approaching or exceeding their budget limits based on the current budget data
- For expense amounts, accept various formats ("fifty dollars", "$50", "50") and convert to numbers
- When querying budget information, provide clear, actionable insights from the actual budget data
- Reference actual spending amounts and category names from the provided budget context

**Smart Category Creation:**
- When creating categories, you can optionally specify appropriate colors and icons, or let the system choose smart defaults
- Good color choices: Red (#ef4444) for gas/fuel, Purple (#8b5cf6) for transportation, Green (#10b981) for food, Blue (#3b82f6) for supplies
- Valid icon options: Fuel, Truck, Utensils, PackingSupplies, MovingCompany, Broom, ShieldCheck, Warehouse, Plug, Wifi, Home, Groceries, Tape, MoversTip, Deposits, CreditCard, ShoppingCart, Couch, Bed, Paintbrush, Key, PetCare, ChildCare, ToolsEquipment, ProfessionalServicesIcon, HelpCircle, DollarSign, Briefcase, Gift, Clipboard, Settings
- If unsure about icons, omit the icon field to let the system choose semantically appropriate defaults from the valid options

Analyze the user's request and respond according to these rules. For standard chat, be friendly. For actions, be precise and return ONLY the specified JSON format.`;
};

const webSearchKeywords = [
  "search for", "find", "how much", "what is", "where can i", "what's open",
  "stores", "shops", "near me", "nearby", "within", "radius", "mile", "miles",
  "where to buy", "where can i get", "what stores", "what shops", "places to",
  "businesses", "locations", "companies", "services", "reviews", "ratings",
  "hours", "open", "closed", "available", "sell", "selling", "buy", "purchase"
];

interface MarvinResponse {
  text: string;
  sources?: GroundingChunk[];
  action?: AiAction;
  additionalActions?: AiAction[];
}

export const getMarvinResponse = async (prompt: string, appData: AppData): Promise<MarvinResponse> => {
  const model = 'gemini-2.5-flash';
  const systemInstruction = createSystemInstruction(appData);
  const useWebSearch = webSearchKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  
  console.log('MARVIN search decision:', {
    prompt: prompt.substring(0, 100) + '...',
    useWebSearch,
    matchedKeywords: webSearchKeywords.filter(keyword => prompt.toLowerCase().includes(keyword)),
    hasLocation: !!appData.location
  });

  const response: GenerateContentResponse = await retryWithBackoff(
    () =>
      ai.models.generateContent({
        model: model,
        contents: prompt,
        config: Object.assign(
          { systemInstruction },
          useWebSearch ? { tools: [{ googleSearch: {} }] } : {}
        ),
      }),
    {
      retries: 2,
      baseDelayMs: 750,
      maxDelayMs: 4000,
      shouldRetry: (error) => {
        const status = (error?.status ?? error?.code) as number | undefined;
        if (typeof status === "number" && status >= 400 && status < 500 && status !== 429) {
          return false;
        }
        const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";
        if (message.includes("invalid api key")) {
          return false;
        }
        return true;
      },
      onRetry: (error, attempt, delayMs) => {
        console.warn(`[Gemini] attempt ${attempt + 1} failed:`, error);
        console.warn(`[Gemini] retrying in ${delayMs}ms...`);
      },
    }
  );
  const text = response.text;
  
  console.log('MARVIN response analysis:', {
    hasText: !!text,
    textLength: text?.length || 0,
    hasGroundingMetadata: !!response.candidates?.[0]?.groundingMetadata,
    useWebSearch
  });
  
  // If we used web search, prioritize returning search results with sources
  if (useWebSearch) {
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = (groundingMetadata?.groundingChunks as GroundingChunk[]) ?? [];
    
    console.log('Web search results:', {
      sourcesCount: sources.length,
      hasText: !!text
    });
    
    // Return search results as text response with sources
    return { text: text || 'Search completed but no results found.', sources };
  }
  
  // For non-search requests, check if the response is a structured action JSON
  if (text) {
    console.log('MARVIN processing text response:', {
      textLength: text.length,
      containsJson: text.includes('{') && text.includes('}')
    });
    
    const extractedJson = extractJsonFromText(text);
    console.log('MARVIN extracted JSON:', {
      hasExtracted: !!extractedJson,
      isValidJson: extractedJson ? isJsonString(extractedJson) : false,
      extracted: extractedJson ? extractedJson.substring(0, 100) + '...' : null
    });
    
    if (extractedJson && isJsonString(extractedJson)) {
      try {
        const parsed = JSON.parse(extractedJson);
        console.log('MARVIN parsed JSON:', { parsed, isArray: Array.isArray(parsed) });
        
        // Handle array of actions (multiple actions)
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('MARVIN detected array of actions:', parsed.length);
          // For now, return the first action and let the handler process it
          // TODO: Could be enhanced to handle multiple actions sequentially
          const firstAction = parsed[0] as AiAction;
          if (firstAction.action) {
            console.log('Returning first action from array:', firstAction.action);
            return { text: '', action: firstAction, additionalActions: parsed.slice(1) };
          }
        }
        // Handle single action object
        else if (parsed.action) {
          const potentialAction = parsed as AiAction;
          console.log('MARVIN parsed single action:', {
            hasAction: !!potentialAction.action,
            actionType: potentialAction.action,
            fullAction: potentialAction
          });
          
          console.log('Returning structured action:', potentialAction.action);
          return { text: '', action: potentialAction };
        }
      } catch (parseError) {
        console.warn('MARVIN failed to parse extracted JSON:', parseError);
      }
    }
  }

  // Otherwise, it's a standard text response
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const sources = (groundingMetadata?.groundingChunks as GroundingChunk[]) ?? [];
  
  return { text: text || 'No response generated.', sources };
};
