import React, { useState, useEffect, useRef } from "react";
import UiIcon from "./UiIcon";

export default function AskPrometheusModal({
  isOpen,
  onOpen,
  onClose,
  onNavigate,
  citizenProfile
}) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello ${citizenProfile?.name ? citizenProfile.name.split(" ")[0] : "Citizen"}. How can I assist you with your government services or application tracking today?`,
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const LANGUAGES = [
    { code: "en", label: "English", locale: "en-IN" },
    { code: "ta", label: "தமிழ்", locale: "ta-IN" },
    { code: "hi", label: "हिन्दी", locale: "hi-IN" },
    { code: "te", label: "తెలుగు", locale: "te-IN" },
    { code: "kn", label: "ಕನ್ನಡ", locale: "kn-IN" }
  ];

  const QUICK_QUESTIONS = [
    "Track my application",
    "How to apply for Driving License?",
    "Check Voter services"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isProcessing]);

  // Voice Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleSendMessage(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, [selectedLang]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const current = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];
      recognitionRef.current.lang = current.locale;
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("track") || q.includes("status") || q.includes("pending")) {
      return {
        text: "You can track your submitted public applications with stage-by-stage status on our tracking page. Your recent RTO license request PROM-2026-00124 is currently under Processing.",
        action: { label: "Go to Application Tracking", tab: "tracking" }
      };
    }

    if (q.includes("licence") || q.includes("license") || q.includes("rto") || q.includes("driving")) {
      return {
        text: "You can apply for a Learner's Driving License (LLR) with One-Click prefill. Your verified Voter residence data will be automatically used with your explicit consent.",
        action: { label: "Open RTO Service", tab: "services" }
      };
    }

    if (q.includes("voter") || q.includes("epic") || q.includes("election")) {
      return {
        text: "Voter Services allow you to register for Form 6 electoral roll enrollment. Pre-filled from your verified citizen credentials.",
        action: { label: "Open Voter Services", tab: "services" }
      };
    }

    if (q.includes("welfare") || q.includes("scheme") || q.includes("dbt")) {
      return {
        text: "Jan Kalyan Welfare Schemes are accessible through Prometheus with verified income credential prefill.",
        action: { label: "Explore Welfare Schemes", tab: "services" }
      };
    }

    return {
      text: "Prometheus helps you apply for public services without retyping documents. Would you like to view connected services, track an application, or check your profile?",
      action: { label: "Explore Services", tab: "services" }
    };
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsProcessing(true);

    setTimeout(() => {
      const resp = generateAIResponse(text);
      const aiMsg = {
        sender: "ai",
        text: resp.text,
        action: resp.action,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <>
      {/* 1. Default Floating Trigger Button at Bottom-Right */}
      {!isOpen && (
        <button
          type="button"
          className="ask-prometheus-floating-trigger"
          onClick={onOpen}
          aria-label="Open Ask Prometheus AI Assistant"
        >
          <span className="trigger-sparkle">✨</span>
          <span className="trigger-label">Ask Prometheus</span>
        </button>
      )}

      {/* 2. Compact Floating Chat Window */}
      {isOpen && (
        <div
          className="ask-prometheus-chat-window"
          role="dialog"
          aria-modal="true"
          aria-label="Ask Prometheus Assistant"
        >
          {/* Header */}
          <div className="chat-window-header">
            <div className="header-brand-info">
              <span className="header-sparkle-icon">✨</span>
              <div>
                <strong>Prometheus AI Assistant</strong>
                <span className="header-sub">Citizen AI Assistant</span>
              </div>
            </div>

            <div className="header-controls">
              {/* Language Selector */}
              <select
                className="chat-lang-select"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                aria-label="Select language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>

              <button
                type="button"
                className="chat-close-btn"
                onClick={onClose}
                aria-label="Close assistant"
              >
                <UiIcon name="close" size={16} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-messages-container">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chat-message-row ${m.sender === "user" ? "user-row" : "ai-row"}`}
              >
                <div className={`chat-message-bubble ${m.sender === "user" ? "user-bubble" : "ai-bubble"}`}>
                  <p>{m.text}</p>
                  {m.action && (
                    <button
                      type="button"
                      className="chat-action-button"
                      onClick={() => {
                        if (onNavigate) onNavigate(m.action.tab);
                        onClose();
                      }}
                    >
                      <span>{m.action.label}</span>
                      <UiIcon name="arrowRight" size={12} />
                    </button>
                  )}
                  <span className="message-timestamp">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="chat-message-row ai-row">
                <div className="chat-message-bubble ai-bubble processing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="chat-quick-prompts-row">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="chat-quick-prompt-chip"
                onClick={() => handleSendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Live speech feedback if active */}
          {isListening && (
            <div className="chat-speech-listening-banner">
              <span className="pulse-mic-icon">🎙</span>
              <span>Listening... Speak now</span>
            </div>
          )}

          {/* Input Footer */}
          <form
            className="chat-input-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="chat-text-input"
              placeholder="Ask anything about government services..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Ask a question"
            />

            <button
              type="button"
              className={`chat-mic-btn ${isListening ? "listening" : ""}`}
              onClick={toggleVoiceInput}
              title="Voice Input (STT)"
              aria-label={isListening ? "Stop listening" : "Voice input"}
            >
              <UiIcon name="mic" size={16} />
            </button>

            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputText.trim()}
              aria-label="Send message"
            >
              <UiIcon name="arrowRight" size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
