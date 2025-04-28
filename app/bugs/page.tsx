"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown } from "lucide-react";
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

const mockBugs = [
  {
    id: 1,
    title: "Login button not responsive",
    description: "The login button does not respond on click in Chrome.",
    status: "Open",
    priority: "High",
    assignee: "Jamie",
    tags: ["UI", "Login"],
    date: "2024-06-01",
    device: "Chrome on Mac",
    screenshot: "/placeholder.svg?height=48&width=80",
  },
  {
    id: 2,
    title: "Image upload fails",
    description: "Uploading images on Safari returns a 500 error.",
    status: "In Progress",
    priority: "Medium",
    assignee: "Sam",
    tags: ["Upload", "Safari"],
    date: "2024-06-02",
    device: "Safari on iPhone",
    screenshot: "/placeholder.svg?height=48&width=80",
  },
  {
    id: 3,
    title: "Dashboard graph not loading",
    description: "Graphs fail to render for some users on Edge.",
    status: "Resolved",
    priority: "Low",
    assignee: "Taylor",
    tags: ["Dashboard", "Graph"],
    date: "2024-06-03",
    device: "Edge on Windows",
    screenshot: "/placeholder.svg?height=48&width=80",
  },
];

const statusOptions = ["All", "Open", "In Progress", "Resolved"];
const priorityOptions = ["All", "High", "Medium", "Low"];

export default function BugReportsPage() {
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const filteredBugs = mockBugs.filter((bug) => {
    const matchesStatus = status === "All" || bug.status === status;
    const matchesPriority = priority === "All" || bug.priority === priority;
    const matchesSearch =
      bug.title.toLowerCase().includes(search.toLowerCase()) ||
      bug.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === filteredBugs.length) {
      setSelected([]);
    } else {
      setSelected(filteredBugs.map((bug) => bug.id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main container with rounded corners and shadow */}
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar activePage="/bugs" />

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
          {/* Bug Reports Table Content */}
          <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Bug Reports</h1>
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <input
                type="text"
                placeholder="Search bugs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm bg-gray-50"
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
              <button
                className="ml-auto bg-black text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={selected.length === 0}
              >
                Bulk Action
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl shadow border border-gray-100 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selected.length === filteredBugs.length && filteredBugs.length > 0}
                        onChange={selectAll}
                      />
                    </th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Priority</th>
                    <th className="p-3 text-left">Assignee</th>
                    <th className="p-3 text-left">Tags</th>
                    <th className="p-3 text-left">Device</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Screenshot</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBugs.map((bug) => (
                    <tr key={bug.id} className="border-t border-gray-100 hover:bg-amber-50/30">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(bug.id)}
                          onChange={() => toggleSelect(bug.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{bug.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{bug.description}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${bug.status === "Open" ? "bg-red-100 text-red-700" : bug.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{bug.status}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${bug.priority === "High" ? "bg-red-100 text-red-700" : bug.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{bug.priority}</span>
                      </td>
                      <td className="p-3">{bug.assignee}</td>
                      <td className="p-3">
                        {bug.tags.map((tag) => (
                          <span key={tag} className="inline-block bg-gray-100 text-gray-700 rounded px-2 py-0.5 mr-1 text-xs">{tag}</span>
                        ))}
                      </td>
                      <td className="p-3">{bug.device}</td>
                      <td className="p-3">{bug.date}</td>
                      <td className="p-3">
                        <Image src={bug.screenshot} alt="Screenshot" width={80} height={48} className="rounded shadow" />
                      </td>
                    </tr>
                  ))}
                  {filteredBugs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-gray-400">No bugs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 