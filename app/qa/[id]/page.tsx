"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { CheckCircle, XCircle, MessageSquare, AlertTriangle, ChevronDown } from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"

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
  items: QAItem[]
}

export default function QAProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [project, setProject] = useState<QAProject | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    setProject({
      id: params.id,
      name: 'Web Redesign Project',
      totalItems: 12,
      completedItems: 8,
      bugsReported: 4,
      lastUpdated: '1 hour ago',
      lastUpdatedBy: 'Daniella',
      items: [
        {
          id: '1',
          name: 'Homepage Responsive Design',
          notes: 'Check all breakpoints and device sizes',
          status: 'passed',
          assignedTo: ['Daniella', 'Michael'],
          linkedBugs: 0
        },
        {
          id: '2',
          name: 'Navigation Menu Functionality',
          notes: 'Test all dropdown menus and mobile navigation',
          status: 'failed',
          assignedTo: ['Sarah'],
          linkedBugs: 2
        },
        {
          id: '3',
          name: 'Form Validation',
          notes: 'Test all form fields and error messages',
          status: 'pending',
          assignedTo: ['John'],
          linkedBugs: 0
        }
      ]
    })
    setLoading(false)
  }, [params.id])

  if (!user) {
    return null
  }

  if (!profileId) {
    router.push("/onboarding")
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
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
                    <h1 className="text-xl font-semibold">{project?.name || 'Loading...'}</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <button className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Add Checklist Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            {/* Project Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                  <div className="mt-2 flex items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${(project?.completedItems || 0) / (project?.totalItems || 1) * 100}%` }}
                      />
                    </div>
                    <span className="ml-4 text-sm font-medium text-gray-900">
                      {project?.completedItems} of {project?.totalItems}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bugs Reported</h3>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{project?.bugsReported}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-2 text-sm text-gray-900">
                    {project?.lastUpdated} by {project?.lastUpdatedBy}
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Checklist Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {project?.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <h3 className="ml-3 text-lg font-medium">{item.name}</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.notes}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>Assigned to: {item.assignedTo.join(', ')}</span>
                          {item.linkedBugs > 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-red-500">{item.linkedBugs} bugs reported</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-4">
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comment
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                          Update Status
                        </button>
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