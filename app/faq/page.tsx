"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, ChevronRight, HelpCircle, Search } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

// Mock data for FAQ categories and questions
const faqCategories = [
  {
    id: 1,
    title: "Getting Started",
    icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
    questions: [
      {
        id: 1,
        question: "How do I create my first bug report?",
        answer: "To create a bug report, click on the 'Submit' button in the navigation bar. Fill out the required fields including title, description, and steps to reproduce. You can also attach screenshots or files to provide more context.",
      },
      {
        id: 2,
        question: "What information should I include in a bug report?",
        answer: "A good bug report should include: a clear title, detailed description of the issue, steps to reproduce, expected vs actual behavior, environment details (browser, OS, etc.), and any relevant screenshots or error messages.",
      },
    ],
  },
  {
    id: 2,
    title: "Bug Tracking",
    icon: <HelpCircle className="h-5 w-5 text-green-500" />,
    questions: [
      {
        id: 3,
        question: "How do I track the status of my bug reports?",
        answer: "You can view all your submitted bug reports in the 'My Submissions' section. Each report shows its current status, assignee, and any updates or comments. You'll also receive notifications when there are changes to your reports.",
      },
      {
        id: 4,
        question: "Can I edit a bug report after submission?",
        answer: "Yes, you can edit your bug reports as long as they haven't been resolved. Click on the report in 'My Submissions' and use the edit button to make changes. All edits are tracked in the report's history.",
      },
    ],
  },
  {
    id: 3,
    title: "Team Collaboration",
    icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
    questions: [
      {
        id: 5,
        question: "How do I assign bugs to team members?",
        answer: "Team leads and project managers can assign bugs to team members through the bug report interface. Click on the 'Assign' button and select the team member from the dropdown menu. You can also set priority levels and due dates.",
      },
      {
        id: 6,
        question: "How can I communicate with my team about bugs?",
        answer: "Each bug report has a comments section where team members can discuss the issue. You can @mention team members to notify them, and all comments are tracked in the report's history. You can also use the built-in chat feature for real-time communication.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter((q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="faq" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">FAQ</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                      <Bell className="h-6 w-6" />
                    </button>
                    <div className="ml-3 relative">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none"
                          id="user-menu-button"
                        >
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                          <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-8">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {category.icon}
                      </div>
                      <h2 className="ml-4 text-lg font-medium text-gray-900">
                        {category.title}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {category.questions.map((q) => (
                        <div
                          key={q.id}
                          className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                        >
                          <button
                            className="flex items-center justify-between w-full text-left"
                            onClick={() => toggleQuestion(q.id)}
                          >
                            <span className="text-base font-medium text-gray-900">
                              {q.question}
                            </span>
                            <ChevronRight
                              className={`h-5 w-5 text-gray-400 transform transition-transform ${
                                expandedQuestions.includes(q.id) ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          {expandedQuestions.includes(q.id) && (
                            <div className="mt-2 text-sm text-gray-600">
                              {q.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 