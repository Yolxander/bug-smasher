"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, BookOpen, Code, Bug, Settings, Users } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Installation</h3>
            <div className="prose max-w-none text-white">
              <p className="mb-4">To get started with Bug Smasher, follow these simple steps:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Download the Bug Smasher extension from your browser's extension store</li>
                <li>Click "Add to Browser" to install the extension</li>
                <li>Pin the extension to your toolbar for easy access</li>
                <li>Sign in with your Bug Smasher account or create a new one</li>
              </ol>
            </div>
          </div>

          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Initial Setup</h3>
            <div className="prose max-w-none text-white">
              <p className="mb-4">After installation, you'll need to configure your workspace:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Connect your project repositories</li>
                <li>Set up your team members and roles</li>
                <li>Configure notification preferences</li>
                <li>Customize your bug report templates</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "submitting-bugs",
      title: "Submitting Bugs",
      icon: <Bug className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Effective Bug Reporting</h3>
            <div className="prose max-w-none text-white">
              <p className="mb-4">Follow these guidelines to submit high-quality bug reports:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide a clear, descriptive title</li>
                <li>Include detailed steps to reproduce</li>
                <li>Add screenshots or screen recordings</li>
                <li>Specify expected vs. actual behavior</li>
                <li>Include relevant environment details</li>
              </ul>
            </div>
          </div>

          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Bug Report Template</h3>
            <div className="prose max-w-none">
              <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300">
                {`Title: [Clear, descriptive title]

Description:
[Detailed description of the issue]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happens]

Environment:
- Browser: [Browser name and version]
- OS: [Operating system]
- Device: [Device type]

Additional Context:
[Any other relevant information]`}
              </pre>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "qa-best-practices",
      title: "QA Best Practices",
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Testing Guidelines</h3>
            <div className="prose max-w-none text-white">
              <p className="mb-4">Follow these best practices for effective QA testing:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Test across multiple browsers and devices</li>
                <li>Verify both positive and negative test cases</li>
                <li>Document all test scenarios and results</li>
                <li>Use consistent naming conventions</li>
                <li>Prioritize critical path testing</li>
              </ul>
            </div>
          </div>

          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Bug Triage Process</h3>
            <div className="prose max-w-none text-white">
              <p className="mb-4">Our recommended bug triage workflow:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Initial assessment and categorization</li>
                <li>Priority assignment based on impact</li>
                <li>Assignment to appropriate team member</li>
                <li>Regular status updates and tracking</li>
                <li>Verification and closure process</li>
              </ol>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Available Integrations</h3>
            <div className="prose max-w-none text-white">
              <p className="mb-4">Bug Smasher integrates with popular development tools:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>GitHub/GitLab repositories</li>
                <li>Jira and Trello project management</li>
                <li>Slack and Microsoft Teams notifications</li>
                <li>CI/CD pipeline integration</li>
                <li>Custom webhook support</li>
              </ul>
            </div>
          </div>

          <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
            <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">Setup Instructions</h3>
            <div className="prose max-w-none text-white">
              <p className="mb-4">To set up integrations:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Navigate to Settings → Integrations</li>
                <li>Select the service you want to connect</li>
                <li>Follow the authentication process</li>
                <li>Configure integration settings</li>
                <li>Test the connection</li>
              </ol>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        <DashboardSidebar activePage="/docs" />
        <div className="flex-1 overflow-auto bg-gray-50">
          <header className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
            <div className="relative w-[400px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search documentation..."
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
          <div className="p-8 max-w-7xl mx-auto ">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-black mb-2 flex items-center justify-center gap-2">
                Guide
              </h1>
              <p className="text-lg text-gray-700 font-medium">Everything you need to know about Bug Smasher</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-[45%]">
                <nav className="sticky top-8 space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-[50%] flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition ${
                        activeSection === section.id
                          ? "bg-amber-400 text-black"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {section.icon}
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>

              <div className=" w-[55%]">
                {sections.find((section) => section.id === activeSection)?.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 