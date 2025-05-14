"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import Image from 'next/image'
import Link from 'next/link'
import { Search, Bell, ChevronDown, Bug, CheckCircle, Clock, AlertTriangle, ArrowRight, CheckSquare, Users } from "lucide-react"
import { getSubmissions } from './actions/submissions'
import { useEffect, useState } from 'react'
import { Submission } from './actions/submissions'
import { useRouter } from "next/navigation"
import { getQaStats, QaStats } from './actions/qaChecklistActions'

interface QAProject {
  id: string
  name: string
  totalItems: number
  completedItems: number
  bugsReported: number
  lastUpdated: string
  status: 'in_progress' | 'completed' | 'pending'
}

export default function HomePage() {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [qaProjects, setQAProjects] = useState<QAProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qaStats, setQaStats] = useState<QaStats | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionsData, statsData] = await Promise.all([
          getSubmissions(),
          getQaStats()
        ])
        setSubmissions(submissionsData)
        setQaStats(statsData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate status counts
  const statusCounts = submissions?.reduce((acc, submission) => {
    if (!submission?.status) return acc
    acc[submission.status] = (acc[submission.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Get recent submissions (last 2)
  const recentSubmissions = submissions
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2) || []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return null // Don't render anything while checking auth
  }

  if (!profileId) {
    router.push("/onboarding")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="dashboard" />
        <div className="flex-1">
          <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link
                      href="/submit"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Report New Bug
                    </Link>
                  </div>
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
            {/* Promotional Cards */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Report Bugs Smarter</h3>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Use our AI-powered system to submit detailed bug reports. Our smart matching system helps assign the right developer to fix your issues.
                  </p>
                  <button className="mt-4 text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90">
                    Submit Bug Report
                  </button>
                </div>
                <div className="relative w-32 h-32 rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="Bug reporting illustration"
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-black rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-white">
                <div className="mb-4">
                  <span className="text-sm font-medium">Latest Update</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">New Bug Tracking Features</h3>
                  <p className="text-sm text-gray-400">Platform Update · Real-time bug status tracking now available</p>
                  <button className="mt-2 text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Stats Grid */}
            <div className="grid grid-cols-4 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <Bug className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Open Bugs</p>
                    <p className="text-2xl font-semibold text-gray-900">{statusCounts['Open'] || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <p className="text-2xl font-semibold text-gray-900">{statusCounts['In Progress'] || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Resolved</p>
                    <p className="text-2xl font-semibold text-gray-900">{statusCounts['Resolved'] || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Bugs</p>
                    <p className="text-2xl font-semibold text-gray-900">{submissions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-medium text-gray-500">Active QA Projects</h3>
                  <CheckSquare className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-3xl font-semibold text-gray-900">{qaStats?.activeProjects?.count || 0}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className={qaStats?.activeProjects?.change && qaStats.activeProjects.change > 0 ? "text-green-500" : qaStats?.activeProjects?.change && qaStats.activeProjects.change < 0 ? "text-red-500" : "text-gray-500"}>
                    {qaStats?.activeProjects?.change && qaStats.activeProjects.change > 0 ? "↑" : qaStats?.activeProjects?.change && qaStats.activeProjects.change < 0 ? "↓" : "→"} {Math.abs(qaStats?.activeProjects?.change || 0)}
                  </span>
                  <span className="ml-2">{qaStats?.activeProjects?.period || 'this week'}</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-medium text-gray-500">QA Items Completed</h3>
                  <CheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-3xl font-semibold text-gray-900">{qaStats?.completedItems?.count || 0}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className={qaStats?.completedItems?.change && qaStats.completedItems.change > 0 ? "text-green-500" : qaStats?.completedItems?.change && qaStats.completedItems.change < 0 ? "text-red-500" : "text-gray-500"}>
                    {qaStats?.completedItems?.change && qaStats.completedItems.change > 0 ? "↑" : qaStats?.completedItems?.change && qaStats.completedItems.change < 0 ? "↓" : "→"} {Math.abs(qaStats?.completedItems?.change || 0)}
                  </span>
                  <span className="ml-2">{qaStats?.completedItems?.period || 'this week'}</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-medium text-gray-500">Active Reviewers</h3>
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-3xl font-semibold text-gray-900">{qaStats?.activeReviewers?.count || 0}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className={qaStats?.activeReviewers?.change && qaStats.activeReviewers.change > 0 ? "text-green-500" : qaStats?.activeReviewers?.change && qaStats.activeReviewers.change < 0 ? "text-red-500" : "text-gray-500"}>
                    {qaStats?.activeReviewers?.change && qaStats.activeReviewers.change > 0 ? "↑" : qaStats?.activeReviewers?.change && qaStats.activeReviewers.change < 0 ? "↓" : "→"} {Math.abs(qaStats?.activeReviewers?.change || 0)}
                  </span>
                  <span className="ml-2">{qaStats?.activeReviewers?.period || 'this week'}</span>
                </div>
              </div>
            </div>

            {/* Recent Bug Reports and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bug Reports */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Bug Reports</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{submission.title}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                              {submission.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(submission.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link href="/bugs" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                      View all bug reports →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <Link href="/submit" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Bug className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Submit Bug Report</h4>
                        <p className="text-sm text-gray-500">Report a new bug or issue</p>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>
                  <Link href="/qa/submit" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <CheckSquare className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Create QA Checklist</h4>
                        <p className="text-sm text-gray-500">Start a new QA project</p>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

