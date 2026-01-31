import { useEffect, useMemo, useRef, useState } from "react";

const INITIAL_MESSAGE = {
  id: "welcome",
  author: "bot",
  text: "Hi! I'm the safetyc AI assistant. Ask me anything about our services, projects, or support hours.",
};

const GREETING_RESPONSE =
  "Hello! I'm here to help with anything about safetyc's services, projects, or support. What would you like to know?";

const buildMessage = (author, text) => ({
  id: `${author}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  author,
  text,
});

const normalizeQuery = (value) => value.trim().replace(/\s+/g, " ");

// Determine API base URL with priority: explicit env var -> production default -> dev proxy
const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Only use env var if it's a valid absolute URL (starts with http:// or https://)
  if (typeof envUrl === "string" && envUrl.trim()) {
    const trimmed = envUrl.trim().replace(/\/$/, "");
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
  }

  if (import.meta.env.PROD) {
    return "https://safetyc-api.onrender.com/api";
  }

  return "/api";
})();

// Modern AI Chat Icon Components
const ChatBotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 14.85 3.23 17.41 5.18 19.18L4 22L7.24 20.53C8.67 21.14 10.29 21.5 12 21.5C17.52 21.5 22 17.02 22 11.5C22 6.48 17.52 2 12 2Z" fill="currentColor" fillOpacity="0.2"/>
    <path d="M12 3C7.03 3 3 7.03 3 12C3 14.59 4.13 16.93 5.91 18.53L5.2 20.8L7.8 19.65C9.08 20.2 10.5 20.5 12 20.5C16.97 20.5 21 16.47 21 11.5C21 6.53 16.97 2.5 12 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8" cy="11" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="11" r="1.5" fill="currentColor"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BotAvatar = () => (
  <div className="faq-chatbot-avatar">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor" fillOpacity="0.2"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
      <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </div>
);

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="faq-chatbot-typing">
    <BotAvatar />
    <div className="faq-chatbot-typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

export default function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [faqError, setFaqError] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const containerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const panelRef = useRef(null);
  const lastMessageRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch FAQs once so we can surface suggestions and offline answers
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/faq`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to load FAQs (${response.status})`);
        }
        const data = await response.json();
        if (Array.isArray(data?.faqs)) {
          setFaqs(data.faqs);
        } else {
          throw new Error("Unexpected FAQ response format");
        }
      } catch (error) {
        console.error("FAQ fetch failed:", error);
        setFaqError(
          "I couldn't load the FAQ list right now. You can still ask questions and I'll do my best!"
        );
      }
    };

    fetchFaqs();
  }, []);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const node = messagesContainerRef.current;
    if (!node) {
      return;
    }

    const rafId = requestAnimationFrame(() => {
      const lastMessage = messages[messages.length - 1];
      const isBot = lastMessage?.author === "bot";
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (isMobile && isBot && lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const behavior = messages.length <= 1 ? "auto" : "smooth";
        node.scrollTo({ top: node.scrollHeight, behavior });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [messages, isOpen, loading]);

  const popularQuestions = useMemo(() => faqs.slice(0, 3), [faqs]);

  const askQuestion = async (questionText) => {
    const normalizedQuestion = normalizeQuery(questionText);
    if (!normalizedQuestion) {
      return;
    }

    setSearchError(null);
    setInput("");

    const userMessage = buildMessage("user", normalizedQuestion);

    if (/^(hi|hello|hey|hlw)\b/i.test(normalizedQuestion)) {
      const greetingMessage = buildMessage("bot", GREETING_RESPONSE);
      setMessages((prev) => [...prev, userMessage, greetingMessage]);
      setLoading(false);
      return;
    }

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/faq/search?q=${encodeURIComponent(normalizedQuestion)}`,
        {
          cache: "no-store",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to search FAQs (${response.status})`);
      }

      const data = await response.json();
      const { results = [], fallback = false } = data;

      if (results.length > 0) {
        const topAnswer = results[0];
        setMessages((prev) => [
          ...prev,
          buildMessage("bot", topAnswer.answer),
        ]);

        if (fallback) {
          const suggestionsText =
            "I didn't find an exact match, but here are some popular questions you can try: \n" +
            results
              .map((faq) => `• ${faq.question}`)
              .join("\n");
          setMessages((prev) => [
            ...prev,
            buildMessage("bot", suggestionsText),
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          buildMessage(
            "bot",
            "I couldn't find an answer for that. Try rephrasing, or reach us at +91 99073 71539."
          ),
        ]);
      }
    } catch (error) {
      console.error("FAQ search failed:", error);
      setSearchError("Hmm, something went wrong while searching. Please try again.");
      setMessages((prev) => [
        ...prev,
        buildMessage(
          "bot",
          "I'm having trouble fetching answers right now. You can call +91 99073 71539 or email mssafetyc@gmail.com."
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim() || loading) {
      return;
    }
    askQuestion(input);
  };

  const handleSuggestionClick = (question) => {
    setIsOpen(true);
    askQuestion(question);
  };

  const renderMessage = (message) => {
    const lines = message.text.split("\n");
    return lines.map((line, index) => (
      <p key={`${message.id}-${index}`} className="faq-chatbot-message-line">
        {line}
      </p>
    ));
  };

  return (
    <div ref={containerRef} className="faq-chatbot-container">
      {isOpen && (
        <div ref={panelRef} className="faq-chatbot-panel" aria-live="polite">
          <header className="faq-chatbot-header">
            <div className="faq-chatbot-header-left">
              <div className="faq-chatbot-header-icon">
                <ChatBotIcon />
                <span className="faq-chatbot-status-dot"></span>
              </div>
              <div>
                <p className="faq-chatbot-title">safetyc Assistant</p>
                <p className="faq-chatbot-subtitle">
                  <span className="faq-chatbot-status-text">Online</span> • Typically replies instantly
                </p>
              </div>
            </div>
            <button
              type="button"
              className="faq-chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close FAQ chatbot"
            >
              <CloseIcon />
            </button>
          </header>

          <div ref={messagesContainerRef} className="faq-chatbot-messages">
            {faqError && (
              <div className="faq-chatbot-alert" role="status">
                {faqError}
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={`faq-chatbot-message faq-chatbot-message-${message.author}`}
              >
                {message.author === "bot" && <BotAvatar />}
                <div className="faq-chatbot-message-content">
                  {renderMessage(message)}
                </div>
              </div>
            ))}
            {loading && <TypingIndicator />}
          </div>

          <form className="faq-chatbot-form" onSubmit={handleSubmit}>
            <label htmlFor="faq-chatbot-input" className="sr-only">
              Ask the safetyc assistant a question
            </label>
            <input
              ref={inputRef}
              id="faq-chatbot-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              autoComplete="off"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>

          {searchError && (
            <div className="faq-chatbot-alert" role="alert">
              {searchError}
            </div>
          )}

          {popularQuestions.length > 0 && (
            <div className="faq-chatbot-suggestions">
              <p className="faq-chatbot-suggestions-title">Quick questions</p>
              <div className="faq-chatbot-suggestions-list">
                {popularQuestions.map((faq) => (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => handleSuggestionClick(faq.question)}
                    className="faq-chatbot-suggestion"
                    disabled={loading}
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="faq-chatbot-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="faq-chatbot-panel"
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? <CloseIcon /> : <ChatBotIcon />}
        {!isOpen && <span className="faq-chatbot-button-tooltip">Chat with us</span>}
      </button>
    </div>
  );
}
