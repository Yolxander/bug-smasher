"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Book, FileText, Code, Settings, HelpCircle, BookOpen, Users, CheckSquare, Bug, ArrowRight, ChevronRight } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="docs" />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">System Documentation</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Creation and Authentication Flow */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h2 className="text-xl font-semibold">User Creation and Authentication Flow</h2>
                    </div>
                    <p className="text-gray-600">Learn about user registration, login, and authentication processes</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      User Creation and Authentication Flow
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Users can register through the signup process (<code className="bg-gray-100 px-1 rounded">/auth/signup</code>)</li>
                      <li>During registration, they provide email, password, and name</li>
                      <li>After registration, they are redirected to the login page</li>
                      <li>Login is handled through the <code className="bg-gray-100 px-1 rounded">AuthContext</code> which manages user state and authentication</li>
                      <li>Upon successful login, users are redirected to the onboarding process if they haven't completed it</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>

              {/* User and QA List Relationship */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckSquare className="h-5 w-5 text-green-500" />
                      <h2 className="text-xl font-semibold">User and QA List Relationship</h2>
                    </div>
                    <p className="text-gray-600">Understand how users interact with QA lists and checklist items</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-green-500" />
                      User and QA List Relationship
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">Users can see QA lists in the complete QA page because they are either:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>The creator of the QA list</li>
                      <li>Assigned to the QA list through team membership</li>
                      <li>Have been directly assigned to specific checklist items</li>
                    </ul>
                    <p className="text-gray-600">The QA list contains items that need to be checked, and users can:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Mark items as passed/failed</li>
                      <li>Add failure reasons when items fail</li>
                      <li>Add notes and comments</li>
                      <li>Link bugs to specific checklist items</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Checklist Items and Bug Relationship */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <Bug className="h-5 w-5 text-red-500" />
                      <h2 className="text-xl font-semibold">Checklist Items and Bug Relationship</h2>
                    </div>
                    <p className="text-gray-600">Learn how bugs are linked to checklist items and managed</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Bug className="h-5 w-5 text-red-500" />
                      Checklist Items and Bug Relationship
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">Each checklist item can have bugs associated with it. When a user finds an issue during QA, they can:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Mark the item as failed</li>
                      <li>Provide a failure reason</li>
                      <li>Create a bug report directly linked to that checklist item</li>
                    </ul>
                    <p className="text-gray-600">The bug report includes:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Title and description</li>
                      <li>Steps to reproduce</li>
                      <li>Expected vs actual behavior</li>
                      <li>Environment details</li>
                      <li>Priority and status</li>
                      <li>Assignment to team members</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>

              {/* User and Team Relationship */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-purple-500" />
                      <h2 className="text-xl font-semibold">User and Team Relationship</h2>
                    </div>
                    <p className="text-gray-600">Understand team membership and user roles</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      User and Team Relationship
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Users can be created without being assigned to a specific list item</li>
                      <li>However, they must be assigned to a team</li>
                    </ul>
                    <p className="text-gray-600">Teams have:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>A name and description</li>
                      <li>Multiple members with different roles</li>
                      <li>Status tracking</li>
                      <li>Project associations</li>
                    </ul>
                    <p className="text-gray-600">Users can:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Be members of multiple teams</li>
                      <li>Have different roles in different teams</li>
                      <li>Be assigned bugs and QA items through their team membership</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Team Page Functionality */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <h2 className="text-xl font-semibold">Team Page Functionality</h2>
                    </div>
                    <p className="text-gray-600">Explore team management features and capabilities</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-500" />
                      Team Page Functionality
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">The team page (<code className="bg-gray-100 px-1 rounded">/team</code>) shows:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>All teams the user belongs to</li>
                      <li>Team members in each team</li>
                      <li>Member roles and status</li>
                      <li>Actions available for team management</li>
                    </ul>
                    <p className="text-gray-600">Users can:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>View their team members</li>
                      <li>See team member roles and status</li>
                      <li>View team member statistics (bugs assigned/resolved)</li>
                      <li>Manage team memberships (if they have appropriate permissions)</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Team Assignment Flow */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowRight className="h-5 w-5 text-orange-500" />
                      <h2 className="text-xl font-semibold">Team Assignment Flow</h2>
                    </div>
                    <p className="text-gray-600">Learn how items are assigned to teams and members</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-orange-500" />
                      Team Assignment Flow
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">When creating a QA list or bug report:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Users can select a team to assign it to</li>
                      <li>Once a team is selected, they can choose specific team members</li>
                      <li>The assignment is tracked with status and timestamps</li>
                      <li>Team members can be notified of new assignments</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Bug Reporting and Team Collaboration */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <Bug className="h-5 w-5 text-red-500" />
                      <h2 className="text-xl font-semibold">Bug Reporting and Team Collaboration</h2>
                    </div>
                    <p className="text-gray-600">Understand the bug reporting process and team collaboration</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Bug className="h-5 w-5 text-red-500" />
                      Bug Reporting and Team Collaboration
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">Bugs can be reported in two ways:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Directly from a failed checklist item</li>
                      <li>Independently through the bug submission form</li>
                    </ul>
                    <p className="text-gray-600">When reporting a bug:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Users can assign it to a team</li>
                      <li>Select specific team members</li>
                      <li>Set priority and status</li>
                      <li>Add detailed information about the issue</li>
                    </ul>
                    <p className="text-gray-600">Team members can:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>View bugs assigned to them</li>
                      <li>Update bug status</li>
                      <li>Add comments and solutions</li>
                      <li>Track bug resolution progress</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Technical Implementation Details */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <Code className="h-5 w-5 text-blue-500" />
                      <h2 className="text-xl font-semibold">Technical Implementation Details</h2>
                    </div>
                    <p className="text-gray-600">Explore the technical architecture and implementation</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-500" />
                      Technical Implementation Details
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Project Structure</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li><code className="bg-gray-100 px-1 rounded">/app</code> - Main application directory
                        <ul className="list-disc pl-6 mt-2">
                          <li><code className="bg-gray-100 px-1 rounded">/actions</code> - Server actions for data operations</li>
                          <li><code className="bg-gray-100 px-1 rounded">/auth</code> - Authentication related pages</li>
                          <li><code className="bg-gray-100 px-1 rounded">/components</code> - Reusable UI components</li>
                          <li><code className="bg-gray-100 px-1 rounded">/contexts</code> - React context providers</li>
                          <li><code className="bg-gray-100 px-1 rounded">/qa</code> - QA checklist functionality</li>
                          <li><code className="bg-gray-100 px-1 rounded">/team</code> - Team management features</li>
                        </ul>
                      </li>
                    </ul>

                    <h3 className="font-semibold text-lg">Authentication Implementation</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Authentication is managed through <code className="bg-gray-100 px-1 rounded">AuthContext</code> in <code className="bg-gray-100 px-1 rounded">lib/auth-context.tsx</code></li>
                      <li>Token-based authentication using JWT stored in localStorage</li>
                      <li>Protected routes using middleware and context checks</li>
                      <li>Automatic token refresh and session management</li>
                    </ul>

                    <h3 className="font-semibold text-lg">Server Actions</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li><code className="bg-gray-100 px-1 rounded">/actions/profiles.ts</code> - User profile management</li>
                      <li><code className="bg-gray-100 px-1 rounded">/actions/qaChecklistActions.ts</code> - QA checklist operations</li>
                      <li><code className="bg-gray-100 px-1 rounded">/actions/team.ts</code> - Team management operations</li>
                      <li><code className="bg-gray-100 px-1 rounded">/actions/bugs.ts</code> - Bug tracking operations</li>
                      <li><code className="bg-gray-100 px-1 rounded">/actions/submissions.ts</code> - Bug submission handling</li>
                    </ul>

                    <h3 className="font-semibold text-lg">API Integration</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>RESTful API endpoints for all operations</li>
                      <li>Environment-based API URL configuration</li>
                      <li>Standardized error handling and response formatting</li>
                      <li>CSRF protection and secure headers</li>
                    </ul>

                    <h3 className="font-semibold text-lg">State Management</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>React Context for global state (auth, user, etc.)</li>
                      <li>Local state for component-specific data</li>
                      <li>Server state management through actions</li>
                      <li>Optimistic updates for better UX</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mt-8">
              <p className="text-blue-800">
                This system creates a comprehensive workflow where users, teams, QA lists, and bugs are all interconnected, 
                allowing for efficient bug tracking and quality assurance processes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 