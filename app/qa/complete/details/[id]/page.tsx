"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { ArrowRight, Clock, Users, Save, ChevronRight, CheckCircle, XCircle, AlertTriangle, Info, Paperclip, Bug, X } from "lucide-react"
import { useEffect, useState, use } from 'react'
import { useRouter } from "next/navigation"
import { getQaChecklist, QaChecklist, updateChecklistItem } from '@/app/actions/qaChecklistActions'

interface Bug {
  id: number
  title: string
  description: string
  status: 'Open' | 'In Progress' | 'Closed'
  priority: string
  created_at: string
  updated_at: string
}

interface ChecklistItem {
  id: number
  checklist_id: number
  item_text: string
  item_type: string
  is_required: boolean
  order_number: number
  created_at: string
  updated_at: string
  status?: 'passed' | 'failed' | 'pending' | 'in_progress' | 'done'
  notes?: string
  answer?: string
  failureReason?: string
  failure_reason?: string
  assignedTo?: string[]
  linkedBugs?: number
  identifier?: string
  bugs?: Bug[]
}

interface QAProject extends QaChecklist {
  items: ChecklistItem[]
}

type ViewMode = 'board' | 'list'

export default function QACompleteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [checklist, setChecklist] = useState<QAProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [localNotes, setLocalNotes] = useState('')

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const checklistId = parseInt(unwrappedParams.id)

  // Update localNotes when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setLocalNotes(selectedItem.notes || '')
    }
  }, [selectedItem])

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const data = await getQaChecklist(checklistId)
        const items = 'items' in data && Array.isArray((data as any).items) ? (data as any).items : [];
        setChecklist({ ...data, items })
        setLoading(false)
      } catch (err) {
        console.error('Error fetching QA checklist:', err)
        setError(err instanceof Error ? err.message : 'Failed to load QA checklist')
        setLoading(false)
      }
    }
    fetchChecklist()
  }, [checklistId])

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
        if (item.is_required && status === 'pending') {
          return item
        }
        return { ...item, status }
      }
      return item
    })

    setChecklist({ ...checklist, items: updatedItems })
    
    // Also update the selectedItem state
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, status } : null)
    }
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

  const updateItemNotes = (itemId: number, notes: string) => {
    if (!checklist) return

    const updatedItems = checklist.items.map(item => {
      if (item.id === itemId) {
        return { ...item, notes }
      }
      return item
    })

    setChecklist({ ...checklist, items: updatedItems })
  }

  const renderItemTypeSpecificContent = (item: ChecklistItem) => {
    switch (item.item_type.toLowerCase()) {
      case 'text':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response
            </label>
            <textarea
              value={item.notes || ''}
              onChange={(e) => updateFailureReason(item.id, e.target.value)}
              placeholder="Enter your response..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>
        )
      case 'checkbox':
        return (
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={item.status === 'passed'}
                onChange={(e) => updateItemStatus(item.id, e.target.checked ? 'passed' : 'failed')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Mark as completed</span>
            </label>
          </div>
        )
      case 'radio':
        return (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select an option:</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`item-${item.id}`}
                  checked={item.status === 'passed'}
                  onChange={() => updateItemStatus(item.id, 'passed')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Pass</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`item-${item.id}`}
                  checked={item.status === 'failed'}
                  onChange={() => updateItemStatus(item.id, 'failed')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Fail</span>
              </label>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const handleSave = async () => {
    if (!checklist || !selectedItem) return;
    
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const updatedItem = await updateChecklistItem(checklist.id, selectedItem.id, {
        text: selectedItem.item_text,
        type: selectedItem.item_type,
        is_required: selectedItem.is_required,
        order_number: selectedItem.order_number,
        status: selectedItem.status,
        answer: selectedItem.notes,
        failure_reason: selectedItem.failureReason
      });

      // Update the checklist items after successful save
      const updatedItems = checklist.items.map(item => 
        item.id === selectedItem.id ? { ...item, ...updatedItem, notes: selectedItem.notes } : item
      );
      
      setChecklist(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: updatedItems
        };
      });
      
      setSaveSuccess(true);
      // Reset success message after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving checklist:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  // Kanban columns
  const columns = [
    {
      key: 'pending',
      title: 'Pending',
      color: 'border-gray-500',
      countColor: 'text-gray-500',
      items: checklist?.items?.filter(item => item.status === 'pending' || !item.status) || [],
    },
    {
      key: 'passed',
      title: 'Passed',
      color: 'border-green-500',
      countColor: 'text-green-500',
      items: checklist?.items?.filter(item => item.status === 'passed') || [],
    },
    {
      key: 'failed',
      title: 'Fail',
      color: 'border-red-500',
      countColor: 'text-red-500',
      items: checklist?.items?.filter(item => item.status === 'failed') || [],
    },
  ];

  // Checklist details modal
  const DetailsModal = () => (
    showDetails && checklist ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
          <button onClick={() => setShowDetails(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <XCircle className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold mb-2">{checklist.title}</h2>
          <p className="text-gray-600 mb-4">{checklist.description}</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div><span className="font-medium">Status:</span> {checklist.status}</div>
            <div><span className="font-medium">Created:</span> {new Date(checklist.created_at).toLocaleDateString()}</div>
            <div><span className="font-medium">Last Updated:</span> {new Date(checklist.updated_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    ) : null
  )

  // Board-level header controls (no filters, checklist name, info icon)
  const BoardHeader = () => (
    <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {checklist?.title || 'Checklist'}
          <button onClick={() => setShowDetails(true)} className="ml-2 text-gray-400 hover:text-blue-600" title="View details">
            <Info className="h-6 w-6" />
          </button>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className={`px-3 py-2 rounded-md font-medium flex items-center gap-1 border ${viewMode === 'board' ? 'bg-gray-100 text-gray-900 border-gray-300' : 'text-gray-500 border-transparent hover:text-gray-900'}`} onClick={() => setViewMode('board')}><ChevronRight className="h-4 w-4 rotate-180" />Board View</button>
        <button className={`px-3 py-2 rounded-md font-medium flex items-center gap-1 border ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 border-gray-300' : 'text-gray-500 border-transparent hover:text-gray-900'}`} onClick={() => setViewMode('list')}><ChevronRight className="h-4 w-4" />List View</button>
      </div>
    </div>
  );

  // Card meta info (removed avatars)
  const CardMeta = () => (
    <div className="flex items-center justify-between mt-4">
      <div />
      <div className="flex items-center gap-3 text-gray-400 text-xs">
        <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" />1</span>
        <span className="flex items-center gap-1"><ChevronRight className="h-4 w-4" />2</span>
        <span className="flex items-center gap-1"><ChevronRight className="h-4 w-4" />6</span>
      </div>
    </div>
  );

  // Right sidebar (drawer) for item details
  const ItemSidebar = () => {
    if (!selectedItem) return null;

    const handleBugReport = () => {
      const encodedItem = encodeURIComponent(selectedItem.identifier || '');
      router.push(`/submit?item=${encodedItem}`);
    };

    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => setSelectedItem(null)}
        />

        {/* Sidebar */}
        <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">{selectedItem.identifier}</span>
              <h2 className="text-lg font-semibold text-gray-900">{selectedItem.item_text}</h2>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateItemStatus(selectedItem.id, 'passed')}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    selectedItem.status === 'passed' 
                      ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2' 
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                  }`}
                >
                  Passed
                </button>
                <button 
                  onClick={() => updateItemStatus(selectedItem.id, 'failed')}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    selectedItem.status === 'failed' 
                      ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2' 
                      : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                  }`}
                >
                  Fail
                </button>
                <button 
                  onClick={() => updateItemStatus(selectedItem.id, 'pending')}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    selectedItem.status === 'pending' 
                      ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-500 ring-offset-2' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Connected Bug Information */}
            {selectedItem.bugs && selectedItem.bugs.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Connected Bug Report
                </h3>
                <div className="space-y-3">
                  {selectedItem.bugs.map((bug) => (
                    <div key={bug.id} className="bg-white rounded-md p-3 border border-red-200">
                      <h4 className="font-medium text-gray-900 mb-1">{bug.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{bug.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${
                          bug.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                          bug.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {bug.status}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100">
                          {bug.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer/response */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
              <textarea
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors duration-200"
                rows={4}
                value={selectedItem.answer || selectedItem.notes || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedItem(prev => prev ? { ...prev, notes: newValue, answer: newValue } : null);
                  
                  if (checklist) {
                    const updatedItems = checklist.items.map(item => 
                      item.id === selectedItem.id ? { ...item, notes: newValue, answer: newValue } : item
                    );
                    setChecklist(prev => prev ? { ...prev, items: updatedItems } : null);
                  }
                }}
                placeholder="Enter your answer..."
              />
            </div>

            {/* Failure reason - only show when status is failed */}
            {selectedItem.status === 'failed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Failure</label>
                <textarea
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors duration-200"
                  rows={4}
                  value={selectedItem.failureReason || selectedItem.failure_reason || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSelectedItem(prev => prev ? { ...prev, failureReason: newValue, failure_reason: newValue } : null);
                    
                    if (checklist) {
                      const updatedItems = checklist.items.map(item => 
                        item.id === selectedItem.id ? { ...item, failureReason: newValue, failure_reason: newValue } : item
                      );
                      setChecklist(prev => prev ? { ...prev, items: updatedItems } : null);
                    }
                  }}
                  placeholder="Explain why this item failed..."
                />
              </div>
            )}

            {/* Save button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${
                    saving 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                {selectedItem.status === 'failed' && (
                  <button
                    onClick={handleBugReport}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm transition-colors"
                    title="Report a bug for this item"
                  >
                    <Bug className="h-4 w-4" />
                    <span className="hidden sm:inline">Report Bug</span>
                  </button>
                )}
              </div>
              {saveError && (
                <p className="mt-2 text-sm text-red-600">{saveError}</p>
              )}
              {saveSuccess && (
                <p className="mt-2 text-sm text-green-600">Changes saved successfully!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Kanban board rendering
  const KanbanBoard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col, idx) => (
        <div key={col.key} className="bg-gray-50 rounded-2xl p-4 min-h-[500px] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2 border-b-2 pb-1 ${col.color}`}>{col.title} <span className={`ml-2 text-xs font-bold ${col.countColor}`}>{col.items.length}</span></h3>
            </div>
            {/* Add button for Pending column */}
            {col.key === 'pending' && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-400 hover:text-indigo-600 hover:border-indigo-400 transition"><span className="text-2xl leading-none">+</span></button>
            )}
          </div>
          <div className="space-y-4">
            {col.items.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer border border-gray-100" 
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-400">{item.identifier}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        col.key === 'pending' ? 'bg-gray-100 text-gray-600' : 
                        col.key === 'passed' ? 'bg-green-100 text-green-600' : 
                        'bg-red-100 text-red-600'
                      }`}>{col.title}</span>
                    </div>
                    <div className="text-base font-medium text-gray-900 truncate">{item.item_text}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status || 'pending')}
                  </div>
                </div>
                <CardMeta />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // List view rendering
  const ListView = () => (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Checklist Items</h2>
        <span className="text-sm text-gray-500">{checklist?.items.length || 0} items</span>
      </div>
      <div className="grid gap-4">
        {checklist?.items.map(item => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-150 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {getStatusIcon(item.status || 'pending')}
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate text-base group-hover:text-indigo-700 transition-colors">{item.item_text}</div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-500">
                  <div><span className="font-semibold">Type:</span> {item.item_type}</div>
                  <div><span className="font-semibold">Required:</span> {item.is_required ? <span className="text-red-500">Yes</span> : 'No'}</div>
                  <div className="hidden md:block"><span className="font-semibold">Order:</span> {item.order_number}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border ${item.status === 'passed' ? 'bg-green-100 text-green-700 border-green-200' : item.status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' : item.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{(item.status || 'Pending').toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar activePage="qa" />
          <div className="flex-1 p-8">
            <BoardHeader />
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
            <BoardHeader />
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
        <div className="flex-1 p-8">
          <BoardHeader />
          <DetailsModal />
          <ItemSidebar />
          {viewMode === 'board' ? (
            <KanbanBoard />
          ) : (
            <ListView />
          )}
        </div>
      </div>
    </div>
  )
} 