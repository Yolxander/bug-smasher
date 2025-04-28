"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, Edit2, Trash2, Check, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/DashboardSidebar";

// Mock data for user's submissions
const mockSubmissions = [
  {
    id: 1,
    title: "Login button not responsive",
    description: "The login button does not respond on click in Chrome.",
    status: "Open",
    priority: "High",
    date: "2024-06-01",
    device: "Chrome on Mac",
    screenshot: "/placeholder.svg?height=48&width=80",
    canEdit: true,
  },
  {
    id: 2,
    title: "Image upload fails",
    description: "Uploading images on Safari returns a 500 error.",
    status: "In Progress",
    priority: "Medium",
    date: "2024-06-02",
    device: "Safari on iPhone",
    screenshot: "/placeholder.svg?height=48&width=80",
    canEdit: false,
  },
  {
    id: 3,
    title: "Dashboard graph not loading",
    description: "Graphs fail to render for some users on Edge.",
    status: "Resolved",
    priority: "Low",
    date: "2024-06-03",
    device: "Edge on Windows",
    screenshot: "/placeholder.svg?height=48&width=80",
    canEdit: false,
  },
];

const statusOptions = ["All", "Open", "In Progress", "Resolved"];
const priorityOptions = ["All", "High", "Medium", "Low"];

export default function MySubmissionsPage() {
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [editingBug, setEditingBug] = useState<number | null>(null);

  const filteredSubmissions = mockSubmissions.filter((submission) => {
    const matchesStatus = status === "All" || submission.status === status;
    const matchesPriority = priority === "All" || submission.priority === priority;
    const matchesSearch =
      submission.title.toLowerCase().includes(search.toLowerCase()) ||
      submission.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleEdit = (id: number) => {
    setEditingBug(id);
  };

  const handleDelete = (id: number) => {
    // In a real app, this would call an API to delete the submission
    console.log("Delete submission:", id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main container with rounded corners and shadow */}
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar activePage="/my-submissions" />

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
            <div className="relative w-[400px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search bugs, reports, or team..."
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
          {/* My Submissions Content */}
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">My Submissions</h1>
              <Link href="/submit" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900">
                Submit New Bug
              </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm bg-white"
              />
              <div>
                <label className="block text-xs mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submissions List */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`relative group bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 ${
                    submission.status === "Open"
                      ? "border-l-4 border-red-400"
                      : submission.status === "In Progress"
                      ? "border-l-4 border-yellow-400"
                      : "border-l-4 border-green-400"
                  }`}
                >
                  {/* Edit/Delete buttons */}
                  {submission.canEdit && (
                    <div className="absolute top-3 right-3 flex gap-1 z-10">
                      <button
                        onClick={() => handleEdit(submission.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                  <div className="p-5 pb-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold flex-1 line-clamp-1">{submission.title}</h3>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        submission.status === "Open"
                          ? "bg-red-100 text-red-700"
                          : submission.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {submission.status === "Open" && <AlertCircle className="h-3 w-3" />}
                        {submission.status === "In Progress" && <Clock className="h-3 w-3" />}
                        {submission.status === "Resolved" && <Check className="h-3 w-3" />}
                        {submission.status}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        submission.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : submission.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {submission.priority === "High" && <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />}
                        {submission.priority === "Medium" && <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full" />}
                        {submission.priority === "Low" && <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />}
                        {submission.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">{submission.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{submission.date}</span>
                      <span>•</span>
                      <span>{submission.device}</span>
                    </div>
                  </div>
                  {submission.screenshot && (
                    <div className="bg-gray-50 border-t border-gray-100 p-4 flex items-center justify-center">
                      <Image
                        src={submission.screenshot}
                        alt="Screenshot"
                        width={220}
                        height={120}
                        className="rounded shadow max-h-28 object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
              {filteredSubmissions.length === 0 && (
                <div className="text-center py-12 col-span-2">
                  <p className="text-gray-500">No submissions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 