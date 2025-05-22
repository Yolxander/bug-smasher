"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { CheckSquare, Users, ListChecks, ArrowRight, ArrowLeft, Plus, X, Globe, Calendar, FileText, Eye } from 'lucide-react'
import { createQaChecklist, addChecklistItem, QaChecklistItem } from '@/app/actions/qaChecklistActions'
import { getUsers, User } from '@/app/actions/profiles'

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

interface ChecklistItem {
  id: string
  name: string
  notes: string
  type: 'text'
  is_required: boolean
  order_number: number
  status: 'pending' | 'passed' | 'failed'
  answer?: string
}

interface Assignment {
  user_id: string
  due_date: string
  notes: string
  status: 'accepted' | 'rejected' | 'pending'
}

interface QAProject {
  name: string
  description: string
  status: 'draft' | 'active' | 'archived'
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  category: string
  items: ChecklistItem[]
  assignments: Assignment[]
}

interface QATemplate {
  id: string
  name: string
  description: string
  icon: any
  items: ChecklistItem[]
}

const QA_TEMPLATES: QATemplate[] = [
  {
    id: 'web',
    name: 'Web QA Checklist',
    description: 'For teams reviewing websites, microsites, or landing pages.',
    icon: Globe,
    items: [
      { id: '1', name: 'Page loads correctly on all major browsers (Chrome, Safari, Firefox, Edge)', notes: '', type: 'text', is_required: true, order_number: 1, status: 'pending' },
      { id: '2', name: 'Responsive design: layouts adjust across desktop, tablet, and mobile', notes: '', type: 'text', is_required: true, order_number: 2, status: 'pending' },
      { id: '3', name: 'Navigation/menu works and links to correct pages', notes: '', type: 'text', is_required: true, order_number: 3, status: 'pending' },
      { id: '4', name: 'Forms submit correctly with error/success validation', notes: '', type: 'text', is_required: true, order_number: 4, status: 'pending' },
      { id: '5', name: 'SEO metadata (title, description, OG tags) are implemented', notes: '', type: 'text', is_required: true, order_number: 5, status: 'pending' },
      { id: '6', name: 'Images are optimized and display without distortion', notes: '', type: 'text', is_required: true, order_number: 6, status: 'pending' },
      { id: '7', name: 'Accessibility basics (alt text, tab navigation, contrast) are in place', notes: '', type: 'text', is_required: true, order_number: 7, status: 'pending' },
      { id: '8', name: 'All text is free of typos and grammatical errors', notes: '', type: 'text', is_required: true, order_number: 8, status: 'pending' },
      { id: '9', name: 'Scripts and third-party integrations (e.g., analytics, chat) load properly', notes: '', type: 'text', is_required: true, order_number: 9, status: 'pending' },
      { id: '10', name: 'Console is free of JavaScript errors', notes: '', type: 'text', is_required: true, order_number: 10, status: 'pending' }
    ]
  },
  {
    id: 'event',
    name: 'Event QA Checklist',
    description: 'For internal or public-facing event microsites or registration tools.',
    icon: Calendar,
    items: [
      { id: '1', name: 'Event date, time, and location details are accurate', notes: '', type: 'text', is_required: true, order_number: 1, status: 'pending' },
      { id: '2', name: 'Registration form works on all devices', notes: '', type: 'text', is_required: true, order_number: 2, status: 'pending' },
      { id: '3', name: 'Confirmation emails are triggered and formatted correctly', notes: '', type: 'text', is_required: true, order_number: 3, status: 'pending' },
      { id: '4', name: 'Countdown timers or live widgets function properly', notes: '', type: 'text', is_required: true, order_number: 4, status: 'pending' },
      { id: '5', name: 'Agenda and speaker bios are current and properly displayed', notes: '', type: 'text', is_required: true, order_number: 5, status: 'pending' },
      { id: '6', name: 'Event maps or directions are correct', notes: '', type: 'text', is_required: true, order_number: 6, status: 'pending' },
      { id: '7', name: 'Ticketing or RSVP system integrates properly', notes: '', type: 'text', is_required: true, order_number: 7, status: 'pending' },
      { id: '8', name: 'Embedded video or livestream (if applicable) functions smoothly', notes: '', type: 'text', is_required: true, order_number: 8, status: 'pending' },
      { id: '9', name: 'Social sharing buttons lead to correct channels', notes: '', type: 'text', is_required: true, order_number: 9, status: 'pending' },
      { id: '10', name: 'Last-minute updates are reflected across all key pages', notes: '', type: 'text', is_required: true, order_number: 10, status: 'pending' }
    ]
  },
  {
    id: 'content',
    name: 'Content QA Checklist',
    description: 'For teams handling marketing copy, media assets, or brand content across channels.',
    icon: FileText,
    items: [
      { id: '1', name: 'Headlines, body copy, and CTAs are accurate and approved', notes: '', type: 'text', is_required: true, order_number: 1, status: 'pending' },
      { id: '2', name: 'Grammar and spelling checked (including proper brand tone)', notes: '', type: 'text', is_required: true, order_number: 2, status: 'pending' },
      { id: '3', name: 'Image/video assets are correctly placed and credited', notes: '', type: 'text', is_required: true, order_number: 3, status: 'pending' },
      { id: '4', name: 'Content aligns with campaign goals or brief', notes: '', type: 'text', is_required: true, order_number: 4, status: 'pending' },
      { id: '5', name: 'Text overlays on images are readable and properly spaced', notes: '', type: 'text', is_required: true, order_number: 5, status: 'pending' },
      { id: '6', name: 'All links and buttons are functional', notes: '', type: 'text', is_required: true, order_number: 6, status: 'pending' },
      { id: '7', name: 'Legal disclaimers, T&Cs, or footnotes are included if needed', notes: '', type: 'text', is_required: true, order_number: 7, status: 'pending' },
      { id: '8', name: 'Publish dates and versioning are up to date', notes: '', type: 'text', is_required: true, order_number: 8, status: 'pending' },
      { id: '9', name: 'Assets pass review on staging before going live', notes: '', type: 'text', is_required: true, order_number: 9, status: 'pending' },
      { id: '10', name: 'Metadata (titles, alt text, descriptions) is populated', notes: '', type: 'text', is_required: true, order_number: 10, status: 'pending' }
    ]
  }
]

