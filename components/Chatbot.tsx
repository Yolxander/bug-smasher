"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Image as ImageIcon, RotateCcw } from "lucide-react";

interface Message {
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  options?: string[];
}

type FlowType = "report" | "help" | "track" | "badges" | "feedback" | null;

export default function Chatbot() {
  const initialMessage = {
    type: "bot" as const,
    content: "Hi there! I'm your Bug Smasher Assistant. What would you like to do?",
    timestamp: new Date(),
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [currentFlow, setCurrentFlow] = useState<FlowType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugPriority, setBugPriority] = useState<"low" | "medium" | "high" | "">("");
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resetChat = () => {
    setMessages([initialMessage]);
    setCurrentFlow(null);
    setCurrentStep(0);
    setBugTitle("");
    setBugDescription("");
    setBugPriority("");
    setInputValue("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFlowSelection = (flow: FlowType) => {
    setCurrentFlow(flow);
    let botResponse = "";
    let options: string[] | undefined;
    let flowLabel = "";
    
    switch (flow) {
      case "report":
        flowLabel = "Report a Bug";
        botResponse = "Let's report a bug! What's a short title for it?";
        break;
      case "help":
        flowLabel = "Get Help";
        botResponse = "What can I help you with?";
        options = [
          "How to submit a bug",
          "How to track my submissions",
          "What happens after submitting a bug",
          "How to earn badges"
        ];
        break;
      case "track":
        flowLabel = "Track Submissions";
        botResponse = "Want to check on a bug you submitted? What was the title (or keyword)?";
        break;
      case "badges":
        flowLabel = "View Badges";
        botResponse = "Curious about your badges? Let's take a look!";
        break;
      case "feedback":
        flowLabel = "Submit Feedback";
        botResponse = "Got an idea or feedback for Bug Smasher? What's your feedback?";
        break;
    }

    // Add the user's selection as a message
    setMessages(prev => [...prev, {
      type: "user",
      content: flowLabel,
      timestamp: new Date(),
    }]);

    // Add the bot's response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
        options,
      }]);
    }, 500);
  };

  const handleOptionClick = (option: string) => {
    const newMessage: Message = {
      type: "user",
      content: option,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      let nextOptions: string[] | undefined;

      switch (currentFlow) {
        case "report":
          switch (currentStep) {
            case 0:
              setBugTitle(option);
              botResponse = "Great! Now, please describe what happened (and what you expected).";
              break;
            case 1:
              setBugDescription(option);
              botResponse = "What's the priority of this bug?";
              nextOptions = ["Low", "Medium", "High"];
              break;
            case 2:
              setBugPriority(option.toLowerCase() as "low" | "medium" | "high");
              botResponse = "Would you like to attach a screenshot?";
              nextOptions = ["Upload", "Skip"];
              break;
            case 3:
              botResponse = "Perfect! I'm submitting your bug report now. Thanks for helping improve Bug Smasher!";
              setTimeout(() => {
                setIsOpen(false);
              }, 2000);
              break;
          }
          break;
        case "help":
          // Add help flow responses here
          break;
        // Add other flow cases here
      }

      if (botResponse) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: botResponse,
            timestamp: new Date(),
            options: nextOptions,
          },
        ]);
      }

      setCurrentStep((prev) => prev + 1);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    handleOptionClick(inputValue);
    setInputValue("");
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-black text-[#FFD700] p-4 rounded-full shadow-lg hover:bg-gray-900 hover:text-yellow-400 transition-colors border-2 border-[#FFD700]"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Bug Smasher Assistant</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="text-gray-400 hover:text-amber-600 transition-colors"
                title="Reset chat"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto max-h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-amber-400 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
                {message.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleOptionClick(option)}
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors text-sm"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!currentFlow && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => handleFlowSelection("report")}
                  className="p-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  Report a Bug
                </button>
                <button
                  onClick={() => handleFlowSelection("help")}
                  className="p-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  Get Help
                </button>
                <button
                  onClick={() => handleFlowSelection("track")}
                  className="p-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  Track Submissions
                </button>
                <button
                  onClick={() => handleFlowSelection("badges")}
                  className="p-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  View Badges
                </button>
                <button
                  onClick={() => handleFlowSelection("feedback")}
                  className="p-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {currentFlow && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-400 text-white p-2 rounded-lg hover:bg-amber-500 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
} 