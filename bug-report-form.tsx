"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Camera, Check, Info, Laptop, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AuthForm } from "@/components/auth-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"

const formSchema = z.object({
  title: z.string().min(5, { message: "Bug title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Please provide a detailed description" }),
  stepsToReproduce: z.string().min(10, { message: "Please provide steps to reproduce" }),
  expectedBehavior: z.string().min(5, { message: "Please describe what you expected" }),
  actualBehavior: z.string().min(5, { message: "Please describe what actually happened" }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level",
  }),
})

export default function BugReportForm() {
  const { user, loading, isRegistered } = useAuth()
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")

  // Get current browser and system info
  const browserInfo =
    typeof navigator !== "undefined"
      ? `${navigator.userAgent.match(/chrome|firefox|safari|edge|opera/i)?.[0] || "Unknown Browser"} on ${
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            ? "Mobile"
            : "Desktop"
        }`
      : "Unknown Device"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      priority: "medium",
    },
  })

  const captureScreenshot = () => {
    // In a real implementation, this would use html2canvas or a similar library
    // For this demo, we'll simulate a screenshot with a placeholder
    setScreenshotPreview("/placeholder.svg?height=200&width=320")
    toast({
      title: "Screenshot captured",
      description: "The current page has been captured",
    })
  }

  const removeScreenshot = () => {
    setScreenshotPreview(null)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // In a real implementation, you would send the form data to your API
      console.log({
        ...values,
        url: window.location.href,
        browserInfo,
        timestamp: new Date().toISOString(),
        screenshot: screenshotPreview,
        userId: user.id,
        userEmail: user.email,
      })

      setIsSubmitting(false)
      setIsSubmitted(true)

      toast({
        title: "Bug report submitted",
        description: "Your bug report has been successfully submitted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    form.reset()
    setScreenshotPreview(null)
    setIsSubmitted(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || !isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm mode={authMode} />
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Bug Report Submitted</CardTitle>
          </div>
          <CardDescription>Thank you for helping improve our products!</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Your bug report has been successfully submitted and will be reviewed by our team.
          </p>
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium">{form.getValues().title}</p>
            <p className="text-xs text-muted-foreground mt-1">Submitted just now</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={resetForm} className="w-full">
            Report Another Bug
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Sidebar>
      <Header />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-muted/50 rounded-md p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL:</span>
                <span className="font-medium truncate max-w-[200px]">
                  {typeof window !== "undefined" ? window.location.href : "example.com"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Browser/Device:</span>
                <span className="font-medium">{browserInfo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Screenshot</h3>
                {!screenshotPreview ? (
                  <Button type="button" variant="outline" size="sm" onClick={captureScreenshot} className="h-8 text-xs">
                    <Camera className="h-3.5 w-3.5 mr-1" />
                    Capture
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeScreenshot}
                    className="h-8 text-xs text-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              {screenshotPreview && (
                <div className="relative border rounded-md overflow-hidden">
                  <img
                    src={screenshotPreview || "/placeholder.svg"}
                    alt="Screenshot preview"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bug Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the bug in detail" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Low
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            High
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-medium">Reproduction Details</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Providing clear steps helps developers reproduce and fix the issue faster
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <FormField
                control={form.control}
                name="stepsToReproduce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steps to Reproduce</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="1. Go to page X&#10;2. Click on Y&#10;3. Scroll down to Z"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="expectedBehavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Behavior</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What should have happened?" className="min-h-[60px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actualBehavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Behavior</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What actually happened instead?" className="min-h-[60px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Bug Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Sidebar>
  )
}
