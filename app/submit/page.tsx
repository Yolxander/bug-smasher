"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StepIndicator } from "../components/StepIndicator";

function getMockDevice() {
  return "Chrome on MacBook Pro";
}
function getMockUrl() {
  if (typeof window !== "undefined") return window.location.href;
  return "https://staging.bugsmasher.com/projects/123";
}
function getMockTimestamp() {
  return new Date().toLocaleString();
}

const mockAssignees = [
  { name: "Mark Branson", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Sara Summer", avatar: "/placeholder.svg?height=32&width=32" },
];
const mockProject = "Clever Project";

export default function SubmitBugPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState(getMockUrl());
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    "Basic Information",
    "Priority & Due Date",
    "Screenshot",
    "Project & Assignee",
    "Review"
  ];

  // Pre-filled fields
  const device = getMockDevice();
  const timestamp = getMockTimestamp();

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setScreenshot(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the bug report to your backend
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-1">Bug Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-xl font-semibold mb-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none transition"
                placeholder="Give your bug a short, clear title..."
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full min-h-[100px] bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-black focus:outline-none transition"
                placeholder="Describe what happened, what you expected, and any other details..."
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-base bg-gray-50 font-medium focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-base bg-gray-50 font-medium focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Screenshot / Attachment</label>
            <label className="block w-full border-2 border-dashed border-black rounded-xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-black transition">
              <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
              <div className="flex flex-col items-center justify-center gap-2">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto text-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M20 16.5V19a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19v-2.5A2.5 2.5 0 0 1 6.5 14h11a2.5 2.5 0 0 1 2.5 2.5Z"/>
                </svg>
                <span className="text-xs text-black">Upload a file or drag and drop<br/>PNG, JPG, GIF up to 3MB</span>
                {screenshot && (
                  <div className="mt-2 flex flex-col items-center">
                    <Image src={screenshot} alt="Screenshot preview" width={120} height={80} className="rounded shadow" />
                    <span className="text-xs text-gray-400 mt-1">Screenshot.png</span>
                  </div>
                )}
              </div>
            </label>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Project</label>
                <select className="w-full rounded border border-gray-200 px-3 py-2 text-base bg-gray-50 font-medium focus:ring-2 focus:ring-black focus:outline-none">
                  <option>{mockProject}</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Assignee</label>
                <div className="flex flex-col gap-2">
                  {mockAssignees.map((a) => (
                    <div key={a.name} className="flex items-center gap-2">
                      <Image src={a.avatar} alt={a.name} width={24} height={24} className="rounded-full" />
                      <span className="text-sm text-gray-700">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Review Your Bug Report</h3>
              <div className="grid gap-4">
                <div>
                  <div className="text-sm font-semibold">Title</div>
                  <div className="text-gray-700">{title}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Description</div>
                  <div className="text-gray-700">{description}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold">Priority</div>
                    <div className="text-gray-700">{priority}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Due Date</div>
                    <div className="text-gray-700">{dueDate}</div>
                  </div>
                </div>
                {screenshot && (
                  <div>
                    <div className="text-sm font-semibold">Screenshot</div>
                    <div className="mt-2">
                      <Image src={screenshot} alt="Screenshot preview" width={200} height={150} className="rounded shadow" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="accent-black-500"
                id="subscribe"
              />
              <label htmlFor="subscribe" className="text-sm text-gray-700">Notify me about updates to this bug</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        <DashboardSidebar activePage="/submit" />
        <div className="flex-1 overflow-auto bg-gray-50">
          <header className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
            <div className="relative w-[400px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search bugs, reports, or team..."
                className="h-10 w-full rounded-full bg-gray-50 pl-10 pr-4 text-sm outline-none border border-gray-200 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="You"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">You</p>
                  <p className="text-xs text-gray-500">QA Tester</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </header>
          <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-xl font-extrabold text-black mb-2 flex items-center justify-center gap-2">
                Submit new Bug
              </h1>
      
            </div>
            {submitted ? (
              <div className="bg-black-50 border border-black text-black rounded-2xl p-8 text-center shadow-md animate-in fade-in zoom-in-95">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">🎉 Bug Submitted!</h2>
                <p className="mb-2">Thank you for making the product better. Our QA team will review your report soon.</p>
                <Link href="/my-submissions" className="inline-block mt-4 bg-black hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-full shadow transition">View My Submissions</Link>
              </div>
            ) : (
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} steps={steps} />
                <div className="bg-white rounded-2xl p-8 shadow border border-gray-100">
                  {renderStepContent()}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Bug URL</div>
                      <div className="text-xs text-gray-500 mb-2">Enter the URL where you found the bug</div>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="https://example.com/page"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Browser/Device</div>
                      <div className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">{device}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Timestamp</div>
                      <div className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">{timestamp}</div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`text-gray-600 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition ${currentStep === 1 ? 'invisible' : ''}`}
                    >
                      Previous
                    </button>
                    {currentStep === totalSteps ? (
                      <button
                        type="submit"
                        className="bg-black  hover:bg-black text-white font-semibold px-6 py-2 rounded-full shadow transition"
                      >
                        Submit Bug 🚀
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-black hover:bg-black text-white font-semibold px-6 py-2 rounded-full shadow transition"
                      >
                        Next Step
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 