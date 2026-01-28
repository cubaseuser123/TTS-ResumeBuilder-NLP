import { createOpenAI } from "@ai-sdk/openai";

const apiKey = process.env.REACT_APP_AI_GATEWAY_API_KEY || '';
console.log("[AI Client] Gateway Key Status:", apiKey ? `Present (Starts with ${apiKey.substring(0, 4)}...)` : "MISSING");

const openai = createOpenAI({
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: apiKey,
});

// Using Mistral via Vercel Gateway
// We export it as 'geminiModel' alias to avoid breaking actions.ts imports immediately,
// but for clarity we should ideally rename. For now, maintaining compatibility.
export const geminiModel = openai('mistral/devstral-2');