"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { CheckCircle, XCircle, MessageSquare, AlertTriangle, ChevronDown, Save, Search, Filter, ArrowRight, Clock, Users, ChevronRight } from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"

interface QAItem {
  id: string
  name: string
  description: string
  notes: string
  status: 'pending' | 'passed' | 'failed'
  failureReason?: string
  assignedTo: string[]
  linkedBugs: number
}

interface QAProject {
  id: string
  name: string
  description: string
  totalItems: number
  completedItems: number
  bugsReported: number
  lastUpdated: string
  lastUpdatedBy: string
  status: 'in_progress' | 'completed' | 'pending'
  items: QAItem[]
}

export default function CompleteQAPage() {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [projects, setProjects] = useState<QAProject[]>([])
  const [selectedProject, setSelectedProject] = useState<QAProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'pending'>('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Mock data for demonstration
  useEffect(() => {
    setProjects([
      {
        id: '1',
        name: 'Web Redesign Project',
        description: 'Complete overhaul of the company website with new design system',
        totalItems: 12,
        completedItems: 8,
        bugsReported: 4,
        lastUpdated: '1 hour ago',
        lastUpdatedBy: 'Daniella',
        status: 'in_progress',
        items: [
          {
            id: '1',
            name: 'Homepage Responsive Design',
            description: 'Verify that the homepage layout and content adapts correctly across different screen sizes and devices. Test breakpoints at 320px, 768px, 1024px, and 1440px.',
            notes: 'Check all breakpoints and device sizes',
            status: 'passed',
            assignedTo: ['Daniella', 'Michael'],
            linkedBugs: 0
          },
          {
            id: '2',
            name: 'Navigation Menu Functionality',
            description: 'Test all navigation menu interactions including dropdowns, mobile menu, and keyboard navigation. Ensure all links work correctly and maintain proper state.',
            notes: 'Test all dropdown menus and mobile navigation',
            status: 'failed',
            failureReason: 'Mobile menu fails to open on iOS devices',
            assignedTo: ['Sarah'],
            linkedBugs: 2
          },
          {
            id: '3',
            name: 'Form Validation',
            description: 'Verify all form validation rules are working correctly. Test required fields, email formats, password requirements, and error messages.',
            notes: 'Test all form fields and error messages',
            status: 'pending',
            assignedTo: ['John'],
            linkedBugs: 0
          }
        ]
      },
      {
        id: '2',
        name: 'Mobile App Update',
        description: 'New features and bug fixes for the mobile application',
        totalItems: 15,
        completedItems: 10,
        bugsReported: 2,
        lastUpdated: '2 hours ago',
        lastUpdatedBy: 'Michael',
        status: 'in_progress',
        items: []
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const updateItemStatus = (itemId: string, status: 'passed' | 'failed' | 'pending') => {
    if (!selectedProject) return

    setSelectedProject(prev => ({
      ...prev!,
      items: prev!.items.map(item =>
        item.id === itemId ? { 
          ...item, 
          status,
          failureReason: status === 'failed' ? item.failureReason || '' : undefined
        } : item
      ),
      completedItems: prev!.items.filter(item => item.status === 'passed' || item.status === 'failed').length
    }))
  }

  const updateItemNotes = (itemId: string, notes: string) => {
    if (!selectedProject) return

    setSelectedProject(prev => ({
      ...prev!,
      items: prev!.items.map(item =>
        item.id === itemId ? { ...item, notes } : item
      )
    }))
  }

  const updateFailureReason = (itemId: string, reason: string) => {
    if (!selectedProject) return

    setSelectedProject(prev => ({
      ...prev!,
      items: prev!.items.map(item =>
        item.id === itemId ? { ...item, failureReason: reason } : item
      )
    }))
  }

  const handleSave = async () => {
    if (!selectedProject) return
    setSaving(true)
    // TODO: Implement save functionality
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    setSaving(false)
    setSelectedProject(null)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar activePage="qa" />
          <div className="flex-1">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="mr-4 text-gray-500 hover:text-gray-700"
                    >
                      <ArrowRight className="h-5 w-5 transform rotate-180" />
                    </button>
                    <div>
                      <h1 className="text-xl font-semibold">{selectedProject.name}</h1>
                      <p className="text-sm text-gray-500">{selectedProject.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Last updated {selectedProject.lastUpdated}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {selectedProject.lastUpdatedBy}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Progress'}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 p-8">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">QA Checklist Items</h2>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          Progress: {selectedProject.completedItems}/{selectedProject.totalItems} items
                        </div>
                        <div className="text-sm text-gray-500">
                          Bugs Reported: {selectedProject.bugsReported}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-6">
                    {selectedProject.items.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleItemExpand(item.id)}
                                className="mr-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronRight
                                  className={`h-5 w-5 transform transition-transform ${
                                    expandedItems.has(item.id) ? 'rotate-90' : ''
                                  }`}
                                />
                              </button>
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              <div className="ml-4">
                                {getStatusIcon(item.status)}
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 ml-7">{item.description}</p>
                            
                            {expandedItems.has(item.id) && (
                              <div className="mt-4 space-y-4 ml-7">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                  </label>
                                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                                    {item.notes || 'No notes available'}
                                  </div>
                                </div>

                                {item.status === 'failed' && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Failure Reason
                                    </label>
                                    <textarea
                                      value={item.failureReason || ''}
                                      onChange={(e) => updateFailureReason(item.id, e.target.value)}
                                      placeholder="Explain why this item failed..."
                                      className="w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                      rows={3}
                                      required
                                    />
                                  </div>
                                )}

                                <div className="flex items-center text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>Assigned to: {item.assignedTo.join(', ')}</span>
                                  </div>
                                  {item.linkedBugs > 0 && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                          <rect width="8" height="14" x="8" y="6" rx="4"/>
                                          <path d="M19 7l-3 2"/>
                                          <path d="M5 7l3 2"/>
                                          <path d="M19 19l-3-2"/>
                                          <path d="M5 19l3-2"/>
                                          <path d="M20 13h-4"/>
                                          <path d="M4 13h4"/>
                                        </svg>
                                        <span>{item.linkedBugs} linked bugs</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="ml-6 flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateItemStatus(item.id, 'passed')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                  item.status === 'passed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                Pass
                              </button>
                              <button
                                onClick={() => updateItemStatus(item.id, 'failed')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                  item.status === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                Fail
                              </button>
                              <button
                                onClick={() => updateItemStatus(item.id, 'pending')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                  item.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => router.push('/submit')}
                                className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-150"
                              >
                                Report Bug
                              </button>
                            </div>
                            <div className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
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
                    <h1 className="text-xl font-semibold">Complete QA Checklist</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {project.lastUpdated}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          {project.lastUpdatedBy}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{project.completedItems}/{project.totalItems} items</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(project.completedItems / project.totalItems) * 100}%` }}
                          />
                        </div>
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