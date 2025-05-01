"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Loader2, MessageSquare, RotateCcw } from "lucide-react";
import { createSubmission } from "@/app/actions/submissions";
import { supabase } from "@/lib/supabase";

interface Message {
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  options?: string[];
  imagePreview?: string;
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
    priority: "Medium",
    status: "Open",
    screenshot: "",
    assignee: {
      name: "You",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    project: {
      id: "1",
      name: "Clever Project"
    },
    url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123"
  });

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [highlightedOption, setHighlightedOption] = useState<string | null>(null);

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
      priority: "Medium",
      status: "Open",
      screenshot: "",
      assignee: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      project: {
        id: "1",
        name: "Clever Project"
      },
      url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123"
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

  const handleOptionClick = async (option: string) => {
    const newMessage: Message = {
      type: "user",
      content: option,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(async () => {
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
              const { device: detectedDevice } = detectDeviceInfo();
              botResponse = "5️⃣ Let's collect information about your environment.\n\nWhat device are you using?";
              nextOptions = [
                "iPhone 12",
                "iPhone 13",
                "iPhone 14",
                "MacBook Pro",
                "MacBook Air",
                "Windows PC",
                "Android Phone",
                "iPad",
                "Other"
              ];
              setHighlightedOption(detectedDevice);
              break;
            case 5:
              setBugData(prev => ({ ...prev, device: option }));
              const { browser: detectedBrowser } = detectDeviceInfo();
              botResponse = "Which browser are you using?";
              nextOptions = [
                "Chrome",
                "Safari",
                "Firefox",
                "Edge",
                "Opera",
                "Brave",
                "Other"
              ];
              setHighlightedOption(detectedBrowser);
              break;
            case 6:
              setBugData(prev => ({ ...prev, browser: option }));
              const { os: detectedOS } = detectDeviceInfo();
              botResponse = "What operating system are you using?";
              nextOptions = [
                "iOS",
                "macOS",
                "Windows 10",
                "Windows 11",
                "Android",
                "Linux",
                "Other"
              ];
              setHighlightedOption(detectedOS);
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
              if (option === "Upload") {
                botResponse = "Please select a screenshot to upload:";
                // Trigger file input click
                setTimeout(() => {
                  fileInputRef.current?.click();
                }, 100);
              } else {
                setBugData(prev => ({ ...prev, screenshot: "" }));
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
                  "🔹 Screenshot: None\n\n" +
                  "Would you like to submit this bug report?";
                nextOptions = ["Yes", "No"];
                setCurrentStep(10);
              }
              break;
            case 10:
              if (option === "Yes") {
                console.log("Starting submission process...");
                console.log("Bug data to submit:", bugData);
                
                // Create submission with collected data
                const submissionData = {
                  title: bugData.title,
                  description: bugData.description,
                  stepsToReproduce: bugData.stepsToReproduce,
                  expectedBehavior: bugData.expectedBehavior,
                  actualBehavior: bugData.actualBehavior,
                  device: bugData.device,
                  browser: bugData.browser,
                  os: bugData.os,
                  priority: bugData.priority,
                  status: "Open",
                  screenshot: imagePreview || "",
                  assignee: {
                    name: "You",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  },
                  project: {
                    id: "1",
                    name: "Clever Project"
                  },
                  url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123"
                };

                console.log("Prepared submission data:", submissionData);

                try {
                  console.log("Calling createSubmission...");
                  const result = await createSubmission(submissionData);
                  console.log("Submission result:", result);
                  
                  if (result) {
                    console.log("Submission successful!");
                    botResponse = "✅ Great! I've submitted your bug report. You can view it in the dashboard.\n\nCan I help you with anything else?";
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
                      priority: "Medium",
                      status: "Open",
                      screenshot: "",
                      assignee: {
                        name: "You",
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      },
                      project: {
                        id: "1",
                        name: "Clever Project"
                      },
                      url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123"
                    });
                  } else {
                    console.error("Submission failed - no result returned");
                    throw new Error("Failed to create submission - no result returned");
                  }
                } catch (error) {
                  console.error('Detailed error submitting bug:', error);
                  if (error instanceof Error) {
                    console.error('Error message:', error.message);
                    console.error('Error stack:', error.stack);
                  }
                  botResponse = "❌ I'm sorry, there was an error submitting your bug report. Please try again later.";
                }
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

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setTempImage(file);
      return previewUrl;
    } catch (error) {
      console.error('Error creating preview:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = await handleFileUpload(file);
    if (previewUrl) {
      setMessages(prev => [...prev, {
        type: "user",
        content: "Screenshot uploaded",
        timestamp: new Date(),
      }]);

      // Show the image preview
      setMessages(prev => [...prev, {
        type: "bot",
        content: "",
        timestamp: new Date(),
        imagePreview: previewUrl
      }]);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "Great! Let me summarize what we've collected:\n\n" +
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
            "🔹 Screenshot: Attached\n\n" +
            "Would you like to submit this bug report?",
          timestamp: new Date(),
          options: ["Yes", "No"]
        }]);
        setCurrentStep(10);
      }, 500);
    }
  };

  const detectDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let device = "Other";
    let browser = "Other";
    let os = "Other";

    // Detect device
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      device = "iPhone 12"; // Default to iPhone 12 for iOS devices
    } else if (/Macintosh/i.test(userAgent)) {
      device = "MacBook Pro"; // Default to MacBook Pro for Macs
    } else if (/Windows/i.test(userAgent)) {
      device = "Windows PC";
    } else if (/Android/i.test(userAgent)) {
      device = "Android Phone";
    }

    // Detect browser
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) {
      browser = "Chrome";
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      browser = "Safari";
    } else if (/Firefox/i.test(userAgent)) {
      browser = "Firefox";
    } else if (/Edge/i.test(userAgent)) {
      browser = "Edge";
    } else if (/Opera|OPR/i.test(userAgent)) {
      browser = "Opera";
    } else if (/Brave/i.test(userAgent)) {
      browser = "Brave";
    }

    // Detect OS
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      os = "iOS";
    } else if (/Macintosh/i.test(userAgent)) {
      os = "macOS";
    } else if (/Windows 10/i.test(userAgent)) {
      os = "Windows 10";
    } else if (/Windows 11/i.test(userAgent)) {
      os = "Windows 11";
    } else if (/Android/i.test(userAgent)) {
      os = "Android";
    } else if (/Linux/i.test(userAgent)) {
      os = "Linux";
    }

    return { device, browser, os };
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
                    {message.imagePreview ? (
                      <img 
                        src={message.imagePreview} 
                        alt="Screenshot preview" 
                        className="max-w-full h-auto rounded-lg"
                      />
                    ) : (
                    <p className="text-sm">{message.content}</p>
                    )}
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
                          className={`px-3 py-1 rounded-full transition-colors text-sm ${
                            option === highlightedOption
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
} 