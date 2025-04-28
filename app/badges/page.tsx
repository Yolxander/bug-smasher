"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Search, Plus, Shield, Code, Bug, User, Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";

// Mock data for badges
const badges = [
  {
    id: 1,
    name: "Bug Hunter",
    description: "Submitted 10 or more bug reports",
    icon: "🐛",
    color: "bg-yellow-100 text-yellow-800",
    progress: 8,
    total: 10,
    category: "achievement",
    unlocked: false,
  },
  {
    id: 2,
    name: "Quality Champion",
    description: "Assigned to 20 or more bugs",
    icon: "🏆",
    color: "bg-blue-100 text-blue-800",
    progress: 20,
    total: 20,
    category: "achievement",
    unlocked: true,
  },
  {
    id: 3,
    name: "First Responder",
    description: "First to report a critical bug",
    icon: "🚨",
    color: "bg-red-100 text-red-800",
    progress: 1,
    total: 1,
    category: "special",
    unlocked: true,
  },
  {
    id: 4,
    name: "Team Player",
    description: "Collaborated on 5 or more bugs",
    icon: "🤝",
    color: "bg-green-100 text-green-800",
    progress: 3,
    total: 5,
    category: "collaboration",
    unlocked: false,
  },
];

export default function BadgesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredBadges = badges.filter((badge) => {
    const matchesSearch =
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || badge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar activePage="/badges" />
        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
            <div className="relative w-[400px]">
              <input
                type="search"
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full bg-gray-50 pl-10 pr-4 text-sm outline-none border border-gray-200 shadow-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-amber-500">
                {unlockedCount} / {badges.length} Badges Unlocked
              </span>
              <span className="hidden md:inline text-sm text-gray-400 italic">“Every bug you smash is a step to mastery!”</span>
            </div>
          </header>
          {/* Main content area */}
          <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">Badges <span className="text-amber-400 text-2xl">🏅</span></h1>
                <p className="text-gray-500">Collect badges by smashing bugs, collaborating, and helping your team!</p>
              </div>
              <div className="flex gap-2">
                <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">New badges coming soon!</span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative group rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col gap-3 transition-transform hover:scale-[1.03] hover:shadow-lg bg-white ${
                    badge.unlocked ? "" : "opacity-60 grayscale"
                  }`}
                >
                  {/* Confetti for unlocked badges */}
                  {badge.unlocked && (
                    <span className="absolute -top-3 -right-3 animate-bounce text-2xl">🎉</span>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl text-center text-shadow ${badge.color} shadow-md border-2 border-white`}>{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-1">
                        {badge.name}
                        {badge.unlocked && <span className="ml-1 text-green-500 text-base">✔</span>}
                      </h3>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${badge.unlocked ? "bg-green-400" : "bg-blue-400"}`}
                        style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                      {badge.progress}/{badge.total}
                    </span>
                  </div>
                  {/* Motivational progress text */}
                  {!badge.unlocked && (
                    <div className="text-xs text-amber-500 font-medium mt-1 animate-pulse">
                      {badge.total - badge.progress} to go!
                    </div>
                  )}
                  {badge.unlocked && (
                    <div className="text-xs text-green-500 font-medium mt-1 animate-bounce">
                      Unlocked!
                    </div>
                  )}
                </div>
              ))}
              {filteredBadges.length === 0 && (
                <div className="text-center py-12 col-span-2">
                  <p className="text-gray-500">No badges found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 