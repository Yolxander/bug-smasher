"use client";
import React, { useState } from "react";
import { Bell, Mail, Shield, Palette, Layout, Key, Users, Save } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      inApp: true,
      dailyDigest: false,
    },
    appearance: {
      theme: "system",
      layout: "default",
    },
    admin: {
      defaultTags: ["bug", "feature", "enhancement"],
      autoAssign: [
        { condition: "priority:high", assignTo: "QA Lead" },
        { condition: "type:bug", assignTo: "Development Team" },
      ],
    },
    integrations: {
      asanaKey: "••••••••••••••••",
      slackWebhook: "••••••••••••••••",
    },
  });

  const tabs = [
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      id: "admin",
      title: "Admin Settings",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: <Key className="h-5 w-5" />,
    },
  ];

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        <DashboardSidebar activePage="/settings" />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="flex h-full">
            {/* Settings Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-amber-400 text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    {tab.title}
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-8">
              <div className="max-w-3xl">
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive email updates for bug status changes</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange("notifications", "email", !settings.notifications.email)}
                          className={`w-12 h-6 rounded-full transition ${
                            settings.notifications.email ? "bg-amber-400" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transform transition ${
                              settings.notifications.email ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div>
                          <h4 className="font-medium text-gray-900">In-App Alerts</h4>
                          <p className="text-sm text-gray-500">Get popup notifications for important updates</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange("notifications", "inApp", !settings.notifications.inApp)}
                          className={`w-12 h-6 rounded-full transition ${
                            settings.notifications.inApp ? "bg-amber-400" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transform transition ${
                              settings.notifications.inApp ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Appearance Settings</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Theme</h4>
                        <select
                          value={settings.appearance.theme}
                          onChange={(e) => handleSettingChange("appearance", "theme", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Layout</h4>
                        <select
                          value={settings.appearance.layout}
                          onChange={(e) => handleSettingChange("appearance", "layout", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                        >
                          <option value="default">Default</option>
                          <option value="compact">Compact</option>
                          <option value="spacious">Spacious</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "admin" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Admin Settings</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Default Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {settings.admin.defaultTags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Auto-Assign Rules</h4>
                        <div className="space-y-2">
                          {settings.admin.autoAssign.map((rule, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500">If</span>
                              <span className="font-medium">{rule.condition}</span>
                              <span className="text-gray-500">then assign to</span>
                              <span className="font-medium">{rule.assignTo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "integrations" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Integration Settings</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Asana API Key</h4>
                        <input
                          type="password"
                          value={settings.integrations.asanaKey}
                          onChange={(e) => handleSettingChange("integrations", "asanaKey", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                        />
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Slack Webhook URL</h4>
                        <input
                          type="password"
                          value={settings.integrations.slackWebhook}
                          onChange={(e) => handleSettingChange("integrations", "slackWebhook", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-500 transition">
                    <Save className="h-5 w-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 