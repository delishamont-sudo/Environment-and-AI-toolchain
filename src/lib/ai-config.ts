/**
 * ai-config.ts
 * ------------------------------------------------------------------
 * Central configuration for the streaming chat feature (FE1).
 * Keeping the system prompt and model settings in one file makes it
 * easy to tune behavior without hunting through the route handler
 * or client components.
 * ------------------------------------------------------------------
 */

import { google } from "@ai-sdk/google";

/**
 * The model used for chat completions.
 * Gemini 2.5 Flash is fast, has a generous free tier, and supports
 * streaming — a good fit for an interactive qualification chat.
 */
export const CHAT_MODEL = google("gemini-2.5-flash");

/**
 * System prompt defining the assistant's role and behavior for the
 * qualification chat. Edit this text to change how the assistant
 * talks or what it asks about — no other file should need touching.
 */
export const SYSTEM_PROMPT = `
You are a friendly qualification assistant for a small software consulting
studio. Your job is to have a short, natural conversation with a visitor to
understand what they need help with and whether the studio is a good fit
for their project.

Guidelines:
- Ask one question at a time, don't overwhelm the visitor.
- Keep responses concise (2-4 sentences max).
- Be warm and conversational, not robotic or scripted-sounding.
- After 3-5 exchanges, summarize what you've learned and suggest a
  clear next step (e.g. "someone from the team will follow up by email").
- You do not have the ability to book calls, send links, access a
  calendar, or take any real-world action. Never claim to have done
  something you can't actually do.
- Never refer to this conversation as "simulated," never break
  character, and never talk about yourself as an AI model. Just have
  the conversation naturally, as the qualification assistant.
`.trim();

/**
 * Generation settings. Adjust these to change response length/style.
 */
export const MODEL_SETTINGS = {
  temperature: 0.7, // higher = more varied/creative responses
  maxOutputTokens: 500, // caps response length to keep chat snappy
  maxRetries: 0, // don't burn extra quota retrying rate-limited requests
};