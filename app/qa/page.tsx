"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Search, Bell, ChevronDown, CheckCircle, AlertTriangle, ArrowRight, Users, FileCheck } from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from 'next/link'

interface QAItem {
  id: string
  name: string
  notes: string
  status: 'pending' | 'passed' | 'failed'
  assignedTo: string[]
  linkedBugs: number
}

interface QAProject {
  id: string
  name: string
  totalItems: number
  completedItems: number
  bugsReported: number
  lastUpdated: string
  lastUpdatedBy: string
}

export default function QAPage() {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [projects, setProjects] = useState<QAProject[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    setProjects([
      {
        id: '1',
        name: 'Web Redesign Project',
        totalItems: 12,
        completedItems: 8,
        bugsReported: 4,
        lastUpdated: '1 hour ago',
        lastUpdatedBy: 'Daniella'
      },
      {
        id: '2',
        name: 'Mobile App Update',
        totalItems: 15,
        completedItems: 10,
        bugsReported: 2,
        lastUpdated: '2 hours ago',
        lastUpdatedBy: 'Michael'
      }
    ])
    setLoading(false)
  }, [])

  if (!user) {
    return null
  }

  if (!profileId) {
    router.push("/onboarding")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="qa" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">QA Dashboard</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <button className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Create New Checklist
                    </button>
                  </div>
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                      <Bell className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Checklists</p>
                    <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed Items</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {projects.reduce((acc, proj) => acc + proj.completedItems, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Bugs Reported</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {projects.reduce((acc, proj) => acc + proj.bugsReported, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Reviewers</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">QA Projects</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div key={project.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{project.name}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>QA Status: {project.completedItems} of {project.totalItems} items complete</span>
                          <span className="mx-2">•</span>
                          <span>Bugs Reported: {project.bugsReported}</span>
                          <span className="mx-2">•</span>
                          <span>Last Updated: {project.lastUpdated} by {project.lastUpdatedBy}</span>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Link
                          href={`/qa/${project.id}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View QA Checklist
                        </Link>
                        <Link
                          href={`/bugs?project=${project.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          View Bug Reports
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 