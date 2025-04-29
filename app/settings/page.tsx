"use client";
import React, { useState } from "react";
import { Bell, Mail, Shield, Palette, Layout, Key, Users, Save, Plus, Trash2, Edit2, User } from "lucide-react";
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

  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [newRule, setNewRule] = useState({
    condition: "",
    conditionType: "priority",
    conditionValue: "",
    assignTo: "",
    assignToType: "role",
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

  const conditionTypes = [
    { value: "priority", label: "Priority" },
    { value: "type", label: "Type" },
    { value: "status", label: "Status" },
    { value: "label", label: "Label" },
  ];

  const conditionValues = {
    priority: ["low", "medium", "high", "critical"],
    type: ["bug", "feature", "enhancement", "task"],
    status: ["open", "in-progress", "review", "resolved"],
    label: [],
  };

  const assignToTypes = [
    { value: "role", label: "Role" },
    { value: "user", label: "User" },
    { value: "team", label: "Team" },
  ];

  const assignToOptions = {
    role: [
      { value: "QA Lead", label: "QA Lead" },
      { value: "Development Team", label: "Development Team" },
      { value: "Product Manager", label: "Product Manager" },
      { value: "Design Team", label: "Design Team" },
    ],
    user: [
      { value: "john.doe", label: "John Doe" },
      { value: "jane.smith", label: "Jane Smith" },
      { value: "mike.johnson", label: "Mike Johnson" },
      { value: "sarah.williams", label: "Sarah Williams" },
    ],
    team: [
      { value: "frontend", label: "Frontend Team" },
      { value: "backend", label: "Backend Team" },
      { value: "qa", label: "QA Team" },
      { value: "design", label: "Design Team" },
    ],
  };

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setSettings(prev => ({
        ...prev,
        admin: {
          ...prev.admin,
          defaultTags: [...prev.admin.defaultTags, newTag.trim()],
        },
      }));
      setNewTag("");
    }
  };

  const handleDeleteTag = (tag: string) => {
    setSettings(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        defaultTags: prev.admin.defaultTags.filter(t => t !== tag),
      },
    }));
  };

  const handleEditTag = (oldTag: string, newTag: string) => {
    setSettings(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        defaultTags: prev.admin.defaultTags.map(t => t === oldTag ? newTag : t),
      },
    }));
    setEditingTag(null);
  };

  const handleAddRule = () => {
    if (newRule.conditionType && newRule.conditionValue && newRule.assignTo) {
      const formattedRule = {
        condition: `${newRule.conditionType}:${newRule.conditionValue}`,
        assignTo: `${newRule.assignToType}:${newRule.assignTo}`,
        description: `If ${newRule.conditionType} is ${newRule.conditionValue}, assign to ${newRule.assignTo}`,
      };
      
      setSettings(prev => ({
        ...prev,
        admin: {
          ...prev.admin,
          autoAssign: [...prev.admin.autoAssign, formattedRule],
        },
      }));
      setNewRule({
        condition: "",
        conditionType: "priority",
        conditionValue: "",
        assignTo: "",
        assignToType: "role",
      });
    }
  };

  const handleDeleteRule = (index: number) => {
    setSettings(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        autoAssign: prev.admin.autoAssign.filter((_, i) => i !== index),
      },
    }));
  };

  const handleEditRule = (index: number, updatedRule: { condition: string; assignTo: string; description: string }) => {
    setSettings(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        autoAssign: prev.admin.autoAssign.map((rule, i) => 
          i === index ? updatedRule : rule
        ),
      },
    }));
    setEditingRule(null);
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
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Default Tags</h4>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add new tag"
                              className="px-3 py-1 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                            />
                            <button
                              onClick={handleAddTag}
                              className="p-1 rounded-lg bg-amber-400 text-black hover:bg-amber-500 transition"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {settings.admin.defaultTags.map((tag, index) => (
                            <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {editingTag === tag ? (
                                <input
                                  type="text"
                                  defaultValue={tag}
                                  onBlur={(e) => handleEditTag(tag, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleEditTag(tag, e.currentTarget.value);
                                    }
                                  }}
                                  className="bg-transparent outline-none"
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <span>{tag}</span>
                                  <button
                                    onClick={() => setEditingTag(tag)}
                                    className="p-1 hover:text-amber-400"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTag(tag)}
                                    className="p-1 hover:text-red-500"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Auto-Assign Rules</h4>
                            <p className="text-sm text-gray-500">Automatically assign bugs based on conditions</p>
                          </div>
                          <button
                            onClick={handleAddRule}
                            disabled={!newRule.conditionValue || !newRule.assignTo}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400 text-black hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                            Add Rule
                          </button>
                        </div>

                        {/* New Rule Form */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Condition Section */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">When a bug has</label>
                                <select
                                  value={newRule.conditionType}
                                  onChange={(e) => {
                                    setNewRule(prev => ({
                                      ...prev,
                                      conditionType: e.target.value,
                                      conditionValue: "",
                                    }));
                                  }}
                                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                                >
                                  {conditionTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">That is</label>
                                <select
                                  value={newRule.conditionValue}
                                  onChange={(e) => setNewRule(prev => ({ ...prev, conditionValue: e.target.value }))}
                                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                                >
                                  <option value="">Select a value</option>
                                  {conditionValues[newRule.conditionType as keyof typeof conditionValues]?.map(value => (
                                    <option key={value} value={value}>
                                      {value.charAt(0).toUpperCase() + value.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Assignment Section */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                                <select
                                  value={newRule.assignToType}
                                  onChange={(e) => {
                                    setNewRule(prev => ({
                                      ...prev,
                                      assignToType: e.target.value,
                                      assignTo: "",
                                    }));
                                  }}
                                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                                >
                                  {assignToTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <div className="relative">
                                  <select
                                    value={newRule.assignTo}
                                    onChange={(e) => setNewRule(prev => ({ ...prev, assignTo: e.target.value }))}
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none appearance-none"
                                  >
                                    <option value="">Select a {newRule.assignToType}</option>
                                    {assignToOptions[newRule.assignToType as keyof typeof assignToOptions]?.map(option => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  {newRule.assignToType === "team" && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                      <Users className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                  {newRule.assignToType === "role" && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                      <Shield className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                  {newRule.assignToType === "user" && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                      <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Preview Section */}
                          {newRule.conditionValue && newRule.assignTo && (
                            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Preview:</span> When a bug has{" "}
                                <span className="font-medium text-amber-600">{newRule.conditionType}</span> that is{" "}
                                <span className="font-medium text-amber-600">{newRule.conditionValue}</span>, it will be assigned to{" "}
                                <span className="font-medium text-amber-600">{newRule.assignToType}</span>{" "}
                                <span className="font-medium text-amber-600">{newRule.assignTo}</span>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Rules List */}
                        <div className="space-y-2">
                          {settings.admin.autoAssign.map((rule, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                              {editingRule === index ? (
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">When a bug has</label>
                                      <select
                                        value={newRule.conditionType}
                                        onChange={(e) => setNewRule(prev => ({ ...prev, conditionType: e.target.value }))}
                                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                                      >
                                        {conditionTypes.map(type => (
                                          <option key={type.value} value={type.value}>
                                            {type.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">That is</label>
                                      <select
                                        value={newRule.conditionValue}
                                        onChange={(e) => setNewRule(prev => ({ ...prev, conditionValue: e.target.value }))}
                                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                                      >
                                        {conditionValues[newRule.conditionType as keyof typeof conditionValues]?.map(value => (
                                          <option key={value} value={value}>
                                            {value.charAt(0).toUpperCase() + value.slice(1)}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                                      <select
                                        value={newRule.assignToType}
                                        onChange={(e) => setNewRule(prev => ({ ...prev, assignToType: e.target.value }))}
                                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                                      >
                                        {assignToTypes.map(type => (
                                          <option key={type.value} value={type.value}>
                                            {type.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          value={newRule.assignTo}
                                          onChange={(e) => setNewRule(prev => ({ ...prev, assignTo: e.target.value }))}
                                          placeholder={`Enter ${newRule.assignToType} name`}
                                          className="w-full p-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                                        />
                                        {newRule.assignToType === "team" && (
                                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                          </div>
                                        )}
                                        {newRule.assignToType === "role" && (
                                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <Shield className="h-4 w-4 text-gray-400" />
                                          </div>
                                        )}
                                        {newRule.assignToType === "user" && (
                                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <User className="h-4 w-4 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-2 flex justify-end gap-2">
                                    <button
                                      onClick={() => setEditingRule(null)}
                                      className="px-3 py-1 text-gray-600 hover:text-gray-900"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleEditRule(index, {
                                        condition: `${newRule.conditionType}:${newRule.conditionValue}`,
                                        assignTo: `${newRule.assignToType}:${newRule.assignTo}`,
                                        description: `If ${newRule.conditionType} is ${newRule.conditionValue}, assign to ${newRule.assignTo}`,
                                      })}
                                      className="px-3 py-1 bg-amber-400 text-black rounded-lg hover:bg-amber-500"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900">{rule.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingRule(index);
                                        const [conditionType, conditionValue] = rule.condition.split(':');
                                        const [assignToType, assignTo] = rule.assignTo.split(':');
                                        setNewRule({
                                          condition: "",
                                          conditionType,
                                          conditionValue,
                                          assignTo,
                                          assignToType,
                                        });
                                      }}
                                      className="p-1 hover:text-amber-400"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRule(index)}
                                      className="p-1 hover:text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </>
                              )}
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