"use client";

/**
 * page.tsx — Streaming Qualification Chat (FE1)
 * ------------------------------------------------------------------
 * Client-side chat UI. Uses the AI SDK's useChat hook to manage
 * message state, streaming, and the stop/regenerate lifecycle so we
 * don't have to hand-roll SSE parsing.
 *
 * Key behaviors implemented here (see brief's evaluation criteria):
 *   - Thinking indicator shown while waiting for the first token,
 *     then handed off smoothly to streamed text.
 *   - Stop button that halts generation without losing the partial
 *     message or breaking the ability to send another message.
 *   - Auto-scroll that only pins to bottom while the user is already
 *     there, and releases the moment they scroll up manually.
 *   - Mobile-friendly input bar that stays usable at phone width.
 * ------------------------------------------------------------------
 */

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  const isThinking = status === "submitted"; // waiting for first token
  const isStreaming = status === "streaming";
  const isBusy = isThinking || isStreaming;

  // --- Auto-scroll logic -------------------------------------------------
  // Only auto-scroll to bottom if the user was already at (or near) the
  // bottom before new content arrived. If they've scrolled up to read
  // earlier messages, we leave their scroll position alone.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isPinnedToBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isPinnedToBottom]);

  function handleScroll() {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    // within 80px of bottom counts as "at bottom"
    setIsPinnedToBottom(distanceFromBottom < 80);
  }

  function jumpToLatest() {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      setIsPinnedToBottom(true);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isBusy) return;
    sendMessage({ text: input });
    setInput("");
    setIsPinnedToBottom(true); // sending a message should re-pin
  }

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-3 shrink-0">
        <h1 className="text-base font-semibold text-gray-900">
          Project Qualification Chat
        </h1>
        <p className="text-xs text-gray-500">
          Tell us about your project and we'll see if we're a good fit.
        </p>
      </header>

      {/* Message list */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 py-4 space-y-4"
        >
          {messages.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-8">
              Say hello to start the conversation.
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return message.role === "assistant" ? (
                      <div
                        key={i}
                        className="prose prose-sm prose-p:my-1 max-w-none"
                      >
                        <ReactMarkdown>{part.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <span key={i}>{part.text}</span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          {/* Thinking indicator — shown before first token arrives.
              Rendered as its own bubble in the same position/style an
              assistant message will occupy, so the handoff to real
              text feels like a continuation, not a swap. */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Jump to latest button — appears when user has scrolled up */}
        {!isPinnedToBottom && (
          <button
            onClick={jumpToLatest}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg hover:bg-gray-700 transition"
          >
            ↓ Jump to latest
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          Something went wrong: {error.message.includes("quota") || error.message.includes("429")
            ? "Rate limit reached. Please wait a moment and try again."
            : "Failed to get a response. Please try again."}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-3 flex gap-2 items-end shrink-0"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
        />

        {isBusy ? (
          <button
            type="button"
            onClick={stop}
            className="shrink-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-700 transition"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}