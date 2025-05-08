"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { ArrowRight, Clock, Users, Save, ChevronRight, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { getQaChecklist, QaChecklist } from '@/app/actions/qaChecklistActions'

interface ChecklistItem {
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

export default function QACompleteDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [checklist, setChecklist] = useState<QaChecklist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const data = await getQaChecklist(parseInt(params.id))
        console.log('Fetched QA checklist:', data)
        setChecklist(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching QA checklist:', err)
        setError(err instanceof Error ? err.message : 'Failed to load QA checklist')
        setLoading(false)
      }
    }

    fetchChecklist()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const toggleItemExpand = (itemId: number) => {
    const newExpandedItems = new Set(expandedItems)
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId)
    } else {
      newExpandedItems.add(itemId)
    }
    setExpandedItems(newExpandedItems)
  }

  const updateItemStatus = (itemId: number, status: 'passed' | 'failed' | 'pending') => {
    if (!checklist) return

    const updatedItems = checklist.items.map(item => {
      if (item.id === itemId) {
        return { ...item, status }
      }
      return item
    })

    setChecklist({ ...checklist, items: updatedItems })
  }

  const updateFailureReason = (itemId: number, reason: string) => {
    if (!checklist) return

    const updatedItems = checklist.items.map(item => {
      if (item.id === itemId) {
        return { ...item, failureReason: reason }
      }
      return item
    })

    setChecklist({ ...checklist, items: updatedItems })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Implement save functionality
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      setSaving(false)
    } catch (error) {
      console.error('Error saving checklist:', error)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar activePage="qa" />
          <div className="flex-1 p-8">
            <div className="text-center text-gray-500">Loading checklist...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !checklist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar activePage="qa" />
          <div className="flex-1 p-8">
            <div className="text-center text-red-500">{error || 'Checklist not found'}</div>
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
                <div className="flex items-center">
                  <button
                    onClick={() => router.back()}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                  >
                    <ArrowRight className="h-5 w-5 transform rotate-180" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold">{checklist.title}</h1>
                    <p className="text-sm text-gray-500">{checklist.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Last updated {new Date(checklist.updated_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {checklist.creator?.name}
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
                        Progress: {checklist.items.filter(item => item.status === 'passed').length}/{checklist.items.length} items
                      </div>
                      <div className="text-sm text-gray-500">
                        Status: {checklist.status}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  {checklist.items.map((item) => (
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
                            <h3 className="text-lg font-medium text-gray-900">{item.item_text}</h3>
                            <div className="ml-4">
                              {getStatusIcon(item.status || 'pending')}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 ml-7">Type: {item.item_type}</p>
                          
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
                                  <span>Required: {item.is_required ? 'Yes' : 'No'}</span>
                                </div>
                                <span className="mx-2">•</span>
                                <div className="flex items-center">
                                  <span>Order: {item.order_number}</span>
                                </div>
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
                          <div className={`text-sm font-medium ${getStatusColor(item.status || 'pending')}`}>
                            {(item.status || 'pending').charAt(0).toUpperCase() + (item.status || 'pending').slice(1)}
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