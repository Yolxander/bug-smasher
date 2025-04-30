"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import Image from 'next/image'
import Link from 'next/link'
import { Search, Bell, ChevronDown, Bug, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { getSubmissions } from './actions/submissions'
import { useEffect, useState } from 'react'
import { Submission } from './actions/submissions'
import { useRouter } from "next/navigation"
import { getProfile } from "@/lib/profiles"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        router.push("/auth/login")
        return
      }

      try {
        const profile = await getProfile(user.id)
        if (!profile.onboarding_completed) {
          router.push("/onboarding")
        }
      } catch (error) {
        console.error("Profile check failed:", error)
        router.push("/auth/login")
      }
    }

    checkProfile()
  }, [user, router])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log('Starting to fetch submissions...');
        const data = await getSubmissions()
        console.log('Received submissions in page:', data);
        setSubmissions(data)
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  // Calculate status counts
  const statusCounts = submissions.reduce((acc, submission) => {
    acc[submission.status] = (acc[submission.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('Current submissions state:', submissions);
  console.log('Status counts:', statusCounts);

  // Get recent submissions (last 2)
  const recentSubmissions = submissions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)

  console.log('Recent submissions:', recentSubmissions);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="dashboard" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">Bug Smasher Dashboard</h1>
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
            {/* Updated Hero Section */}
            <div className="flex justify-between mb-8">
              <div className="bg-black rounded-2xl p-8 flex-1 mr-4">
                <div className="max-w-md flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-amber-400">Welcome to Bug Smasher</h2>
                    <p className="text-white mb-4 opacity-90">Report bugs easily and help improve our software. No technical knowledge required - just tell us what's not working!</p>
                    <Link 
                      href="/submit" 
                      className="bg-amber-400 text-black px-6 py-2 rounded-full font-medium hover:bg-amber-300 transition-colors"
                    >
                      Report a Bug
                    </Link>
                  </div>
                  <Bug className="h-32 w-32 text-amber-400 ml-4" />
                </div>
              </div>
              
              <div className="bg-white shadow-lg rounded-2xl p-6 w-[400px]">
                <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Take a screenshot if possible
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Describe what you were trying to do
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Tell us what you expected to happen
                  </li>
                </ul>
              </div>
            </div>

            {/* Status Overview */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Bug Report Status</h2>
                <Link href="/bugs" className="text-indigo-600 hover:text-indigo-800">View All Reports</Link>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                    <h3 className="text-xl font-semibold">Open Issues</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts['Open'] || 0}</p>
                  <p className="text-sm text-gray-500 mt-2">Needs attention</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <Clock className="h-8 w-8 text-yellow-500 mr-3" />
                    <h3 className="text-xl font-semibold">In Progress</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts['In Progress'] || 0}</p>
                  <p className="text-sm text-gray-500 mt-2">Being worked on</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    <h3 className="text-xl font-semibold">Resolved</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts['Resolved'] || 0}</p>
                  <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Recent Reports</h2>
                <div className="bg-white rounded-xl shadow-sm divide-y">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : recentSubmissions.length > 0 ? (
                    recentSubmissions.map((submission) => (
                      <div key={submission.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{submission.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{submission.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Reported {new Date(submission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No recent reports</div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Help & Resources</h2>
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mr-4">
                      <Image src="/guide-icon.png" alt="Guide" width={40} height={40} className="rounded" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Bug Reporting Guide</h3>
                      <p className="text-sm text-gray-500">Learn how to write effective bug reports</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mr-4">
                      <Image src="/video-icon.png" alt="Video" width={40} height={40} className="rounded" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Video Tutorials</h3>
                      <p className="text-sm text-gray-500">Watch how to capture and report issues</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mr-4">
                      <Image src="/faq-icon.png" alt="FAQ" width={40} height={40} className="rounded" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Common Questions</h3>
                      <p className="text-sm text-gray-500">Find answers to frequently asked questions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

