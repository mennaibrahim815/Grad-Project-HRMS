

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux"; 
import axios from "../../services/axios"; 
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";
import icon from "../../assets/icons/Icon.svg";


const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useSelector((state) => state.auth || {}); 
  const userAvatar = user?.general?.avatar || user?.avatar || defaultAvatar;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: message,
      avatar: userAvatar,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/chatbot/ask", {
        message: currentMessage,
      });

      const aiReply = res.data?.data?.reply || "I'm sorry, I couldn't process that.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Oops! Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{ borderColor: 'var(--bg-deep)' }}
        className="fixed bottom-5 right-5 w-18 h-18 text-white shadow-xl z-50 flex items-center justify-center hover:scale-110 transition-all active:scale-95 rounded-full border-4"
      >
        {open ? (
          <div className="bg-[#0095ff] hover:bg-[#0081dd] rounded-full w-18 h-full flex items-center justify-center">
            <i className="fas fa-times text-xl"></i> 
          </div>
        ) : (
          <i className="bg-transparent mp-.25">   
            <img src={icon} alt="Logo" className="w-18 h-18 ml-0.25 mb-0.75" />
          </i>
        )}
      </button>

      {/* Chat Box */}
      {open && (
        <div 
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
          className="fixed bottom-24 right-5 w-[400px] h-[600px] border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in zoom-in duration-300"
        >
          
          {/* Header */}
          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-main)' }}
            className="p-5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <i className="fas fa-robot text-blue-400"></i>
            </div>
            <div>
                <h3 style={{ color: 'var(--text-main)' }} className="font-bold text-sm">HR Smart Assistant</h3>
                <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active Now
                </p>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
            className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
          >
            {messages.length === 0 && (
                <div className="text-center py-20 opacity-20" style={{ color: 'var(--text-muted)' }}>
                    <i className="fas fa-comment-dots text-5xl mb-4"></i>
                    <p className="text-xs uppercase tracking-[0.2em] font-black">Start a conversation</p>
                </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Profile Image or AI Icon */}
                <div 
                  style={{ borderColor: 'var(--border-main)', backgroundColor: 'var(--bg-deep)' }}
                  className="w-8 h-8 rounded-full overflow-hidden shrink-0 border shadow-sm flex items-center justify-center"
                >
                  {msg.sender === "user" ? (
                    <img src={userAvatar} className="w-full h-full object-cover" alt="me" />
                  ) : (
                    <i className="fas fa-robot text-blue-400 text-xs"></i>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  style={msg.sender === "ai" ? { 
                    backgroundColor: 'var(--bg-deep)', 
                    color: 'var(--text-main)',
                    borderColor: 'var(--border-main)' 
                  } : {}}
                  className={`max-w-[75%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "border rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div 
                  style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--border-main)' }}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                    <i className="fas fa-robot text-blue-400 text-xs animate-pulse"></i>
                </div>
                <div 
                  style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--border-main)' }}
                  className="p-3 rounded-2xl rounded-tl-none border flex gap-1 items-center"
                >
                    <span className="w-1.5 h-1.5 bg-[#0095ff] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#0095ff] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#0095ff] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div 
            style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-main)' }}
            className="p-5 backdrop-blur-md"
          >
            <div className="relative flex items-center gap-3">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    style={{ 
                      backgroundColor: 'var(--input-bg)', 
                      borderColor: 'var(--border-main)', 
                      color: 'var(--text-main)' 
                    }}
                    className="flex-1 border px-5 py-3.5 rounded-2xl outline-none focus:border-blue-500/50 text-sm transition-all placeholder:text-muted"
                />

                <button
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    className="w-12 h-12 bg-[#0095ff] rounded-2xl text-white disabled:opacity-30 hover:bg-blue-500 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-90"
                >
                    <i className="fas fa-paper-plane text-sm"></i>
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;