"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, Bug, Trophy, Star, Award, Medal } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

// Mock data for badges
const badges = [
  {
    id: 1,
    name: "Bug Hunter",
    description: "Reported 50 bugs",
    icon: <Bug className="h-6 w-6 text-amber-500" />,
    progress: 100,
    earned: true,
    date: "2024-03-15",
  },
  {
    id: 2,
    name: "Quality Champion",
    description: "Maintained 95% bug resolution rate",
    icon: <Trophy className="h-6 w-6 text-blue-500" />,
    progress: 100,
    earned: true,
    date: "2024-04-01",
  },
  {
    id: 3,
    name: "Rapid Responder",
    description: "Resolved 100 bugs within 24 hours",
    icon: <Star className="h-6 w-6 text-green-500" />,
    progress: 75,
    earned: false,
    date: null,
  },
  {
    id: 4,
    name: "Team Player",
    description: "Collaborated on 25 team projects",
    icon: <Award className="h-6 w-6 text-purple-500" />,
    progress: 60,
    earned: false,
    date: null,
  },
  {
    id: 5,
    name: "Bug Buster",
    description: "Fixed 200 critical bugs",
    icon: <Medal className="h-6 w-6 text-red-500" />,
    progress: 40,
    earned: false,
    date: null,
  },
];

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="badges" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">My Badges</h1>
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          {badge.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{badge.name}</h3>
                          <p className="text-sm text-gray-500">{badge.description}</p>
                        </div>
                      </div>
                      {badge.earned && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Earned
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    </div>
                    {badge.earned && (
                      <div className="mt-4 text-sm text-gray-500">
                        Earned on {new Date(badge.date!).toLocaleDateString()}
                      </div>
                    )}
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