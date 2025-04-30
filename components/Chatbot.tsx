"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Loader2, MessageSquare, RotateCcw } from "lucide-react";

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
  
  // Add state for all bug report fields
  const [bugData, setBugData] = useState({
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    device: "",
    browser: "",
    os: "",
    priority: "",
    screenshot: "None"
  });

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetChat = () => {
    setMessages([initialMessage]);
    setCurrentFlow(null);
    setCurrentStep(0);
    setBugData({
      title: "",
      description: "",
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      device: "",
      browser: "",
      os: "",
      priority: "",
      screenshot: "None"
    });
    setInputValue("");
  };

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
              setBugData(prev => ({ ...prev, title: option }));
              botResponse = "1️⃣ Now, let's describe the bug in detail.\n\nPlease provide a detailed description of what's happening. Include any error messages you see.";
              break;
            case 1:
              setBugData(prev => ({ ...prev, description: option }));
              botResponse = "2️⃣ Let's document how to reproduce the bug.\n\nWhat are the exact steps to reproduce this bug? Please list them in order, one step per line.";
              break;
            case 2:
              setBugData(prev => ({ ...prev, stepsToReproduce: option }));
              botResponse = "3️⃣ Let's describe what should happen.\n\nWhat should happen when following these steps? (Expected behavior)";
              break;
            case 3:
              setBugData(prev => ({ ...prev, expectedBehavior: option }));
              botResponse = "4️⃣ Now, let's describe what actually happens.\n\nWhat actually happens instead? (Actual behavior)";
              break;
            case 4:
              setBugData(prev => ({ ...prev, actualBehavior: option }));
              botResponse = "5️⃣ Let's collect information about your environment.\n\nWhat device are you using? (e.g., iPhone 12, MacBook Pro, etc.)";
              break;
            case 5:
              setBugData(prev => ({ ...prev, device: option }));
              botResponse = "Which browser are you using? (e.g., Chrome 120, Safari 17, Firefox 123)";
              break;
            case 6:
              setBugData(prev => ({ ...prev, browser: option }));
              botResponse = "What operating system are you using? (e.g., iOS 17, macOS Sonoma, Windows 11)";
              break;
            case 7:
              setBugData(prev => ({ ...prev, os: option }));
              botResponse = "6️⃣ Let's set the priority.\n\nHow would you rate the priority of this bug?\n\nOptions:\n- Low: Minor issue, doesn't affect core functionality\n- Medium: Affects some users but has workarounds\n- High: Affects many users or core functionality\n- Critical: System is down or data is at risk";
              nextOptions = ["Low", "Medium", "High", "Critical"];
              break;
            case 8:
              setBugData(prev => ({ ...prev, priority: option }));
              botResponse = "7️⃣ Finally, let's add a screenshot (optional).\n\nWould you like to attach a screenshot?";
              nextOptions = ["Upload", "Skip"];
              break;
            case 9:
              setBugData(prev => ({ ...prev, screenshot: option === "Skip" ? "None" : "Attached" }));
              botResponse = "Let me summarize what we've collected:\n\n" +
                "📝 Bug Report Summary:\n\n" +
                "🔹 Title: " + bugData.title + "\n" +
                "🔹 Description: " + bugData.description + "\n" +
                "🔹 Steps to Reproduce:\n" + bugData.stepsToReproduce.split('\n').map(step => "   • " + step).join('\n') + "\n" +
                "🔹 Expected Behavior: " + bugData.expectedBehavior + "\n" +
                "🔹 Actual Behavior: " + bugData.actualBehavior + "\n" +
                "🔹 Environment:\n" +
                "   • Device: " + bugData.device + "\n" +
                "   • Browser: " + bugData.browser + "\n" +
                "   • OS: " + bugData.os + "\n" +
                "🔹 Priority: " + bugData.priority + "\n" +
                "🔹 Screenshot: " + bugData.screenshot + "\n\n" +
                "Would you like to submit this bug report?";
              nextOptions = ["Yes", "No"];
              break;
            case 10:
              if (option === "Yes") {
                botResponse = "✅ Great! I've submitted your bug report. You can view it in the dashboard.\n\nCan I help you with anything else?";
                setCurrentFlow(null);
                setCurrentStep(0);
              } else {
                botResponse = "Bug report cancelled. You can start over if you'd like.";
                setTimeout(() => {
                  resetChat();
                }, 2000);
              }
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
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-xl w-96 h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Bug Smasher Assistant</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetChat}
                className="text-gray-400 hover:text-amber-500 transition-colors"
                title="Reset chat"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === "bot" && (
                      <Bot className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.content}</p>
                    {message.type === "user" && (
                      <User className="h-5 w-5 text-white flex-shrink-0" />
                    )}
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
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {currentFlow && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
} 