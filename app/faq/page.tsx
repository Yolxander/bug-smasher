"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, HelpCircle, Image as ImageIcon, Edit, GitBranch } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const questions = [
    {
      id: "screenshot-attach",
      category: "Screenshots & Attachments",
      icon: <ImageIcon className="h-5 w-5" />,
      question: "Why isn't my screenshot attaching?",
      answer: "If your screenshot isn't attaching, try these steps:\n1. Check if the file size is under 5MB\n2. Make sure you're using a supported format (PNG, JPG, or GIF)\n3. Try refreshing the page and attaching again\n4. If using the screenshot tool, ensure you've granted browser permissions\nStill having trouble? Contact support and we'll help you out!",
    },
    {
      id: "edit-bug",
      category: "Editing & Updates",
      icon: <Edit className="h-5 w-5" />,
      question: "How do I edit a bug I submitted?",
      answer: "Editing your bug is easy! Just go to your 'Submitted Bugs' section, find the bug you want to edit, and click the 'Edit' button. You can update any details, add more information, or attach additional files. Don't worry - we'll notify the team about your updates!",
    },
    {
      id: "post-submit",
      category: "General Questions",
      icon: <HelpCircle className="h-5 w-5" />,
      question: "What happens after I submit a bug?",
      answer: "Once you submit a bug, our system automatically assigns it a unique ID and notifies the relevant team members. You'll receive updates via email or in-app notifications about any status changes, comments, or when it's time to test the fix. You can track the progress in your dashboard!",
    },
    {
      id: "asana-integration",
      category: "Integrations",
      icon: <GitBranch className="h-5 w-5" />,
      question: "How does Asana integration work?",
      answer: "Our Asana integration makes bug tracking seamless! When you submit a bug, it automatically creates a corresponding task in your Asana project. Any updates in Bug Smasher sync to Asana, and vice versa. To set it up, just connect your Asana account in the Integrations settings!",
    },
  ];

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        <DashboardSidebar activePage="/faq" />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-black mb-2">Frequently Asked Questions</h1>
              <p className="text-lg text-gray-700">Quick answers to common questions about Bug Smasher</p>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
              />
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((item) => (
                <div
                  key={item.id}
                  className="bg-black rounded-xl overflow-hidden border border-gray-800"
                >
                  <button
                    onClick={() => setExpandedQuestion(expandedQuestion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-900 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-400 p-2 rounded-lg">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-amber-400">{item.category}</p>
                        <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                      </div>
                    </div>
                    {expandedQuestion === item.id ? (
                      <ChevronUp className="h-5 w-5 text-amber-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-amber-400" />
                    )}
                  </button>
                  {expandedQuestion === item.id && (
                    <div className="p-4 pt-0">
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-line text-gray-300">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No questions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 