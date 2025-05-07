"use client"

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { CheckSquare, Users, ListChecks, ArrowRight, ArrowLeft, Plus, X, Globe, Calendar, FileText, Eye } from 'lucide-react'

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
}

interface QAProject {
  name: string
  description: string
  items: ChecklistItem[]
  teamMembers: TeamMember[]
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
      { id: '1', name: 'Page loads correctly on all major browsers (Chrome, Safari, Firefox, Edge)', notes: '' },
      { id: '2', name: 'Responsive design: layouts adjust across desktop, tablet, and mobile', notes: '' },
      { id: '3', name: 'Navigation/menu works and links to correct pages', notes: '' },
      { id: '4', name: 'Forms submit correctly with error/success validation', notes: '' },
      { id: '5', name: 'SEO metadata (title, description, OG tags) are implemented', notes: '' },
      { id: '6', name: 'Images are optimized and display without distortion', notes: '' },
      { id: '7', name: 'Accessibility basics (alt text, tab navigation, contrast) are in place', notes: '' },
      { id: '8', name: 'All text is free of typos and grammatical errors', notes: '' },
      { id: '9', name: 'Scripts and third-party integrations (e.g., analytics, chat) load properly', notes: '' },
      { id: '10', name: 'Console is free of JavaScript errors', notes: '' }
    ]
  },
  {
    id: 'event',
    name: 'Event QA Checklist',
    description: 'For internal or public-facing event microsites or registration tools.',
    icon: Calendar,
    items: [
      { id: '1', name: 'Event date, time, and location details are accurate', notes: '' },
      { id: '2', name: 'Registration form works on all devices', notes: '' },
      { id: '3', name: 'Confirmation emails are triggered and formatted correctly', notes: '' },
      { id: '4', name: 'Countdown timers or live widgets function properly', notes: '' },
      { id: '5', name: 'Agenda and speaker bios are current and properly displayed', notes: '' },
      { id: '6', name: 'Event maps or directions are correct', notes: '' },
      { id: '7', name: 'Ticketing or RSVP system integrates properly', notes: '' },
      { id: '8', name: 'Embedded video or livestream (if applicable) functions smoothly', notes: '' },
      { id: '9', name: 'Social sharing buttons lead to correct channels', notes: '' },
      { id: '10', name: 'Last-minute updates are reflected across all key pages', notes: '' }
    ]
  },
  {
    id: 'content',
    name: 'Content QA Checklist',
    description: 'For teams handling marketing copy, media assets, or brand content across channels.',
    icon: FileText,
    items: [
      { id: '1', name: 'Headlines, body copy, and CTAs are accurate and approved', notes: '' },
      { id: '2', name: 'Grammar and spelling checked (including proper brand tone)', notes: '' },
      { id: '3', name: 'Image/video assets are correctly placed and credited', notes: '' },
      { id: '4', name: 'Content aligns with campaign goals or brief', notes: '' },
      { id: '5', name: 'Text overlays on images are readable and properly spaced', notes: '' },
      { id: '6', name: 'All links and buttons are functional', notes: '' },
      { id: '7', name: 'Legal disclaimers, T&Cs, or footnotes are included if needed', notes: '' },
      { id: '8', name: 'Publish dates and versioning are up to date', notes: '' },
      { id: '9', name: 'Assets pass review on staging before going live', notes: '' },
      { id: '10', name: 'Metadata (titles, alt text, descriptions) is populated', notes: '' }
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
    items: [],
    teamMembers: []
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Mock team members data
  const availableTeamMembers: TeamMember[] = [
    { id: '1', name: 'John Doe', role: 'QA Engineer', avatar: '/placeholder.svg' },
    { id: '2', name: 'Jane Smith', role: 'Developer', avatar: '/placeholder.svg' },
    { id: '3', name: 'Mike Johnson', role: 'Product Manager', avatar: '/placeholder.svg' },
    { id: '4', name: 'Sarah Wilson', role: 'QA Lead', avatar: '/placeholder.svg' },
  ]

  const steps = [
    { number: 1, title: 'Project Details', icon: ListChecks },
    { number: 2, title: 'Checklist Items', icon: CheckSquare },
    { number: 3, title: 'Team Assignment', icon: Users },
    { number: 4, title: 'Preview', icon: Eye },
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

  const handleSubmit = () => {
    console.log('Submitting QA project:', project)
    router.push('/qa')
  }

  const addChecklistItem = () => {
    setProject(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), name: '', notes: '' }]
    }))
  }

  const removeChecklistItem = (id: string) => {
    setProject(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: string) => {
    setProject(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const toggleTeamMember = (member: TeamMember) => {
    setProject(prev => {
      const isSelected = prev.teamMembers.some(m => m.id === member.id)
      return {
        ...prev,
        teamMembers: isSelected
          ? prev.teamMembers.filter(m => m.id !== member.id)
          : [...prev.teamMembers, member]
      }
    })
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
                Project Name
              </label>
              <input
                type="text"
                id="name"
                value={project.name}
                onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                id="description"
                value={project.description}
                onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter project description"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Checklist Items</h3>
              <button
                onClick={addChecklistItem}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Custom Item
              </button>
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Select a Template</h4>
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
              {project.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateChecklistItem(item.id, 'name', e.target.value)}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Enter item name"
                      />
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
            <div className="grid grid-cols-2 gap-4">
              {availableTeamMembers.map((member) => {
                const isSelected = project.teamMembers.some(m => m.id === member.id)
                return (
                  <div
                    key={member.id}
                    onClick={() => toggleTeamMember(member)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            {/* Project Details Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Project Name</p>
                  <p className="text-base text-gray-900">{project.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base text-gray-900 whitespace-pre-wrap">{project.description}</p>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Members Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Assigned Team Members</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  {project.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        return project.teamMembers.length > 0
      case 4:
        return true // Preview step is always valid
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