"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, BookOpen, Code, Bug, Settings, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [currentStep, setCurrentStep] = useState(0);

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      steps: [
        {
          title: "Welcome to Bug Smasher!",
          description: "Let's get you set up! Start by creating your account using your email or GitHub. This will be your home base for all bug tracking activities. Don't worry, it's quick and secure!",
        },
        {
          title: "Customize Your Workspace",
          description: "Make Bug Smasher work for you! Set up your project preferences, choose your notification settings, and invite your team members. We'll help you organize everything just the way you like it.",
        },
        {
          title: "Take a Tour",
          description: "Ready to explore? We'll show you around the dashboard, introduce you to key features, and help you find everything you need. It's like having a personal guide to bug tracking!",
        },
      ],
    },
    {
      id: "bug-reports",
      title: "Bug Reports",
      icon: <Bug className="h-5 w-5" />,
      steps: [
        {
          title: "Let's Report a Bug",
          description: "Found something that needs fixing? Our friendly bug report form makes it easy! Just describe what you found, add some screenshots, and we'll help you provide all the details developers need to fix it.",
        },
        {
          title: "Stay in the Loop",
          description: "Keep track of your bug's journey! You'll get updates when the status changes, when developers add comments, or when it's time to test the fix. We'll make sure you never miss a beat.",
        },
        {
          title: "Manage Your Reports",
          description: "Your bugs, your way! Edit details, add more information, or close resolved issues. You can even organize them into categories or add tags to make them easier to find later.",
        },
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <Settings className="h-5 w-5" />,
      steps: [
        {
          title: "Discover Insights",
          description: "See the big picture! Our analytics dashboard shows you trends, patterns, and important metrics about your bugs. It's like having a crystal ball for your project's health!",
        },
        {
          title: "Create Custom Reports",
          description: "Need specific information? Create reports that show exactly what you're looking for. Filter by date, priority, status, or any other criteria. We'll help you make sense of all that data!",
        },
        {
          title: "Share Your Findings",
          description: "Got something important to share? Export your reports in different formats and share them with your team. Whether it's a quick update or a detailed analysis, we've got you covered!",
        },
      ],
    },
    {
      id: "team",
      title: "Team",
      icon: <Users className="h-5 w-5" />,
      steps: [
        {
          title: "Build Your Dream Team",
          description: "Teamwork makes the dream work! Invite your colleagues, assign roles, and set up your team structure. Everyone will know exactly what they're responsible for and how they can help.",
        },
        {
          title: "Set the Rules",
          description: "Keep everything running smoothly! Configure who can do what, set up approval workflows, and make sure everyone has the right level of access. It's all about working together effectively!",
        },
        {
          title: "Celebrate Success",
          description: "Watch your team shine! Track everyone's contributions, celebrate milestones, and see how your team is making a difference. We'll help you keep the momentum going!",
        },
      ],
    },
  ];

  const currentSection = sections.find((section) => section.id === activeSection);
  const totalSteps = currentSection?.steps.length || 0;
  const currentStepData = currentSection?.steps[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
          <div className="p-8 max-w-7xl mx-auto">
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
                      onClick={() => {
                        setActiveSection(section.id);
                        setCurrentStep(0);
                      }}
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

              <div className="w-[55%]">
                <div className="bg-black rounded-2xl p-6 shadow border border-gray-800">
                  <h3 className="text-xl font-bold bg-amber-400 text-black inline-block px-4 py-2 rounded-lg mb-4">
                    {currentSection?.title}
                  </h3>
                  <div className="prose max-w-none text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold">
                        {currentStep + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{currentStepData?.title}</p>
                        <p className="text-gray-400">{currentStepData?.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        currentStep === 0
                          ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                          : "bg-amber-400 text-black hover:bg-amber-500"
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentStep === totalSteps - 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        currentStep === totalSteps - 1
                          ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                          : "bg-amber-400 text-black hover:bg-amber-500"
                      }`}
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 