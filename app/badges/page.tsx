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
    category: "achievement"
  },
  {
    id: 2,
    name: "Quality Champion",
    description: "Assigned to 20 or more bugs",
    icon: "🏆",
    color: "bg-blue-100 text-blue-800",
    progress: 15,
    total: 20,
    category: "achievement"
  },
  {
    id: 3,
    name: "First Responder",
    description: "First to report a critical bug",
    icon: "🚨",
    color: "bg-red-100 text-red-800",
    progress: 1,
    total: 1,
    category: "special"
  },
  {
    id: 4,
    name: "Team Player",
    description: "Collaborated on 5 or more bugs",
    icon: "🤝",
    color: "bg-green-100 text-green-800",
    progress: 3,
    total: 5,
    category: "collaboration"
  }
];

export default function BadgesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || badge.category === selectedCategory
    return matchesSearch && matchesCategory
  });

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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full bg-gray-50 pl-10 pr-4 text-sm outline-none border border-gray-200 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main content area */}
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Badges</h1>
                <p className="text-gray-500">Track your achievements and progress</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Badge
              </Button>
            </div>

            <div className="grid gap-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search badges..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="achievement">Achievements</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                        <SelectItem value="collaboration">Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBadges.map((badge) => (
                  <Card key={badge.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${badge.color}`}>
                            <span className="text-2xl">{badge.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{badge.name}</h3>
                            <p className="text-sm text-gray-500">{badge.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {badge.progress}/{badge.total}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 