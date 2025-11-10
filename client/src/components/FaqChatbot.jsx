import { useEffect, useMemo, useRef, useState } from "react";

const INITIAL_MESSAGE = {
  id: "welcome",
  author: "bot",
  text: "Hi! I'm the safetyc assistant. Ask me anything about our services, projects, or support hours.",
};

const buildMessage = (author, text) => ({
  id: `${author}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  author,
  text,
});

const normalizeQuery = (value) => value.trim().replace(/\s+/g, " ");

// Determine API base URL with priority: explicit env var -> production default -> dev proxy
const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, "");
  }

  if (import.meta.env.PROD) {
    return "https://safetyc-api.onrender.com/api";
  }

  return "/api";
})();

export default function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [faqError, setFaqError] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const containerRef = useRef(null);
  const messageEndRef = useRef(null);
  const panelRef = useRef(null);

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
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const popularQuestions = useMemo(() => faqs.slice(0, 3), [faqs]);

  const askQuestion = async (questionText) => {
    const normalizedQuestion = normalizeQuery(questionText);
    if (!normalizedQuestion) {
      return;
    }

    setSearchError(null);
    setMessages((prev) => [...prev, buildMessage("user", normalizedQuestion)]);
    setInput("");
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
            <div>
              <p className="faq-chatbot-title">Ask safetyc</p>
              <p className="faq-chatbot-subtitle">Instant answers to common questions</p>
            </div>
            <button
              type="button"
              className="faq-chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close FAQ chatbot"
            >
              ×
            </button>
          </header>

          <div className="faq-chatbot-messages">
            {faqError && (
              <div className="faq-chatbot-alert" role="status">
                {faqError}
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`faq-chatbot-message faq-chatbot-message-${message.author}`}
              >
                {renderMessage(message)}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <form className="faq-chatbot-form" onSubmit={handleSubmit}>
            <label htmlFor="faq-chatbot-input" className="sr-only">
              Ask the safetyc assistant a question
            </label>
            <input
              id="faq-chatbot-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              autoComplete="off"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {loading ? "…" : "Send"}
            </button>
          </form>

          {searchError && (
            <div className="faq-chatbot-alert" role="alert">
              {searchError}
            </div>
          )}

          {popularQuestions.length > 0 && (
            <div className="faq-chatbot-suggestions">
              <p className="faq-chatbot-suggestions-title">Popular questions</p>
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
      >
        {isOpen ? "Close" : "Need help?"}
      </button>
    </div>
  );
}
