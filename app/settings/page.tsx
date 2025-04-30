"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Settings, User, Lock, BellRing, Palette, Globe } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

type SettingType = "toggle" | "select" | "link";

interface Setting {
  id: number;
  name: string;
  description: string;
  type: SettingType;
  value?: boolean | string;
  options?: string[];
  action?: string;
}

interface SettingsSection {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  settings: Setting[];
}

// Mock data for settings sections
const settingsSections: SettingsSection[] = [
  {
    id: 1,
    title: "Account Settings",
    icon: <User className="h-5 w-5 text-blue-500" />,
    description: "Manage your account information and preferences",
    settings: [
      {
        id: 1,
        name: "Profile Information",
        description: "Update your name, email, and profile picture",
        type: "link",
        action: "#",
    },
    {
        id: 2,
        name: "Password",
        description: "Change your password",
        type: "link",
        action: "#",
    },
    {
        id: 3,
        name: "Two-Factor Authentication",
        description: "Enable or disable 2FA for additional security",
        type: "toggle",
        value: true,
      },
    ],
    },
    {
    id: 2,
    title: "Notification Preferences",
    icon: <BellRing className="h-5 w-5 text-green-500" />,
    description: "Configure how and when you receive notifications",
    settings: [
      {
        id: 4,
        name: "Email Notifications",
        description: "Receive updates via email",
        type: "toggle",
        value: true,
      },
      {
        id: 5,
        name: "Push Notifications",
        description: "Receive push notifications in your browser",
        type: "toggle",
        value: false,
      },
      {
        id: 6,
        name: "Notification Frequency",
        description: "Set how often you want to receive updates",
        type: "select",
        value: "daily",
        options: ["immediate", "daily", "weekly"],
      },
    ],
  },
  {
    id: 3,
    title: "Appearance",
    icon: <Palette className="h-5 w-5 text-purple-500" />,
    description: "Customize the look and feel of the application",
    settings: [
      {
        id: 7,
        name: "Theme",
        description: "Choose between light and dark mode",
        type: "select",
        value: "light",
        options: ["light", "dark", "system"],
      },
      {
        id: 8,
        name: "Language",
        description: "Select your preferred language",
        type: "select",
        value: "en",
        options: ["en", "es", "fr", "de"],
      },
    ],
  },
  {
    id: 4,
    title: "Privacy & Security",
    icon: <Lock className="h-5 w-5 text-red-500" />,
    description: "Manage your privacy and security settings",
    settings: [
      {
        id: 9,
        name: "Data Collection",
        description: "Control what data we collect about your usage",
        type: "toggle",
        value: true,
      },
      {
        id: 10,
        name: "Cookie Preferences",
        description: "Manage your cookie settings",
        type: "link",
        action: "#",
      },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsSection[]>(settingsSections);

  const handleToggle = (sectionId: number, settingId: number) => {
    setSettings((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map((setting) =>
                setting.id === settingId
                  ? { ...setting, value: !setting.value }
                  : setting
              ),
            }
          : section
      )
    );
  };

  const handleSelect = (sectionId: number, settingId: number, value: string) => {
    setSettings((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map((setting) =>
                setting.id === settingId ? { ...setting, value } : setting
        ),
            }
          : section
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="settings" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">Settings</h1>
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
              <div className="space-y-8">
                {settings.map((section) => (
                  <div key={section.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {section.icon}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">
                          {section.title}
                        </h2>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {section.settings.map((setting) => (
                        <div
                          key={setting.id}
                          className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                        >
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {setting.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {setting.description}
                            </p>
                          </div>
                          <div className="ml-4">
                            {setting.type === "toggle" && (
                          <button
                                type="button"
                                className={`${
                                  setting.value
                                    ? "bg-amber-400"
                                    : "bg-gray-200"
                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                                onClick={() => handleToggle(section.id, setting.id)}
                          >
                                <span
                                  className={`${
                                    setting.value
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                />
                          </button>
                            )}
                            {setting.type === "select" && setting.options && (
                                <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                                value={setting.value as string}
                                onChange={(e) =>
                                  handleSelect(section.id, setting.id, e.target.value)
                                }
                              >
                                {setting.options.map((option) => (
                                  <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                  ))}
                                </select>
                            )}
                            {setting.type === "link" && setting.action && (
                              <Link
                                href={setting.action}
                                className="text-amber-600 hover:text-amber-500 text-sm font-medium"
                              >
                                Edit
                              </Link>
                            )}
                          </div>
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