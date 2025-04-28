import Image from "next/image"
import Link from "next/link"
import { Search, Bell, ChevronDown, ArrowRight } from "lucide-react"
import { DashboardSidebar } from "@/components/DashboardSidebar"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main container with rounded corners and shadow */}
      <div className="flex w-full max-w-[1400px] mx-auto my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar activePage="/" />

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-100 bg-white p-4">
            <div className="relative w-[400px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search bugs, reports, or team..."
                className="h-10 w-full rounded-full bg-gray-50 pl-10 pr-4 text-sm outline-none border border-gray-200 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="You"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">You</p>
                  <p className="text-xs text-gray-500">QA Tester</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Top section with banner and events */}
            <div className="flex gap-6">
              {/* Banner */}
              <div className="flex-1 rounded-2xl bg-yellow-200 p-6 flex items-center justify-between shadow-md">
                <div className="max-w-md">
                  <h2 className="text-2xl font-semibold mb-2">Streamline Your Bug Reporting</h2>
                  <p className="text-gray-700 mb-4">
                    Bug Smasher makes it easy to capture, describe, and track bugs across all your internal projects. Standardize QA, speed up fixes, and keep your team in sync.
                  </p>
                  <button className="bg-white text-black hover:bg-gray-50 py-2 px-4 rounded-md font-medium shadow">
                    Report a Bug
                  </button>
                </div>
                <div className="relative h-40 w-64 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=256"
                    alt="Bug Smasher Illustration"
                    width={256}
                    height={160}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="w-[360px]">
                <div className="rounded-2xl bg-black p-5 text-white shadow-md">
                  <h3 className="text-base font-medium mb-2">QA Announcements</h3>
                  <div>
                    <h4 className="text-lg font-medium">Bug Bash Friday</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                      <span>All Teams</span>
                      <span>|</span>
                      <span>2pm - 5pm</span>
                    </div>
                    <button className="mt-4 bg-amber-400 text-black hover:bg-amber-500 py-2 px-4 rounded-md font-medium">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Carousel indicator */}
                <div className="flex justify-center mt-2 gap-1">
                  <div className="h-2 w-2 rounded-full bg-black"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                </div>

                {/* Event Card */}
                <div className="mt-4 rounded-xl border-0 p-0">
                  <div className="flex items-center gap-3 p-2">
                    <div className="h-6 w-6 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                      <span className="text-xs">Q</span>
                    </div>
                    <span className="text-sm">QA Tip</span>
                  </div>

                  <div className="mt-1 rounded-xl border border-gray-200 p-4 mx-2">
                    <h4 className="font-medium">Be Specific!</h4>
                    <p className="text-xs text-gray-500 mt-1">Always include steps to reproduce and expected vs. actual results.</p>
                    <p className="text-xs mt-4">Clear reports = faster fixes.</p>
                    <div className="flex gap-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-black"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bug Reports section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Bug Reports</h2>
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  See all
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Bug Card 1 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <h3 className="font-medium mb-1">Login page: Button not responsive</h3>
                    <p className="text-xl font-semibold mb-4 text-red-500">High Priority</p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-400"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 15l4-4 4 4" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Reported by Jamie, Chrome on Mac</span>
                    </div>
                  </div>
                </div>

                {/* Bug Card 2 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <h3 className="font-medium mb-1">Image upload fails on Safari</h3>
                    <p className="text-xl font-semibold mb-4 text-yellow-500">Medium Priority</p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-400"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 15l4-4 4 4" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Reported by Sam, Safari on iPhone</span>
                    </div>
                  </div>
                </div>

                {/* Bug Card 3 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <h3 className="font-medium mb-1">Dashboard: Graph not loading</h3>
                    <p className="text-xl font-semibold mb-4 text-green-600">Low Priority</p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-400"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 15l4-4 4 4" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Reported by Taylor, Edge on Windows</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QA Destinations and Integrations */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-2">Bug Smasher Highlights</h2>
                <p className="text-gray-600 text-sm mb-4">Key features to streamline your QA process</p>

                <div className="grid grid-cols-2 gap-4">
                  {/* Feature 1 */}
                  <div className="relative h-[205px] rounded-3xl overflow-hidden shadow bg-amber-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-medium">Auto-capture Context</h3>
                      <p className="text-sm font-light">URL, browser, device, and timestamp</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="relative h-[205px] rounded-3xl overflow-hidden shadow bg-amber-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-medium">In-browser Screenshots</h3>
                      <p className="text-sm font-light">Capture issues visually, instantly</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="relative h-[205px] rounded-3xl overflow-hidden shadow bg-amber-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-medium">Central Dashboard</h3>
                      <p className="text-sm font-light">Track, filter, and assign bugs</p>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="relative h-[205px] rounded-3xl overflow-hidden shadow bg-amber-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-medium">Asana & Teams Integration</h3>
                      <p className="text-sm font-light">Push bugs to your workflow</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Integrations</h2>
                <p className="text-gray-600 text-sm mb-4">Connect Bug Smasher with your favorite tools</p>

                <div className="space-y-4">
                  {/* Integration 1 */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-amber-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-amber-500">A</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Asana</h3>
                        <p className="text-xs text-gray-500">Auto-create tasks from bugs</p>
                      </div>
                    </div>
                    <div className="bg-black rounded-full p-1">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Integration 2 */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-500">T</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Microsoft Teams</h3>
                        <p className="text-xs text-gray-500">Notify QA/DevOps channels</p>
                      </div>
                    </div>
                    <div className="bg-black rounded-full p-1">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Integration 3 */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-green-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-green-500">S</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Screenshot Capture</h3>
                        <p className="text-xs text-gray-500">Visual bug evidence</p>
                      </div>
                    </div>
                    <div className="bg-black rounded-full p-1">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Integration 4 */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-500">API</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Custom API</h3>
                        <p className="text-xs text-gray-500">Connect your own tools</p>
                      </div>
                    </div>
                    <div className="bg-black rounded-full p-1">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
