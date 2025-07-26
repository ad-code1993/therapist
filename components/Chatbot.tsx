"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, MessageCircle, Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ApiResponse {
  response: string;
  response_html: string;
  user_id: string;
  message_id: number;
  context_analysis: {
    user_id: string;
    total_messages: number;
    sentiment_trend: string;
    engagement_level: string;
    common_topics: string[];
    current_message_analysis: {
      is_crisis: boolean;
      is_urgent: boolean;
      is_positive: boolean;
      is_negative: boolean;
      is_wellness: boolean;
      message_length: number;
      has_question: boolean;
      urgency_level: string;
    };
  };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help you find the right therapist or answer any questions about our services. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userId] = useState("user_" + Math.random().toString(36).substr(2, 9));

  const sendMessageToAPI = async (message: string): Promise<ApiResponse> => {
    try {
      const response = await fetch('https://assistant-chatbot-u6ip.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          user_id: userId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to API:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const apiResponse = await sendMessageToAPI(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: apiResponse.response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Fallback response if API fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team for immediate assistance.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <Card className="w-80 h-96 bg-white shadow-2xl border border-gray-200">
            <CardHeader className="pb-2 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-sm text-gray-900">Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex flex-col h-full p-0 bg-white">
              {/* Messages - Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white max-h-80">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-2 py-1.5 ${
                        message.isUser
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.isUser ? (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      ) : (
                        <div className="text-xs leading-relaxed prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-1 space-y-0.5">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-1 space-y-0.5">{children}</ol>,
                              li: ({ children }) => <li className="text-xs">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              h1: ({ children }) => <h1 className="text-sm font-bold mb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                              h4: ({ children }) => <h4 className="text-sm font-bold mb-1">{children}</h4>,
                              h5: ({ children }) => <h5 className="text-sm font-bold mb-1">{children}</h5>,
                              h6: ({ children }) => <h6 className="text-sm font-bold mb-1">{children}</h6>,
                              blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-300 pl-2 italic">{children}</blockquote>,
                              code: ({ children }) => <code className="bg-gray-200 px-1 rounded text-xs">{children}</code>,
                              pre: ({ children }) => <pre className="bg-gray-200 p-1 rounded text-xs overflow-x-auto">{children}</pre>,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-2 py-1.5">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input - Fixed at Bottom */}
              <div className="flex gap-2 p-3 bg-white border-t border-gray-100">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 h-8 text-xs bg-white border-gray-300"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="h-8 w-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 