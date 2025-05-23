"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, ArrowLeft, Bug } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StepIndicator } from "../components/StepIndicator";
import { createBug } from "../actions/bugs";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { getTeams, Team, getTeamMembers, TeamMember } from "../actions/team";
import { getAssignees, Assignee } from "../actions/assignees";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function SubmitBugPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // Debug all URL parameters
  useEffect(() => {
    console.log('All URL Parameters:', Object.fromEntries(searchParams.entries()));
    console.log('Raw item parameter:', searchParams.get('item'));
  }, [searchParams]);

  const checklistItemId = searchParams.get("checklist_item_id");
  const rawItemParam = searchParams.get("item");
  const itemIdentifier = rawItemParam ? decodeURIComponent(rawItemParam) : '';

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    stepsToReproduce: string;
    expectedBehavior: string;
    actualBehavior: string;
    device: string;
    browser: string;
    os: string;
    status: string;
    priority: string;
    team_id: string;
    assignee_id: string;
    team: {
      id: string;
      name: string;
      description: string;
      status: string;
    };
    assignee: {
      id: string;
      name: string;
      avatar: string;
    };
    project: {
      id: string;
      name: string;
    };
    url: string;
    screenshot: File | string | null;
  }>({
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    device: "",
    browser: "",
    os: "",
    status: "Open",
    priority: "Medium",
    team_id: "",
    assignee_id: "",
    team: {
      id: "",
      name: "",
      description: "",
      status: ""
    },
    assignee: {
      id: "",
      name: "",
      avatar: ""
    },
    project: {
      id: "1",
      name: "Clever Project"
    },
    url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123",
    screenshot: null as File | string | null
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detect device type
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const device = isMobile ? "Mobile" : "Desktop";

      // Detect operating system
      const os = (() => {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

        if (macosPlatforms.indexOf(platform) !== -1) return 'macOS';
        if (iosPlatforms.indexOf(platform) !== -1) return 'iOS';
        if (windowsPlatforms.indexOf(platform) !== -1) return 'Windows';
        if (/Android/.test(userAgent)) return 'Android';
        if (/Linux/.test(platform)) return 'Linux';
        return 'Unknown';
      })();

      // Detect browser
      const browser = (() => {
        const userAgent = navigator.userAgent;
        if (userAgent.match(/chrome|chromium|crios/i)) return 'Chrome';
        if (userAgent.match(/firefox|fxios/i)) return 'Firefox';
        if (userAgent.match(/safari/i)) return 'Safari';
        if (userAgent.match(/opr\//i)) return 'Opera';
        if (userAgent.match(/edg/i)) return 'Edge';
        return 'Unknown';
      })();

      setFormData(prev => ({
        ...prev,
        device: prev.device || device,
        os: prev.os || os,
        browser: prev.browser || browser
      }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsData, assigneesData] = await Promise.all([
          getTeams(),
          getAssignees()
        ]);
        setTeams(teamsData);
        setAssignees(assigneesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch teams and assignees",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'team_id') {
      const selectedTeam = teams.find(team => team.id === value);
      setFormData(prev => ({
        ...prev,
        team_id: value,
        team: selectedTeam ? {
          id: selectedTeam.id,
          name: selectedTeam.name,
          description: selectedTeam.description,
          status: selectedTeam.status
        } : {
          id: "",
          name: "",
          description: "",
          status: ""
        },
        // Reset assignee when team changes
        assignee_id: "",
        assignee: {
          id: "",
          name: "",
          avatar: ""
        }
      }));

      // Fetch team members when a team is selected
      if (value) {
        try {
          const members = await getTeamMembers(value);
          setTeamMembers(members);
        } catch (error) {
          console.error('Error fetching team members:', error);
          toast({
            title: "Error",
            description: "Failed to fetch team members",
            variant: "destructive",
          });
        }
      } else {
        setTeamMembers([]);
      }
    } else if (name === 'assignee_id') {
      const selectedAssignee = assignees.find(assignee => assignee.id === value);
      setFormData(prev => ({
        ...prev,
        assignee_id: value,
        assignee: selectedAssignee ? {
          id: selectedAssignee.id,
          name: selectedAssignee.name,
          avatar: selectedAssignee.avatar
        } : {
          id: "",
          name: "",
          avatar: ""
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use FormData for multipart/form-data
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('steps_to_reproduce', formData.stepsToReproduce);
      form.append('expected_behavior', formData.expectedBehavior);
      form.append('actual_behavior', formData.actualBehavior);
      form.append('device', formData.device || 'Unknown');
      form.append('browser', formData.browser || 'Unknown');
      form.append('os', formData.os || 'Unknown');
      form.append('status', formData.status);
      form.append('priority', formData.priority);
      form.append('team_id', formData.team_id);
      form.append('assignee_id', formData.assignee_id);
      form.append('project_id', formData.project.id);
      form.append('url', formData.url);
      if (user?.id) form.append('reported_by', String(user.id));
      if (checklistItemId) form.append('checklist_item_id', checklistItemId);
      if (itemIdentifier) form.append('relatedItem', itemIdentifier);
      // Attach screenshot if present and is a file
      if (formData.screenshot && typeof formData.screenshot !== 'string') {
        form.append('screenshot', formData.screenshot);
      } else if (formData.screenshot && typeof formData.screenshot === 'string') {
        // If screenshot is a base64 string, convert to Blob
        const arr = (formData.screenshot as string).split(',');
        if (arr && arr.length === 2) {
          const mimeMatch = arr[0].match(/:(.*?);/);
          if (mimeMatch) {
            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new Blob([u8arr], { type: mime });
            form.append('screenshot', file, 'screenshot.png');
          }
        }
      }

      // Use fetch directly for multipart/form-data
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bugs`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          // Remove Content-Type header to let the browser set it automatically with the boundary
        },
        body: form
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Bug report submitted successfully",
        });
        setFormData({
          title: "",
          description: "",
          stepsToReproduce: "",
          expectedBehavior: "",
          actualBehavior: "",
          device: "",
          browser: "",
          os: "",
          status: "Open",
          priority: "Medium",
          team_id: "",
          assignee_id: "",
          team: {
            id: "",
            name: "",
            description: "",
            status: "active"
          },
          assignee: {
            id: "",
            name: "",
            avatar: ""
          },
          project: {
            id: "",
            name: ""
          },
          url: "",
          screenshot: null as File | string | null
        });
        setCurrentStep(1);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit bug report');
      }
    } catch (error) {
      console.error("Error submitting bug:", error);
      toast({
        title: "Error",
        description: "Failed to submit bug report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, name: "Details", description: "Basic information about the bug" },
    { id: 2, name: "Reproduction", description: "Steps to reproduce the bug" },
    { id: 3, name: "Environment", description: "System and browser information" }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="submit" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold flex items-center gap-2">
                      <Bug className="h-6 w-6 text-red-600" />
                      <span>Submit a Bug Report</span>
                      {itemIdentifier && (
                        <span className="text-indigo-600 font-mono"> for ({itemIdentifier})</span>
                      )}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link
                      href="/dashboard"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back to Dashboard
                    </Link>
                  </div>
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
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <span>Report a New Bug</span>
                  {itemIdentifier && (
                    <span className="text-indigo-600 font-mono"> for ({itemIdentifier})</span>
                  )}
                </h2>
                <p className="text-gray-500 mb-6">Please provide detailed information about the bug you've encountered.</p>
                
                <StepIndicator
                  currentStep={steps.findIndex(step => step.id === currentStep) + 1}
                  totalSteps={steps.length}
                  steps={steps.map(step => step.name)}
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Bug Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="Brief description of the bug"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="Detailed description of the bug"
                      />
                    </div>

                    <div>
                      <label htmlFor="stepsToReproduce" className="block text-sm font-medium text-gray-700 mb-1">
                        Steps to Reproduce
                      </label>
                      <textarea
                        id="stepsToReproduce"
                        name="stepsToReproduce"
                        value={formData.stepsToReproduce}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="expectedBehavior" className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Behavior
                      </label>
                      <textarea
                        id="expectedBehavior"
                        name="expectedBehavior"
                        value={formData.expectedBehavior}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="What should have happened?"
                      />
                    </div>

                    <div>
                      <label htmlFor="actualBehavior" className="block text-sm font-medium text-gray-700 mb-1">
                        Actual Behavior
                      </label>
                      <textarea
                        id="actualBehavior"
                        name="actualBehavior"
                        value={formData.actualBehavior}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        placeholder="What actually happened?"
                      />
                    </div>

                    <div>
                      <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-1">
                        Screenshot (Optional)
                      </label>
                      <input
                        type="file"
                        id="screenshot"
                        name="screenshot"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData((prev) => ({ ...prev, screenshot: file }));
                          }
                        }}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="device" className="block text-sm font-medium text-gray-700 mb-1">
                          Device
                        </label>
                        <input
                          type="text"
                          id="device"
                          name="device"
                          value={formData.device}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                          placeholder="e.g., iPhone 12, MacBook Pro"
                        />
                      </div>

                      <div>
                        <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-1">
                          Browser
                        </label>
                        <input
                          type="text"
                          id="browser"
                          name="browser"
                          value={formData.browser}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                          placeholder="e.g., Chrome 91, Safari 14"
                        />
                      </div>

                      <div>
                        <label htmlFor="os" className="block text-sm font-medium text-gray-700 mb-1">
                          Operating System
                        </label>
                        <input
                          type="text"
                          id="os"
                          name="os"
                          value={formData.os}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                          placeholder="e.g., iOS 14.5, macOS 11.3"
                        />
                      </div>

                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign to Team
                        </label>
                        <select
                          name="team_id"
                          value={formData.team_id}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        >
                          <option value="">Select a team</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign to User
                        </label>
                        <select
                          name="assignee_id"
                          value={formData.assignee_id}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        >
                          <option value="">Select a user</option>
                          {formData.team_id
                            ? teamMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.user?.name || member.name}
                                </option>
                              ))
                            : assignees.map((assignee) => (
                                <option key={assignee.id} value={assignee.id}>
                                  {assignee.name}
                                </option>
                              ))}
                        </select>
                        {formData.team_id && teamMembers.length === 0 && (
                          <p className="mt-1 text-sm text-gray-500">No users available in this team</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={currentStep === 3 ? handleSubmit : nextStep}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : currentStep === 3 ? "Submit Bug Report" : "Next"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 