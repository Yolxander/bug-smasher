'use client'

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface NavItem {
  icon: string;
  label: string;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/" },
  {
    icon: "check-square",
    label: "QA",
    href: "#",
    children: [
      { icon: "check-square", label: "QA List", href: "/qa" },
      { icon: "plus-circle", label: "Submit QA", href: "/qa/submit" },
      { icon: "check-circle", label: "Complete QA", href: "/qa/complete" },
    ]
  },
  {
    icon: "bug",
    label: "Bugs",
    href: "#",
    children: [
      { icon: "bug", label: "Bug Reports", href: "/bugs" },
      { icon: "plus-circle", label: "Submit Bug", href: "/submit" },
      { icon: "clipboard", label: "My Submissions", href: "/my-submissions" },
    ]
  },
 
  { icon: "users", label: "Team", href: "/team" },
  { icon: "trophy", label: "Badges", href: "/badges" },
  { icon: "book", label: "Docs", href: "/docs" },
  { icon: "help-circle", label: "FAQ", href: "/faq" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

function getIcon(icon: string) {
  switch (icon) {
    case "dashboard":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-black text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        </div>
      );
    case "bug":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="8" height="14" x="8" y="6" rx="4"/><path d="M19 7l-3 2"/><path d="M5 7l3 2"/><path d="M19 19l-3-2"/><path d="M5 19l3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/></svg>
      );
    case "plus-circle":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      );
    case "clipboard":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M4 7h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>
      );
    case "check-square":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      );
    case "check-circle":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      );
    case "users":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      );
    case "trophy":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M18 8a6 6 0 1 1-12 0V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2Z"/></svg>
      );
    case "book":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M2 19.5A2.5 2.5 0 0 1 4.5 17H20"/><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4H20"/><path d="M20 22V2"/></svg>
      );
    case "help-circle":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      );
    case "settings":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      );
    default:
      return null;
  }
}

export function DashboardSidebar({ activePage }: { activePage: string }) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Automatically expand dropdowns when a child page is active
  useEffect(() => {
    const activeParents = navItems
      .filter(item => item.children?.some(child => 
        pathname === child.href || activePage === child.href.replace('/', '')
      ))
      .map(item => item.label)
    
    setExpandedItems(activeParents)
  }, [pathname, activePage])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const isActive = (item: NavItem) => {
    if (item.href === '#') return false
    // Ensure exact path matching by comparing the full paths
    return pathname === item.href
  }

  const isChildActive = (item: NavItem) => {
    if (!item.children) return false
    return item.children.some(child => isActive(child))
  }

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href))
    const isExpanded = expandedItems.includes(item.label)

    if (item.children) {
      return (
        <div key={item.label} className="space-y-1">
          <div
            onClick={() => toggleExpand(item.label)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
              isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0 w-5 h-5">
                {getIcon(item.icon)}
              </div>
              <span className="ml-3">{item.label}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
          {isExpanded && (
            <div className="pl-8 space-y-1">
              {item.children.map(child => (
                <Link
                  key={child.label}
                  href={child.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === child.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex-shrink-0 w-5 h-5">
                    {getIcon(child.icon)}
                  </div>
                  <span className="ml-3">{child.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div key={item.label} className="space-y-1">
        <Link
          href={item.href}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0 w-5 h-5">
              {getIcon(item.icon)}
            </div>
            <span className="ml-3">{item.label}</span>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-[232px] flex flex-col rounded-l-3xl shadow-md border-r border-gray-100">
      <div className="p-6 flex justify-start rounded-lg">
        <Image src="/logo.png" alt="Bug Smasher Logo" width={60} height={60} className="mx-auto rounded-lg" />
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(item => renderNavItem(item))}
      </nav>
      {/* Counselor profile */}
      <div className="mt-auto p-4 bg-white rounded-lg mx-3 mb-3 shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Image src="/placeholder.svg?height=48&width=48" alt="QA Lead" width={48} height={48} className="object-cover" />
          </div>
          <div>
            <h3 className="font-medium">Alex Morgan</h3>
            <p className="text-xs text-gray-500">QA Lead</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3">Here to help you squash bugs and streamline QA!</p>
        <button className="w-full bg-black text-white rounded-md py-2 px-4 text-sm font-medium">Book a QA Session</button>
      </div>
      <div className="mt-2 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 text-sm font-medium w-full justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
} 