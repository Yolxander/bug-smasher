import React from "react";
import { Bug, Zap, Brain, Target, Users, Flame, Clock, Smartphone, Copy, Eye, Star, Trophy } from "lucide-react";

export type BadgeCategory = "submission" | "quality" | "teamwork" | "consistency" | "special";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: BadgeCategory;
  points: number;
  progress?: number;
  unlocked: boolean;
  dateUnlocked?: string;
  requirements: {
    description: string;
    current: number;
    target: number;
  }[];
}

export const badgeCategories = [
  { id: "submission", name: "Submission", color: "bg-blue-100 text-blue-800" },
  { id: "quality", name: "Quality", color: "bg-green-100 text-green-800" },
  { id: "teamwork", name: "Teamwork", color: "bg-purple-100 text-purple-800" },
  { id: "consistency", name: "Consistency", color: "bg-amber-100 text-amber-800" },
  { id: "special", name: "Special", color: "bg-pink-100 text-pink-800" },
];

export const badges: Badge[] = [
  {
    id: "first-bug",
    name: "First Bug Smashed",
    description: "Submit your first bug report",
    icon: React.createElement(Bug, { className: "h-6 w-6" }),
    category: "submission",
    points: 10,
    unlocked: false,
    requirements: [
      {
        description: "Submit your first bug report",
        current: 0,
        target: 1,
      },
    ],
  },
  {
    id: "fast-catch",
    name: "Fast Catch",
    description: "Submit a bug within 24 hours of a new project launch",
    icon: React.createElement(Zap, { className: "h-6 w-6" }),
    category: "special",
    points: 25,
    unlocked: false,
    requirements: [
      {
        description: "Submit a bug within 24 hours of launch",
        current: 0,
        target: 1,
      },
    ],
  },
  {
    id: "detailed-detective",
    name: "Detailed Detective",
    description: "Submit 5 bugs with complete reproduction steps",
    icon: React.createElement(Brain, { className: "h-6 w-6" }),
    category: "quality",
    points: 50,
    unlocked: false,
    requirements: [
      {
        description: "Bugs with complete reproduction steps",
        current: 0,
        target: 5,
      },
    ],
  },
  {
    id: "sharp-shooter",
    name: "Sharp Shooter",
    description: "Submit 10 high-priority bugs that get confirmed and resolved",
    icon: React.createElement(Target, { className: "h-6 w-6" }),
    category: "quality",
    points: 100,
    unlocked: false,
    requirements: [
      {
        description: "High-priority bugs resolved",
        current: 0,
        target: 10,
      },
    ],
  },
  {
    id: "team-player",
    name: "Team Player",
    description: "Collaborate by assigning or helping review 10 bugs",
    icon: React.createElement(Users, { className: "h-6 w-6" }),
    category: "teamwork",
    points: 75,
    unlocked: false,
    requirements: [
      {
        description: "Bugs reviewed or assigned",
        current: 0,
        target: 10,
      },
    ],
  },
  {
    id: "bug-smasher-elite",
    name: "Bug Smasher Elite",
    description: "50 verified bug reports submitted!",
    icon: React.createElement(Flame, { className: "h-6 w-6" }),
    category: "submission",
    points: 200,
    unlocked: false,
    requirements: [
      {
        description: "Verified bug reports",
        current: 0,
        target: 50,
      },
    ],
  },
  {
    id: "consistency-champ",
    name: "Consistency Champ",
    description: "Submit at least one bug every week for 3 months",
    icon: React.createElement(Clock, { className: "h-6 w-6" }),
    category: "consistency",
    points: 150,
    unlocked: false,
    requirements: [
      {
        description: "Weeks with bug submissions",
        current: 0,
        target: 12,
      },
    ],
  },
  {
    id: "mobile-master",
    name: "Mobile Master",
    description: "Submit 15 bugs related to mobile responsiveness",
    icon: React.createElement(Smartphone, { className: "h-6 w-6" }),
    category: "special",
    points: 75,
    unlocked: false,
    requirements: [
      {
        description: "Mobile-related bugs submitted",
        current: 0,
        target: 15,
      },
    ],
  },
  {
    id: "copy-catcher",
    name: "Copy Catcher",
    description: "Find and report 10 copy/paste or typo errors",
    icon: React.createElement(Copy, { className: "h-6 w-6" }),
    category: "special",
    points: 50,
    unlocked: false,
    requirements: [
      {
        description: "Copy/typo errors reported",
        current: 0,
        target: 10,
      },
    ],
  },
  {
    id: "eagle-eye",
    name: "Eagle Eye",
    description: "Submit 20 UI/UX related bugs",
    icon: React.createElement(Eye, { className: "h-6 w-6" }),
    category: "quality",
    points: 100,
    unlocked: false,
    requirements: [
      {
        description: "UI/UX bugs submitted",
        current: 0,
        target: 20,
      },
    ],
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Earn 5 different badges",
    icon: React.createElement(Star, { className: "h-6 w-6" }),
    category: "special",
    points: 100,
    unlocked: false,
    requirements: [
      {
        description: "Different badges earned",
        current: 0,
        target: 5,
      },
    ],
  },
  {
    id: "bug-smasher-legend",
    name: "Bug Smasher Legend",
    description: "Earn all available badges",
    icon: React.createElement(Trophy, { className: "h-6 w-6" }),
    category: "special",
    points: 500,
    unlocked: false,
    requirements: [
      {
        description: "Total badges earned",
        current: 0,
        target: 12,
      },
    ],
  },
]; 