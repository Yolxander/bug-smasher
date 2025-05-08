"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Search, Bell, ChevronDown, CheckCircle, AlertTriangle, ArrowRight, Users, FileCheck, Grid, List } from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { getQaChecklists, QaChecklist } from '@/app/actions/qaChecklistActions'

export default function QAPage() {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [checklists, setChecklists] = useState<QaChecklist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const data = await getQaChecklists()
        console.log('Fetched QA checklists:', data)
        setChecklists(Array.isArray(data) ? data : [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching QA checklists:', err)
        setError(err instanceof Error ? err.message : 'Failed to load QA checklists')
        setChecklists([])
        setLoading(false)
      }
    }

    fetchChecklists()
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
                    <Link
                      href="/qa/submit"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create New Checklist
                    </Link>
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
                    <p className="text-2xl font-semibold text-gray-900">{checklists.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Checklists</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {checklists.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {checklists.filter(c => c.status === 'in_progress').length}
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
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {checklists.filter(c => c.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklists List/Grid */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">All QA Checklists</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <List className="h-5 w-5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Grid className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading checklists...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : checklists.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No QA checklists found</div>
              ) : viewMode === 'list' ? (
                <div className="divide-y divide-gray-200">
                  {checklists.map((checklist) => (
                    <div key={checklist.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{checklist.title}</h3>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span>Status: {checklist.status}</span>
                            <span className="mx-2">•</span>
                            <span>Created: {new Date(checklist.created_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>Last Updated: {new Date(checklist.updated_at).toLocaleDateString()}</span>
                          </div>
                          {checklist.description && (
                            <p className="mt-2 text-sm text-gray-600">{checklist.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <Link
                            href={`/qa/${checklist.id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View Checklist
                          </Link>
                          <Link
                            href={`/qa/complete/details/${checklist.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            Complete
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {checklists.map((checklist) => (
                    <div key={checklist.id} className="bg-white border rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-medium mb-2">{checklist.title}</h3>
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <p>Status: {checklist.status}</p>
                        <p>Created: {new Date(checklist.created_at).toLocaleDateString()}</p>
                        <p>Last Updated: {new Date(checklist.updated_at).toLocaleDateString()}</p>
                        {checklist.description && (
                          <p className="text-gray-600">{checklist.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-4">
                        <Link
                          href={`/qa/${checklist.id}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Checklist
                        </Link>
                        <Link
                          href={`/qa/complete/details/${checklist.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 