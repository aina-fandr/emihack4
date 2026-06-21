import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { chatService } from '../../services/chat.api';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant TrafficAssist. Je peux vous aider avec :\n• Les informations de trafic 🚦\n• Les itinéraires 🗺️\n• Les signalements ⚠️\n• Les statistiques 📊\n• La météo 🌤️\n• Les transports 🚕\nComment puis-je vous aider ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const currentLength = messages.length;

    const userMessage = {
      id: currentLength + 1,
      type: 'user',
      content: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(userText);
      
      const botMessage = {
        id: currentLength + 2,
        type: 'bot',
        content: response.reply || "Je n'ai pas pu générer de réponse.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur ChatAssistant:", error);
      const errorMessage = {
        id: currentLength + 2,
        type: 'bot',
        content: "Désolé, je rencontre des difficultés pour me connecter au serveur de trafic. Veuillez vérifier votre backend.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-16 z-[2000] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-24 right-16 z-[2000] bg-white rounded-2xl shadow-2xl border border-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden ${
          isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[500px]'
        }`}>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Assistant TrafficAssist</h3>
              <span className="text-[10px] text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full">IA</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMinimized(!isMinimized)} className="text-white hover:text-blue-200 transition">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 custom-scrollbar">
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-2 mb-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${message.type === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question sur le trafic..."
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                  />
                  <button onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white p-2 rounded-xl transition flex-shrink-0">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}