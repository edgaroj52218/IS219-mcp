"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STARTER: Message = {
  id: "starter",
  role: "assistant",
  content:
    'Hi! I can answer questions about U.S. wage trends from 2010 to 2025. Try asking things like "What happened to real wages in 2022?" or "Did wages keep up with inflation between 2018 and 2023?"',
};

const SUGGESTIONS = [
  "What were wages in 2022?",
  "Compare nominal vs real wages in 2021",
  "Did wages keep up with inflation?",
  "What was the trend from 2018 to 2023?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([STARTER]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const payload = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "Unable to get a response.");
      }

      setMessages((curr) => [
        ...curr,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: payload.reply!,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  const showSuggestions = messages.length === 1;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafaf9",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Georgia', serif",
    }}>

      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "32px 40px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px #4ade80",
            }} />
            <span style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}>
              Student Reality Lab · MCP-Powered
            </span>
          </div>
          <h1 style={{
            color: "#ffffff",
            fontSize: "clamp(20px, 4vw, 28px)",
            fontWeight: "700",
            margin: "0 0 6px",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}>
            Wage Data Assistant
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "13px",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.5,
          }}>
            Ask anything about U.S. production & nonsupervisory wages from 2010–2025.
            Powered by BLS data (CES0500000008 · CUSR0000SA0).
          </p>
        </div>
      </header>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "32px 40px",
        maxWidth: "760px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {m.role === "assistant" && (
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                  flexShrink: 0,
                  marginRight: "10px",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <div style={{
                maxWidth: "72%",
                padding: "12px 16px",
                borderRadius: m.role === "user"
                  ? "18px 18px 4px 18px"
                  : "18px 18px 18px 4px",
                background: m.role === "user"
                  ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                  : "#ffffff",
                color: m.role === "user" ? "#ffffff" : "#1a1a1a",
                fontSize: "14px",
                lineHeight: "1.6",
                boxShadow: m.role === "assistant"
                  ? "0 1px 6px rgba(0,0,0,0.07)"
                  : "none",
                border: m.role === "assistant"
                  ? "1px solid rgba(0,0,0,0.06)"
                  : "none",
                fontFamily: m.role === "assistant"
                  ? "'Georgia', serif"
                  : "system-ui, sans-serif",
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 4px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#aaa",
                    display: "inline-block",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <p style={{
              fontSize: "13px",
              color: "#dc2626",
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}>
              {error}
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div style={{
          padding: "0 40px 16px",
          maxWidth: "760px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}>
          <p style={{
            fontSize: "11px",
            color: "#aaa",
            marginBottom: "10px",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Try asking
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "#ffffff",
                  color: "#1a1a2e",
                  fontSize: "12.5px",
                  cursor: "pointer",
                  fontFamily: "system-ui, sans-serif",
                  transition: "all 0.15s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a1a2e";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#1a1a2e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.color = "#1a1a2e";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        borderTop: "1px solid rgba(0,0,0,0.07)",
        background: "#ffffff",
        padding: "16px 40px",
        maxWidth: "760px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about wages, inflation, purchasing power..."
            disabled={isSending}
            autoComplete="off"
            style={{
              flex: 1,
              height: "44px",
              padding: "0 16px",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.12)",
              fontSize: "14px",
              fontFamily: "system-ui, sans-serif",
              outline: "none",
              background: "#f5f5f4",
              color: "#1a1a1a",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            style={{
              height: "44px",
              padding: "0 20px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              opacity: !input.trim() || isSending ? 0.45 : 1,
              transition: "opacity 0.15s",
              fontFamily: "system-ui, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            Send
          </button>
        </form>
        <p style={{
          fontSize: "11px",
          color: "#bbb",
          margin: "8px 0 0",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}>
          Data: BLS CES0500000008 & CUSR0000SA0 · 2010–2025 · Real wages in 2010 dollars
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
