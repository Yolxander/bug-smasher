"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

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
  const [subtasks, setSubtasks] = useState([
    { text: "Steps to reproduce", done: false },
    { text: "Expected behavior", done: false },
    { text: "Actual behavior", done: false },
  ]);
  const [newSubtask, setNewSubtask] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [notifications, setNotifications] = useState(false);

  // Pre-filled fields
  const url = getMockUrl();
  const device = getMockDevice();
  const timestamp = getMockTimestamp();

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

  const handleSubtaskChange = (idx: number) => {
    setSubtasks((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, done: !s.done } : s))
    );
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { text: newSubtask, done: false }]);
      setNewSubtask("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main container with rounded corners and shadow */}
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar activePage="/submit" />
        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Header */}
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
          {/* Submit Bug Form Content */}
          <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Submit a Bug</h1>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Thank you for your report!</h2>
                <p>Your bug has been submitted and will be reviewed by the QA team.</p>
              </div>
            ) : (
              <form className="flex flex-col md:flex-row gap-8" onSubmit={handleSubmit}>
                {/* Left: Main bug form */}
                <div className="flex-1 bg-gray-50 rounded-2xl p-6 shadow border border-gray-100">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full text-2xl font-semibold mb-2 bg-transparent border-none focus:ring-0 focus:outline-none"
                    placeholder="Enter your bug title ..."
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full min-h-[80px] mb-4 bg-transparent border-none focus:ring-0 focus:outline-none text-base"
                    placeholder="Enter description"
                  />
                  <div className="mb-4 text-xs text-gray-400">Markdown formatting</div>
                  {/* Subtasks */}
                  <div className="mb-6">
                    <div className="font-medium mb-2 text-gray-700">Subtasks</div>
                    <div className="space-y-2">
                      {subtasks.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.done}
                            onChange={() => handleSubtaskChange(idx)}
                            className="accent-emerald-500"
                          />
                          <span className={sub.done ? "line-through text-gray-400" : ""}>{sub.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        placeholder="Add another subtask"
                        className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs"
                      />
                      <button type="button" onClick={handleAddSubtask} className="text-emerald-600 text-xs font-medium">Add</button>
                    </div>
                  </div>
                  {/* Attachments */}
                  <div className="mb-4">
                    <div className="font-medium mb-2 text-gray-700">Attachments</div>
                    <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer bg-white hover:bg-gray-50 transition">
                      <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M20 16.5V19a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19v-2.5A2.5 2.5 0 0 1 6.5 14h11a2.5 2.5 0 0 1 2.5 2.5Z"/></svg>
                        <span className="text-xs text-gray-500">Upload a file or drag and drop<br/>PNG, JPG, GIF up to 3MB</span>
                        {screenshot && (
                          <div className="mt-2 flex flex-col items-center">
                            <Image src={screenshot} alt="Screenshot preview" width={120} height={80} className="rounded shadow" />
                            <span className="text-xs text-gray-400 mt-1">Screenshot.png</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" className="text-gray-400 text-sm">Cancel</button>
                    <button type="submit" className="text-emerald-600 text-sm font-medium">Save bug</button>
                  </div>
                </div>
                {/* Right: Settings panel */}
                <div className="w-full md:w-[340px] flex-shrink-0 bg-white rounded-2xl p-6 shadow border border-gray-100 h-fit">
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Project</div>
                    <select className="w-full rounded border border-gray-200 px-3 py-2 text-sm bg-gray-50 font-medium">
                      <option>{mockProject}</option>
                    </select>
                    <button className="text-xs text-emerald-600 mt-1">Add new project</button>
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Assignee</div>
                    <div className="flex flex-col gap-2">
                      {mockAssignees.map((a) => (
                        <div key={a.name} className="flex items-center gap-2">
                          <Image src={a.avatar} alt={a.name} width={24} height={24} className="rounded-full" />
                          <span className="text-sm text-gray-700">{a.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Status</div>
                    <span className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">In progress</span>
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Priority</div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${priority === "Low" ? "bg-emerald-100 text-emerald-700" : priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{priority}</span>
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Due date</div>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded border border-gray-200 px-3 py-2 text-sm bg-gray-50" />
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Notifications</div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="accent-emerald-500" />
                      <span className="text-sm">Subscribe</span>
                    </label>
                    <div className="text-xs text-gray-400 mt-1">You're not receiving notifications from this thread.</div>
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Current URL</div>
                    <div className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">{url}</div>
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Browser/Device</div>
                    <div className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">{device}</div>
                  </div>
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-1">Timestamp</div>
                    <div className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">{timestamp}</div>
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