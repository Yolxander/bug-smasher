"use client";
import React from "react";
import Link from "next/link";
import { Bell, ChevronDown, Book, FileText, Code, Settings, HelpCircle } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

// Mock data for documentation sections
const sections = [
  {
    id: 1,
    title: "Getting Started",
    description: "Learn the basics of our bug tracking system",
    icon: <Book className="h-6 w-6 text-blue-500" />,
    articles: [
      { id: 1, title: "Introduction", link: "#" },
      { id: 2, title: "Quick Start Guide", link: "#" },
      { id: 3, title: "System Requirements", link: "#" },
    ],
  },
  {
    id: 2,
    title: "Bug Reporting",
    description: "How to effectively report and track bugs",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    articles: [
      { id: 4, title: "Creating Bug Reports", link: "#" },
      { id: 5, title: "Bug Report Templates", link: "#" },
      { id: 6, title: "Best Practices", link: "#" },
    ],
  },
  {
    id: 3,
    title: "API Documentation",
    description: "Technical documentation for developers",
    icon: <Code className="h-6 w-6 text-purple-500" />,
    articles: [
      { id: 7, title: "API Overview", link: "#" },
      { id: 8, title: "Authentication", link: "#" },
      { id: 9, title: "Endpoints", link: "#" },
    ],
  },
  {
    id: 4,
    title: "Administration",
    description: "System configuration and management",
    icon: <Settings className="h-6 w-6 text-amber-500" />,
    articles: [
      { id: 10, title: "User Management", link: "#" },
      { id: 11, title: "Project Settings", link: "#" },
      { id: 12, title: "System Configuration", link: "#" },
    ],
  },
  {
    id: 5,
    title: "Troubleshooting",
    description: "Common issues and solutions",
    icon: <HelpCircle className="h-6 w-6 text-red-500" />,
    articles: [
      { id: 13, title: "Common Problems", link: "#" },
      { id: 14, title: "Error Messages", link: "#" },
      { id: 15, title: "Contact Support", link: "#" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="docs" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">Documentation</h1>
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        {section.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <ul className="space-y-2">
                        {section.articles.map((article) => (
                          <li key={article.id}>
                            <Link
                              href={article.link}
                              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                            >
                              <span className="mr-2">•</span>
                              {article.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
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