export default function SubmitQAPage() {
  const router = useRouter()
  const { user, profileId } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [project, setProject] = useState<QAProject>({
    name: '',
    description: '',
    status: 'draft',
    priority: 'medium',
    tags: [],
    category: '',
    items: [],
    assignments: []
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [availableTags] = useState([
    'UI', 'UX', 'Performance', 'Security', 'Accessibility',
    'Mobile', 'Desktop', 'API', 'Database', 'Frontend',
    'Backend', 'Testing', 'Documentation'
  ])
  const [availableTeamMembers, setAvailableTeamMembers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const users = await getUsers()
        // Filter out the current user from available team members
        const filteredUsers = users.filter(u => u.id.toString() !== user?.id.toString())
        setAvailableTeamMembers(filteredUsers)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        // TODO: Add proper error handling/notification
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [user?.id])

  const steps = [
    { number: 1, title: 'Basic Information', icon: ListChecks },
    { number: 2, title: 'Checklist Items', icon: CheckSquare },
    { number: 3, title: 'Assignment', icon: Users },
    { number: 4, title: 'Review', icon: Eye },
    { number: 5, title: 'Completion', icon: CheckSquare }
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Create the main checklist
      const checklist = await createQaChecklist({
        title: project.name,
        description: project.description,
        status: project.status
      });

      // Add all checklist items
      for (const item of project.items) {
        const checklistItem: Partial<QaChecklistItem> = {
          text: item.name,
          type: item.type,
          is_required: item.is_required,
          order_number: item.order_number,
          status: item.status,
          notes: item.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await addChecklistItem(checklist.id, checklistItem);
      }

      // TODO: Implement assignment creation when the API endpoint is available
      // For now, we'll just move to completion step
      setCurrentStep(5);
    } catch (error) {
      console.error('Failed to submit QA checklist:', error);
      // TODO: Add proper error handling/notification
    }
  }

  const addNewChecklistItem = () => {
    setProject(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), name: '', notes: '', type: 'text', is_required: true, order_number: 0, status: 'pending' }]
    }))
  }

  const removeChecklistItem = (id: string) => {
    setProject(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: string | boolean) => {
    setProject(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const toggleTeamMember = (member: User) => {
    setProject(prev => {
      const isAssigned = prev.assignments.some(a => a.user_id === member.id.toString())
      return {
        ...prev,
        assignments: isAssigned
          ? prev.assignments.filter(a => a.user_id !== member.id.toString())
          : [...prev.assignments, {
              user_id: member.id.toString(),
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
              notes: '',
              status: 'pending'
            }]
      }
    })
  }

  const updateAssignment = (userId: string, field: keyof Assignment, value: string) => {
    setProject(prev => ({
      ...prev,
      assignments: prev.assignments.map(assignment =>
        assignment.user_id === userId
          ? { ...assignment, [field]: value }
          : assignment
      )
    }))
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = QA_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setProject(prev => ({
        ...prev,
        items: template.items
      }))
      setSelectedTemplate(templateId)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="name"
                value={project.name}
                onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter checklist title"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={project.description}
                onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter checklist description"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={project.status}
                onChange={(e) => setProject(prev => ({ ...prev, status: e.target.value as 'draft' | 'active' | 'archived' }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={project.priority}
                onChange={(e) => setProject(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setProject(prev => ({
                        ...prev,
                        tags: prev.tags.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...prev.tags, tag]
                      }))
                    }}
                    className={`px-2 py-1 rounded-full text-sm ${
                      project.tags.includes(tag)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <input
                type="text"
                id="tags"
                value={project.tags.join(', ')}
                onChange={(e) => setProject(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={project.category}
                onChange={(e) => setProject(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter category"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={addNewChecklistItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Checklist Items</h3>
              <button
                type="button"
                onClick={addNewChecklistItem}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Choose a Template</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {QA_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <template.icon className="h-5 w-5 text-gray-500" />
                      <h5 className="font-medium text-gray-900">{template.name}</h5>
                    </div>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Items */}
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Checklist Items</h4>
              {project.items.map((item, index) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Text
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateChecklistItem(item.id, 'name', e.target.value)}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Enter item text"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Required
                        </label>
                        <select
                          value={item.is_required ? 'true' : 'false'}
                          onChange={(e) => updateChecklistItem(item.id, 'is_required', e.target.value === 'true')}
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          value={index + 1}
                          onChange={(e) => {
                            const newOrder = parseInt(e.target.value)
                            if (newOrder > 0 && newOrder <= project.items.length) {
                              const items = [...project.items]
                              const [movedItem] = items.splice(index, 1)
                              items.splice(newOrder - 1, 0, movedItem)
                              setProject(prev => ({ ...prev, items }))
                            }
                          }}
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          min={1}
                          max={project.items.length}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={item.notes}
                        onChange={(e) => updateChecklistItem(item.id, 'notes', e.target.value)}
                        rows={2}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Enter additional notes"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="mt-6 p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {project.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Select a template or add custom items to get started.
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Assign Team Members</h3>
            </div>
            {isLoadingUsers ? (
              <div className="text-center py-8 text-gray-500">
                Loading team members...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {availableTeamMembers.map((member) => {
                  const assignment = project.assignments.find(a => a.user_id === member.id.toString())
                  const profile = member.profile || {
                    full_name: member.name,
                    role: 'User',
                    avatar_url: '/placeholder.svg'
                  }
                  return (
                    <div
                      key={member.id}
                      className={`p-4 rounded-lg border ${
                        assignment ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={profile.avatar_url || '/placeholder.svg'}
                          alt={profile.full_name || member.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{profile.full_name || member.name}</p>
                          <p className="text-xs text-gray-500">{profile.role || 'User'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleTeamMember(member)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            assignment
                              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {assignment ? 'Assigned' : 'Assign'}
                        </button>
                      </div>
                      {assignment && (
                        <div className="space-y-4 pl-11">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Due Date
                            </label>
                            <input
                              type="date"
                              value={assignment.due_date}
                              onChange={(e) => updateAssignment(member.id.toString(), 'due_date', e.target.value)}
                              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes
                            </label>
                            <textarea
                              value={assignment.notes}
                              onChange={(e) => updateAssignment(member.id.toString(), 'notes', e.target.value)}
                              rows={2}
                              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Enter assignment notes"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                {availableTeamMembers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No team members available.
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            {/* Basic Information Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Title</p>
                  <p className="text-base text-gray-900">{project.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base text-gray-900 whitespace-pre-wrap">{project.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-base text-gray-900 capitalize">{project.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p className="text-base text-gray-900 capitalize">{project.priority}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-base text-gray-900">{project.category}</p>
                </div>
              </div>
            </div>

            {/* Checklist Items Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Checklist Items</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {project.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      </div>
                      <div>
                        <p className="text-base text-gray-900">{item.name}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                        )}
                        <div className="flex gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            item.is_required
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.is_required ? 'Required' : 'Optional'}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                            Order: {item.order_number}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignments Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Assignments</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {project.assignments.map((assignment) => {
                    const member = availableTeamMembers.find(m => m.id.toString() === assignment.user_id)
                    if (!member) return null
                    const profile = member.profile || {
                      full_name: member.name,
                      role: 'User',
                      avatar_url: '/placeholder.svg'
                    }
                    return (
                      <div key={assignment.user_id} className="flex items-center gap-3">
                        <img
                          src={profile.avatar_url || '/placeholder.svg'}
                          alt={profile.full_name || member.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{profile.full_name || member.name}</p>
                          <p className="text-xs text-gray-500">{profile.role || 'User'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                          {assignment.notes && (
                            <p className="text-xs text-gray-500 mt-1">{assignment.notes}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Checklist Created Successfully</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your QA checklist has been created and assigned to team members.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push('/qa')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Checklist
              </button>
              <button
                type="button"
                onClick={() => {
                  setProject({
                    name: '',
                    description: '',
                    status: 'draft',
                    priority: 'medium',
                    tags: [],
                    category: '',
                    items: [],
                    assignments: []
                  })
                  setCurrentStep(1)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Another
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return project.name.trim() !== '' && project.description.trim() !== ''
      case 2:
        return project.items.length > 0 && project.items.every(item => item.name.trim() !== '')
      case 3:
        return project.assignments.length > 0
      case 4:
        return true // Review step is always valid
      case 5:
        return true // Completion step is always valid
      default:
        return false
    }
  }

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
        <DashboardSidebar activePage="qa/submit" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">Create QA Checklist</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-9xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-2">Create a New QA Checklist</h2>
                <p className="text-gray-500 mb-6">Set up a new QA project with checklist items and team assignments.</p>
                
                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          currentStep >= step.number
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-0.5 h-0.5 mx-4 bg-gray-200">
                          <div
                            className={`h-full bg-indigo-600 transition-all duration-300`}
                            style={{
                              width: currentStep > step.number ? '100%' : '0%'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleBack}
                  className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentStep === 1 ? 'invisible' : ''
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2 inline" />
                  Previous
                </button>
                <button
                  onClick={currentStep === steps.length ? handleSubmit : handleNext}
                  disabled={!isStepValid()}
                  className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {currentStep === steps.length ? (
                    'Create QA Project'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 