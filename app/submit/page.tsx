"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, ArrowLeft } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StepIndicator } from "../components/StepIndicator";
import { createBug } from "../actions/bugs";
import { toast } from "@/components/ui/use-toast";

export default function SubmitBugPage() {
  const [currentStep, setCurrentStep] = useState("details");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
      id: "1",
      name: "You",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    project: {
      id: "1",
      name: "Clever Project"
    },
    url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123"
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
        device,
        os,
        browser
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== "environment") {
      nextStep();
      return;
    }
    
    setLoading(true);
    try {
      const bugData = {
        title: formData.title,
        description: formData.description,
        steps_to_reproduce: formData.stepsToReproduce,
        expected_behavior: formData.expectedBehavior,
        actual_behavior: formData.actualBehavior,
        environment: {
          device: formData.device,
          browser: formData.browser,
          os: formData.os
        },
        priority: formData.priority,
        status: formData.status,
        screenshot: formData.screenshot,
        assignee_id: formData.assignee.id,
        project_id: formData.project.id,
        url: formData.url
      };

      await createBug(bugData);
      toast({
        title: "Success",
        description: "Bug report submitted successfully",
      });

      // Reset form and go back to first step
      setFormData({
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
          id: "1",
          name: "You",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        project: {
          id: "1",
          name: "Clever Project"
        },
        url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123"
      });
      setCurrentStep("details");
    } catch (error) {
      console.error('Error submitting bug:', error);
      toast({
        title: "Error",
        description: "Failed to submit bug report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const steps = [
    {
      id: "details",
      name: "Bug Details",
      description: "Describe the bug you encountered",
    },
    {
      id: "reproduction",
      name: "Reproduction Steps",
      description: "How to reproduce the issue",
    },
    {
      id: "environment",
      name: "Environment",
      description: "Device and browser information",
    },
  ];

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
                    <h1 className="text-xl font-semibold">Submit a Bug Report</h1>
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
                <h2 className="text-2xl font-bold mb-2">Report a New Bug</h2>
                <p className="text-gray-500 mb-6">Please provide detailed information about the bug you've encountered.</p>
                
                <StepIndicator
                  currentStep={steps.findIndex(step => step.id === currentStep) + 1}
                  totalSteps={steps.length}
                  steps={steps.map(step => step.name)}
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === "details" && (
                  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
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

                {currentStep === "reproduction" && (
                  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
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
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData((prev) => ({ ...prev, screenshot: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {currentStep === "environment" && (
                  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
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
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === "details"}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={currentStep === "environment" ? handleSubmit : nextStep}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : currentStep === "environment" ? "Submit Bug Report" : "Next"}
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