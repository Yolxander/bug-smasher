"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { CheckCircle, XCircle, MessageSquare, AlertTriangle, ChevronDown, Save, Search, Filter, ArrowRight, Clock, Users, ChevronRight } from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { getQaChecklists, QaChecklist } from '@/app/actions/qaChecklistActions'

interface QAItem {
  id: number
  checklist_id: number
  item_text: string
  item_type: string
  is_required: boolean
  order_number: number
  created_at: string
  updated_at: string
  status?: 'passed' | 'failed' | 'pending'
  notes?: string
  failureReason?: string
  assignedTo?: string[]
  linkedBugs?: number
}

interface QAProject extends QaChecklist {
  items: QAItem[]
  assigned_users: Array<{
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
    pivot: {
      qa_checklist_id: number
      user_id: number
      status: string
      assigned_at: string
      due_date: string
    }
  }>
  assignments: Array<{
    id: number
    qa_checklist_id: number
    user_id: number
    status: string
    assigned_at: string
  }>
  creator: {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
  }
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

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const data = await getQaChecklists()
        if (Array.isArray(data)) {
          setProjects(data as QAProject[])
        } else {
          setProjects([])
        }
        setLoading(false)
      } catch (err) {
        setProjects([])
        setLoading(false)
      }
    }

    if (profileId) {
      fetchChecklists()
    }
  }, [profileId])

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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const isAssignedToUser = project.assigned_users.some(assignedUser => {
      const loggedInUserId = Number(user?.id)
      return assignedUser.id === loggedInUserId
    })
    
    return matchesSearch && matchesStatus && isAssignedToUser
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar activePage="qa" />
          <div className="flex-1 p-8">
            <div className="text-center text-gray-500">Loading checklists...</div>
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

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No checklists found. You may not have any assigned checklists or the filters may be too restrictive.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-150"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Creator: {project.creator.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span>Assigned Users: {project.assigned_users.map(user => user.name).join(', ')}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">
                            {project.items.filter(item => item.status === 'passed').length}/{project.items.length} items
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(project.items.filter(item => item.status === 'passed').length / project.items.length) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => router.push(`/qa/complete/details/${project.id}`)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
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