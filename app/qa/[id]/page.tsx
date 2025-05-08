"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { CheckCircle, XCircle, MessageSquare, AlertTriangle, ChevronDown } from "lucide-react"
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
}

export default function QAProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [checklist, setChecklist] = useState<QaChecklist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar activePage="qa" />
          <div className="flex-1 p-8">
            <div className="text-center text-red-500">{error}</div>
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
                    <h1 className="text-xl font-semibold">{checklist?.title || 'Loading...'}</h1>
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
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-2 text-sm font-medium text-gray-900 capitalize">{checklist?.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                  <p className="mt-2 text-sm text-gray-900">{checklist?.creator?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-2 text-sm text-gray-900">
                    {new Date(checklist?.updated_at || '').toLocaleDateString()}
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
                {checklist?.items?.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {getStatusIcon(item.item_type)}
                          <h3 className="ml-3 text-lg font-medium">{item.item_text}</h3>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>Type: {item.item_type}</span>
                          <span className="mx-2">•</span>
                          <span>Required: {item.is_required ? 'Yes' : 'No'}</span>
                          <span className="mx-2">•</span>
                          <span>Order: {item.order_number}</span>
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