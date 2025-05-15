"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { ArrowRight, Clock, Users, Save, ChevronRight, CheckCircle, XCircle, AlertTriangle, Info, Paperclip, Bug, X, AlertCircle } from "lucide-react"
import { useEffect, useState, use, useRef } from 'react'
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
  const answerInputRef = useRef<HTMLTextAreaElement>(null);
  const failureReasonRef = useRef<HTMLTextAreaElement>(null);

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const checklistId = parseInt(unwrappedParams.id)

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
        answer: answerInputRef.current?.value || '',
        failure_reason: failureReasonRef.current?.value || ''
      });

      // Fetch fresh data from the server
      const freshData = await getQaChecklist(checklistId);
      const items = 'items' in freshData && Array.isArray((freshData as any).items) ? (freshData as any).items : [];
      setChecklist({ ...freshData, items });
      
      setSaveSuccess(true);
      // Close the drawer after successful save
      setSelectedItem(null);
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

    // Set the input values when the component mounts or selectedItem changes
    useEffect(() => {
      if (answerInputRef.current) {
        answerInputRef.current.value = selectedItem.answer || '';
      }
      if (failureReasonRef.current) {
        failureReasonRef.current.value = selectedItem.failure_reason || selectedItem.failureReason || '';
      }
    }, [selectedItem]);

    const handleBugReport = () => {
      const encodedItem = encodeURIComponent(selectedItem.identifier || '');
      router.push(`/submit?item=${encodedItem}`);
    };

    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity">
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-white shadow-2xl">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">QA Item Details</h2>
                      <p className="text-sm text-gray-500">{selectedItem.identifier}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setSelectedItem(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-6 space-y-8">
                  {/* Item Details Accordion */}
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedItems(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(selectedItem.id)) {
                          newSet.delete(selectedItem.id);
                        } else {
                          newSet.add(selectedItem.id);
                        }
                        return newSet;
                      })}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Info className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Item Details</h3>
                          <p className="text-sm text-gray-500">View item specifications</p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedItems.has(selectedItem.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedItems.has(selectedItem.id) && (
                      <div className="px-6 pb-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-200 font-mono">{selectedItem.item_text}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-200 font-mono">{selectedItem.item_type}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Required</label>
                          <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-200 font-mono">{selectedItem.is_required ? 'Yes' : 'No'}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Update - Full Width */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Save className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Status Update</h3>
                          <p className="text-sm text-gray-500">Current state and next steps</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4">
                        <button 
                          onClick={() => updateItemStatus(selectedItem.id, 'passed')}
                          className={`px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                            selectedItem.status === 'passed' 
                              ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2' 
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                          }`}
                        >
                          Passed
                        </button>
                        <button 
                          onClick={() => updateItemStatus(selectedItem.id, 'failed')}
                          className={`px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                            selectedItem.status === 'failed' 
                              ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2' 
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                          }`}
                        >
                          Fail
                        </button>
                        <button 
                          onClick={() => updateItemStatus(selectedItem.id, 'pending')}
                          className={`px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                            selectedItem.status === 'pending' 
                              ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-500 ring-offset-2' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Pending
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Answer/Response */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Answer</h3>
                        <p className="text-sm text-gray-500">Your response to this item</p>
                      </div>
                    </div>
                    <div className="mt-1">
                      <textarea
                        ref={answerInputRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={4}
                        placeholder="Enter your answer..."
                      />
                    </div>
                  </div>

                  {/* Failure Reason */}
                  {selectedItem?.status === 'failed' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Reason for Failure</h3>
                          <p className="text-sm text-gray-500">Explain why this item failed</p>
                        </div>
                      </div>
                      <div className="mt-1">
                        <textarea
                          ref={failureReasonRef}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          rows={4}
                          placeholder="Explain why this item failed..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setSelectedItem(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                    <button
                      onClick={handleBugReport}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Bug className="h-4 w-4 mr-2" />
                      Report Bug
                    </button>
                  
                </div>
              </div>
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
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-400">{item.identifier}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        col.key === 'pending' ? 'bg-gray-100 text-gray-600' : 
                        col.key === 'passed' ? 'bg-green-100 text-green-600' : 
                        'bg-red-100 text-red-600'
                      }`}>{col.title}</span>
                    </div>
                    <div className="text-base font-medium text-gray-900 line-clamp-2">{item.item_text}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
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
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 line-clamp-2 text-base group-hover:text-indigo-700 transition-colors">{item.item_text}</div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-500">
                  <div><span className="font-semibold">Type:</span> {item.item_type}</div>
                  <div><span className="font-semibold">Required:</span> {item.is_required ? <span className="text-red-500">Yes</span> : 'No'}</div>
                  <div className="hidden md:block"><span className="font-semibold">Order:</span> {item.order_number}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
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