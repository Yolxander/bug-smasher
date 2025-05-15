"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getSubmissions } from "../actions/submissions";
import { Submission } from "../actions/submissions";
import { useAuth } from "@/lib/auth-context"

export default function MySubmissionsPage() {
  const { user, profileId } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await getSubmissions();
        if (!data) {
          setError('Failed to fetch submissions');
          return;
        }
        console.log('All Submissions:', data);
        console.log('User ID:', user?.id);
        // Filter submissions where either reported_by or assignee_id matches the user's ID
        const mySubmissions = data.filter(sub => {
          console.log('Checking submission:', {
            id: sub.id,
            reported_by: sub.reported_by,
            assignee_id: sub.assignee_id,
            user_id: user?.id,
            matches_reported: sub.reported_by === user?.id,
            matches_assignee: sub.assignee_id === user?.id
          });
          return sub.reported_by === user?.id || sub.assignee_id === user?.id;
        });
        console.log('Filtered Submissions:', mySubmissions);
        setSubmissions(mySubmissions);
      } catch (error) {
        setError('Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSubmissions();
    }
  }, [user?.id]);

  const statusOptions = ["All", "Open", "In Progress", "Resolved"];
  const priorityOptions = ["All", "High", "Medium", "Low"];

  const filteredSubmissions = submissions.filter((submission) => {
    if (!submission) return false;
    const matchesStatus = status === "All" || submission.status === status;
    const matchesPriority = priority === "All" || submission.priority === priority;
    const matchesSearch =
      submission.title?.toLowerCase().includes(search.toLowerCase()) ||
      submission.description?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activePage="my-submissions" />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-semibold">My Submissions</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link
                      href="/submit"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Report New Bug
                    </Link>
                  </div>
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
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search submissions..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                </div>
                <div className="min-w-[200px]">
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
                <div className="min-w-[200px]">
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
                <button
                  className="ml-auto bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  disabled={selected.length === 0}
                >
                  Bulk Action
                </button>
              </div>
            </div>

            {/* Submissions Table */}
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No submissions found.
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
    </div>
  );
}