"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, Plus, Mail, MoreVertical, Shield, Code, Bug, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/DashboardSidebar";

// Mock data for team members
const mockTeamMembers = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Admin",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=48&width=48",
    bugsSubmitted: 12,
    bugsAssigned: 5,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Developer",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=48&width=48",
    bugsSubmitted: 8,
    bugsAssigned: 15,
    lastActive: "5 hours ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "QA Tester",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=48&width=48",
    bugsSubmitted: 25,
    bugsAssigned: 8,
    lastActive: "1 day ago",
  },
];

const roleOptions = ["Admin", "Developer", "QA Tester"];

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("QA Tester");

  const filteredMembers = mockTeamMembers.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = () => {
    // In a real app, this would send an invitation email
    console.log("Inviting:", inviteEmail, "as", inviteRole);
    setShowInviteModal(false);
    setInviteEmail("");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "Developer":
        return <Code className="h-4 w-4 text-green-500" />;
      case "QA Tester":
        return <Bug className="h-4 w-4 text-amber-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main container with rounded corners and shadow */}
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar activePage="/team" />

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
            <div className="relative w-[400px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search team members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          {/* Team Content */}
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Team Members</h1>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Invite Team Member
              </button>
            </div>

            {/* Team Members List */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`relative group bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 ${
                    member.role === "Admin"
                      ? "border-l-4 border-blue-500"
                      : member.role === "Developer"
                      ? "border-l-4 border-green-500"
                      : "border-l-4 border-amber-500"
                  }`}
                >
                  {/* More options button */}
                  <button className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full z-10">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  <div className="p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold line-clamp-1">{member.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            member.role === "Admin"
                              ? "bg-blue-100 text-blue-700"
                              : member.role === "Developer"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {getRoleIcon(member.role)}
                            {member.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1 line-clamp-1">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                      <span className="inline-flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                        <Bug className="h-3 w-3 text-amber-500" /> {member.bugsSubmitted} bugs submitted
                      </span>
                      <span className="inline-flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                        <Shield className="h-3 w-3 text-blue-400" /> {member.bugsAssigned} bugs assigned
                      </span>
                      <span className="inline-flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                        <Clock className="h-3 w-3 text-gray-400" /> Last active {member.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="text-center py-12 col-span-2">
                  <p className="text-gray-500">No team members found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                >
                  {roleOptions.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 