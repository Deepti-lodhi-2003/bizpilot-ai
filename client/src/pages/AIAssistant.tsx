import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const AIAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
  try {
    const savedMessages = localStorage.getItem("bizpilot-ai-messages");

    if (!savedMessages) {
      return [];
    }

    const parsedMessages = JSON.parse(savedMessages);

    if (!Array.isArray(parsedMessages)) {
      return [];
    }

    return parsedMessages;
  } catch (error) {
    console.error("Failed to load AI chat:", error);
    return [];
  }
});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
  try {
    localStorage.setItem(
      "bizpilot-ai-messages",
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Failed to save AI chat:", error);
  }
}, [messages]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/ai/chat`,
        { message: text.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response.data.reply || "No response received.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, I encountered an error connecting to the AI. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    {
      title: "Analyze Sales",
      desc: "What are my top selling products this month?",
      icon: "bi-graph-up-arrow",
      color: "#0d6efd"
    },
    {
      title: "Inventory Check",
      desc: "Which products are running low on stock?",
      icon: "bi-box-seam",
      color: "#198754"
    },
    {
      title: "Customer Insights",
      desc: "Who are my top 5 customers by revenue?",
      icon: "bi-people",
      color: "#6f42c1"
    },
    {
      title: "Draft Email",
      desc: "Write a thank you email for recent buyers.",
      icon: "bi-envelope-paper",
      color: "#fd7e14"
    },
  ];

  return (
    <div className="container-fluid p-0 py-2 h-100 d-flex flex-column" style={{ minHeight: "calc(100vh - 100px)" }}>
      <div
        className="card border-0 shadow-sm flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ borderRadius: "16px", background: "#f8f9fa" }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 d-flex align-items-center justify-content-between"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.05)"
          }}
        >
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white me-3 shadow-sm"
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              <i className="bi bi-stars fs-4"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-dark">BizPilot AI Assistant</h5>
              
            </div>
          </div>
          <div>
            <button className="btn btn-light btn-sm text-muted rounded-pill px-3 shadow-sm border-0" 
            onClick={() => { setMessages([]);
            localStorage.removeItem("bizpilot-ai-messages");
            }}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Reset Chat
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className="flex-grow-1 overflow-auto p-4 d-flex flex-column"
          style={{
            scrollBehavior: "smooth",
            background: "radial-gradient(circle at center, #ffffff 0%, #f8f9fa 100%)"
          }}
        >
          {messages.length === 0 ? (
            <div className="m-auto w-100" style={{ maxWidth: "800px" }}>
              <div className="text-center mb-5 mt-4">
                <div className="mb-4 inline-block">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto shadow"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    }}
                  >
                    <i className="bi bi-robot" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                </div>
                <h1 className="fw-bold mb-3" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Hello! How can I help you today?
                </h1> 
                <p className="text-muted fs-5">I'm your intelligent business copilot. I can analyze your sales, manage inventory, and help you make data-driven decisions.</p>
              </div>

              <div className="row g-4 mt-2">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="col-md-6">
                    <div
                      className="card h-100 border-0 shadow-sm suggestion-card"
                      style={{
                        background: "#ffffff",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        borderRadius: "12px"
                      }}
                      onClick={() => handleSend(s.desc)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)";
                        e.currentTarget.style.border = `1px solid ${s.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                        e.currentTarget.style.border = "1px solid transparent";
                      }}
                    >
                      <div className="card-body p-4 d-flex align-items-start">
                        <div
                          className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: `${s.color}15`, color: s.color, width: "45px", height: "45px" }}
                        >
                          <i className={`bi ${s.icon} fs-5`}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">{s.title}</h6>
                          <p className="text-muted mb-0 small">{s.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-100 d-flex flex-column" style={{ maxWidth: "800px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex mb-4 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
                >
                  {msg.role === "ai" && (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white me-3 mt-1 shadow-sm flex-shrink-0"
                      style={{ width: "38px", height: "38px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                    >
                      <i className="bi bi-robot fs-6"></i>
                    </div>
                  )}

                  <div
                    className={`p-3 px-4 shadow-sm ${msg.role === "user"
                        ? "text-white"
                        : "bg-white text-dark border"
                      }`}
                    style={{
                      maxWidth: "85%",
                      background: msg.role === "user" ? "#212529" : "#ffffff",
                      borderBottomRightRadius: msg.role === "user" ? "4px" : "18px",
                      borderBottomLeftRadius: msg.role === "ai" ? "4px" : "18px",
                      borderTopLeftRadius: "18px",
                      borderTopRightRadius: "18px",
                      fontSize: "0.95rem"
                    }}
                  >
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                      {msg.content}
                    </p>
                  </div>

                  {msg.role === "user" && (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white ms-3 mt-1 shadow-sm flex-shrink-0 bg-dark"
                      style={{ width: "38px", height: "38px" }}
                    >
                      <i className="bi bi-person fs-6"></i>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="d-flex mb-4 justify-content-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white me-3 mt-1 shadow-sm flex-shrink-0"
                    style={{ width: "38px", height: "38px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                  >
                    <i className="bi bi-robot fs-6"></i>
                  </div>
                  <div
                    className="p-3 px-4 bg-white text-dark shadow-sm border d-flex align-items-center"
                    style={{
                      borderBottomLeftRadius: "4px",
                      borderTopLeftRadius: "18px",
                      borderTopRightRadius: "18px",
                      borderBottomRightRadius: "18px",
                      height: "50px"
                    }}
                  >
                    <div className="d-flex gap-2">
                      <span className="spinner-grow bg-secondary" style={{ animationDelay: "0ms", width: "8px", height: "8px" }} role="status"></span>
                      <span className="spinner-grow bg-secondary" style={{ animationDelay: "150ms", width: "8px", height: "8px" }} role="status"></span>
                      <span className="spinner-grow bg-secondary" style={{ animationDelay: "300ms", width: "8px", height: "8px" }} role="status"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-top" style={{ zIndex: 10 }}>
          <div className="mx-auto position-relative" style={{ maxWidth: "800px" }}>
            <div
              className="input-group p-2 bg-light rounded-pill border"
              style={{ transition: "all 0.3s ease" }}
            >
              <button
                className="btn btn-light rounded-circle text-muted d-flex align-items-center justify-content-center border-0 ms-1"
                type="button"
                style={{ width: "40px", height: "40px", background: "transparent" }}
              >
                <i className="bi bi-paperclip fs-5"></i>
              </button>

              <input
                type="text"
                className="form-control border-0 bg-transparent px-3"
                placeholder="Message BizPilot AI..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                style={{ boxShadow: "none", fontSize: "1rem" }}
              />

              <button
                className="btn rounded-circle d-flex align-items-center justify-content-center shadow-sm me-1"
                type="button"
                onClick={() => handleSend()}
                disabled={isLoading || !inputValue.trim()}
                style={{
                  width: "40px",
                  height: "40px",
                  background: inputValue.trim() ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e9ecef",
                  color: inputValue.trim() ? "white" : "#adb5bd",
                  border: "none",
                  transition: "all 0.3s ease"
                }}
              >
                <i className="bi bi-send-fill" style={{ marginLeft: "-2px" }}></i>
              </button>
            </div>
            <div className="text-center mt-3">
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                AI Assistant can occasionally make mistakes. Please verify important business information.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
