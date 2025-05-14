"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, Wrench, X, Save, AlertCircle, Bug, CheckCircle, Clock } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getSubmissions } from "../actions/submissions";
import { Submission } from "../actions/submissions";
import { useAuth } from "@/lib/auth-context"

export default function FixBugsPage() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBug, setSelectedBug] = useState<Submission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [solution, setSolution] = useState("");
  const [findings, setFindings] = useState("");
  const [qaTask, setQaTask] = useState("All");
  const [device, setDevice] = useState("All");
  const [browser, setBrowser] = useState("All");
  const [os, setOs] = useState("All");
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await getSubmissions();
        if (!data) {
          setError('Failed to fetch submissions');
          return;
        }
        setSubmissions(data);
      } catch (error) {
        setError('Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const statusOptions = ["All", "Open", "In Progress", "Resolved"];
  const priorityOptions = ["All", "High", "Medium", "Low"];
  const qaTaskOptions = ["All", ...new Set(submissions.map(s => s.qa_list_item_id).filter(Boolean))];
  const deviceOptions = ["All", ...new Set(submissions.map(s => s.device).filter(Boolean))];
  const browserOptions = ["All", ...new Set(submissions.map(s => s.browser).filter(Boolean))];
  const osOptions = ["All", ...new Set(submissions.map(s => s.os).filter(Boolean))];

  const filteredSubmissions = submissions.filter((submission) => {
    if (!submission) return false;
    const matchesStatus = status === "All" || submission.status === status;
    const matchesPriority = priority === "All" || submission.priority === priority;
    const matchesQaTask = qaTask === "All" || submission.qa_list_item_id === qaTask;
    const matchesDevice = device === "All" || submission.device === device;
    const matchesBrowser = browser === "All" || submission.browser === browser;
    const matchesOs = os === "All" || submission.os === os;
    const matchesSearch =
      submission.title?.toLowerCase().includes(search.toLowerCase()) ||
      submission.description?.toLowerCase().includes(search.toLowerCase()) ||
      submission.steps_to_reproduce?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPriority && matchesQaTask && matchesDevice && matchesBrowser && matchesOs && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === filteredSubmissions.length) {
      setSelected([]);
    } else {
      setSelected(filteredSubmissions.map((submission) => submission.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const handleFixClick = (submission: Submission) => {
    setSelectedBug(submission);
    setSolution(submission.solution || "");
    setFindings(submission.findings || "");
    setIsDrawerOpen(true);
  };

  const handleSaveFix = async () => {
    if (!selectedBug) return;
    
    try {
      // TODO: Implement save functionality
      // await updateSubmission(selectedBug.id, {
      //   status: "Resolved",
      //   solution,
      //   findings
      // });
      setIsDrawerOpen(false);
      setSelectedBug(null);
    } catch (error) {
      console.error('Error saving fix:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="fix-bugs" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">Fix Bugs</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                      <Bell className="h-6 w-6" />
                    </button>
                    <div className="ml-3 relative">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none"
                          id="user-menu-button"
                        >
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                          <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            {/* Filters */}
            <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bugs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">QA Task</label>
                  <select
                    value={qaTask}
                    onChange={(e) => setQaTask(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    {qaTaskOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    {deviceOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Browser</label>
                  <select
                    value={browser}
                    onChange={(e) => setBrowser(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    {browserOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OS</label>
                  <select
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    {osOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bugs Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selected.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                          onChange={selectAll}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          No bugs found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selected.includes(submission.id)}
                              onChange={() => toggleSelect(submission.id)}
                              className="rounded border-gray-300 text-black focus:ring-black"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{submission.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{submission.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.priority)}`}>
                              {submission.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.device}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleFixClick(submission)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <Wrench className="h-4 w-4 mr-1" />
                              Fix
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Fix Bug Drawer */}
      {isDrawerOpen && selectedBug && (
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
                          <Bug className="h-6 w-6 text-indigo-600" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Fix Bug</h2>
                        <p className="text-sm text-gray-500">Update bug status and add solution</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-6 space-y-8">
                    {/* Bug Details Accordion */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Bug className="h-5 w-5 text-indigo-600" />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900">Bug Details</h3>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isDetailsExpanded && (
                        <div className="p-6 space-y-6 border-t border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 font-mono">{selectedBug.title}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 font-mono">{selectedBug.description}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Steps to Reproduce</label>
                            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 font-mono whitespace-pre-wrap">{selectedBug.steps_to_reproduce}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Behavior</label>
                            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 font-mono">{selectedBug.expected_behavior}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Behavior</label>
                            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 font-mono">{selectedBug.actual_behavior}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                <span className="text-xs text-gray-500 block font-medium">Device</span>
                                <span className="text-sm text-gray-900 font-mono">{selectedBug.device}</span>
                              </div>
                              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                <span className="text-xs text-gray-500 block font-medium">Browser</span>
                                <span className="text-sm text-gray-900 font-mono">{selectedBug.browser}</span>
                              </div>
                              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                <span className="text-xs text-gray-500 block font-medium">OS</span>
                                <span className="text-sm text-gray-900 font-mono">{selectedBug.os}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Findings */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Findings</h3>
                          <p className="text-sm text-gray-500">Technical analysis and investigation results</p>
                        </div>
                      </div>
                      <div className="mt-1">
                        <textarea
                          rows={4}
                          className="font-mono shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={findings}
                          onChange={(e) => setFindings(e.target.value)}
                          placeholder="Describe your technical findings, including:
- Root cause analysis
- Affected components
- Error logs or stack traces
- Performance impact"
                        />
                      </div>
                    </div>

                    {/* Solution */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Solution</h3>
                          <p className="text-sm text-gray-500">Implementation details and fix approach</p>
                        </div>
                      </div>
                      <div className="mt-1">
                        <textarea
                          rows={4}
                          className="font-mono shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={solution}
                          onChange={(e) => setSolution(e.target.value)}
                          placeholder="Describe your solution, including:
- Code changes made
- Testing approach
- Performance considerations
- Potential side effects"
                        />
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Save className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Status Update</h3>
                          <p className="text-sm text-gray-500">Current state and next steps</p>
                        </div>
                      </div>
                      <div className="mt-1">
                        <select
                          value={selectedBug.status}
                          onChange={(e) => setSelectedBug({ ...selectedBug, status: e.target.value })}
                          className="font-mono mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                          {statusOptions.filter(opt => opt !== "All").map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="mt-2 text-sm text-gray-500">
                          {selectedBug.status === "Resolved" && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Ready for QA verification
                            </div>
                          )}
                          {selectedBug.status === "In Progress" && (
                            <div className="flex items-center text-blue-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Currently being worked on
                            </div>
                          )}
                          {selectedBug.status === "Open" && (
                            <div className="flex items-center text-red-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Needs attention
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={handleSaveFix}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Fix
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 