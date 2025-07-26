"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, MessageCircle, Send, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help you find the right therapist or answer any questions about our services. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: "2",
      text: "Hi! I'm looking for a therapist who specializes in anxiety. Can you help me?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: "3",
      text: "Absolutely! We have several excellent therapists who specialize in anxiety treatment. Dr. Sarah Johnson and Dr. Emily Rodriguez both have extensive experience with anxiety disorders. Would you like me to show you their profiles?",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: "4",
      text: "That sounds great! What are their rates?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: "5",
      text: "Dr. Johnson charges $150/hour and Dr. Rodriguez charges $180/hour. Both offer sliding scale options for those in need. You can see detailed pricing on their profiles when you browse our therapist list.",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: "6",
      text: "How do I book a session?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: "7",
      text: "To book a session, you'll need to create an account first by clicking 'Get Started' in the navigation. Once signed up, you can browse therapists, view their availability, and schedule sessions directly through our platform.",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: "8",
      text: "What about privacy and confidentiality?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: "9",
      text: "Your privacy is our top priority! All sessions are confidential and secure. We use industry-standard encryption and our therapists are bound by strict confidentiality agreements. Your personal information and conversations are protected.",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: "10",
      text: "Do you offer emergency support?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: "11",
      text: "If you're experiencing a mental health emergency, please call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 for crisis support. For immediate danger, call 911. We're here for regular therapy support, but crisis situations require immediate professional help.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("therapist") || input.includes("find") || input.includes("help")) {
      return "I can help you find a therapist! We have verified professionals specializing in various areas like anxiety, depression, couples counseling, and more. Would you like to browse our therapist list or tell me more about what you're looking for?";
    }
    
    if (input.includes("sign up") || input.includes("register") || input.includes("account")) {
      return "Great! You can sign up by clicking the 'Get Started' button in the navigation. We have separate forms for therapists and patients. The process is quick and secure!";
    }
    
    if (input.includes("cost") || input.includes("price") || input.includes("rate")) {
      return "Our therapists set their own rates, typically ranging from $80-$200 per hour. You can see individual rates on each therapist's profile. We also offer sliding scale options for those in need.";
    }
    
    if (input.includes("privacy") || input.includes("confidential") || input.includes("secure")) {
      return "Your privacy is our top priority! All sessions are confidential and secure. We use industry-standard encryption and our therapists are bound by strict confidentiality agreements.";
    }
    
    if (input.includes("session") || input.includes("book") || input.includes("appointment")) {
      return "To book a session, you'll need to create an account first. Once signed up, you can browse therapists, view their availability, and schedule sessions directly through our platform.";
    }
    
    if (input.includes("emergency") || input.includes("crisis") || input.includes("urgent")) {
      return "If you're experiencing a mental health emergency, please call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 for crisis support. For immediate danger, call 911.";
    }
    
    return "Thank you for your message! I'm here to help with questions about finding therapists, booking sessions, our services, or general mental health support. Feel free to ask anything!";
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
          <Card className="w-72 h-96 bg-white shadow-2xl border border-gray-200">
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
                      <p className="text-xs leading-relaxed">{message.text}</p>
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