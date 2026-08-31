/**
 * route.ts — POST /api/chat
 * ------------------------------------------------------------------
 * Server-side route handler for the streaming qualification chat.
 * This is the ONLY place the API key is used — it lives in
 * .env.local and is never sent to the client.
 *
 * Flow:
 *   1. Client (useChat) POSTs the running message list here.
 *   2. We call streamText with our model + system prompt.
 *   3. We return the stream directly — Next.js handles the SSE
 *      wiring, and useChat on the client consumes it token by token.
 * ------------------------------------------------------------------
 */

import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { CHAT_MODEL, SYSTEM_PROMPT, MODEL_SETTINGS } from "@/lib/ai-config";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: CHAT_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    temperature: MODEL_SETTINGS.temperature,
    maxOutputTokens: MODEL_SETTINGS.maxOutputTokens,
    maxRetries: MODEL_SETTINGS.maxRetries,
  });

  // toUIMessageStreamResponse() formats the stream in the exact
  // shape useChat expects on the client (typed message parts,
  // not just raw text).
  return result.toUIMessageStreamResponse();
}