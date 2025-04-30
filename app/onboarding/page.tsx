"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { completeOnboarding } from "@/lib/profiles"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { ArrowRight, ArrowLeft, Bug, Target, Users, Zap } from "lucide-react"

const onboardingSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.enum(["developer", "qa", "product_manager", "designer"], {
    required_error: "Please select your role",
  }),
  bio: z.string().min(10, { message: "Please provide a brief bio" }),
})

const teamMembers = [
  {
    name: "Robin",
    role: "Good worker",
    image: "/people/robin-final.png",
    bio: "Good worker"
  },
  {
    name: "Pedro",
    role: "Product Lead",
    image: "/people/pedro-final.png",
    bio: "Leading product strategy and vision"
  },
  {
    name: "Yolxi",
    role: "Designer and Developer",
    image: "/people/yolxi-final.png",
    bio: "Crafting beautiful experiences"
  }
]

const features = [
  {
    icon: <Bug className="w-6 h-6 text-amber-400" />,
    title: "Smart Bug Tracking",
    description: "Intelligent bug tracking with automatic categorization and priority assignment"
  },
  {
    icon: <Users className="w-6 h-6 text-amber-400" />,
    title: "Team Collaboration",
    description: "Real-time collaboration with team members and stakeholders"
  },
  {
    icon: <Target className="w-6 h-6 text-amber-400" />,
    title: "Issue Resolution",
    description: "Track and resolve issues efficiently with our streamlined workflow"
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Quick Actions",
    description: "Perform common actions quickly with keyboard shortcuts and smart suggestions"
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1: Welcome, 2: Features, 3: Team, 4: Profile

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: "",
      bio: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await completeOnboarding(user.id, values)
      toast({
        title: "Profile completed",
        description: "Your profile has been updated successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast({
        title: "Error",
        description: "There was an error updating your profile",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    setStep(prev => prev + 1)
  }

  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <Image
              src="/logo.png"
              alt="Bug Smasher Logo"
              width={160}
              height={160}
              className="mx-auto"
            />
            <h1 className="text-4xl font-bold text-amber-400">
              Welcome to Bug Smasher
            </h1>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Your ultimate companion for efficient bug tracking and team collaboration.
              Let's get you started with a quick tour!
            </p>
            <Button 
              onClick={nextStep}
              className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8 py-2 rounded-lg transition-colors"
            >
              Start Tour <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-400 mb-4">
                Powerful Features
              </h2>
              <p className="text-gray-300">
                Everything you need to manage bugs effectively
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-[#FFF8CC] p-6 rounded-xl border border-amber-200 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4 text-amber-400">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button 
                onClick={prevStep}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={nextStep}
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8 py-2 rounded-lg transition-colors"
              >
                Meet the Team <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-400 mb-4">
                Meet the Team
              </h2>
              <p className="text-gray-300">
                The minds behind Bug Smasher
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="bg-[#FFF8CC] p-6 rounded-xl border border-amber-200 text-center hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="mx-auto rounded-full mb-4 border-4 border-amber-400"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 mb-2">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button 
                onClick={prevStep}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={nextStep}
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8 py-2 rounded-lg transition-colors"
              >
                Complete Your Profile <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-400 mb-4">
                Complete Your Profile
              </h2>
              <p className="text-gray-300">
                Tell us a bit about yourself to get started
              </p>
            </div>

            <div className="bg-[#FFF8CC] rounded-xl shadow-xl p-6 border border-amber-200">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field}
                            className="bg-white border-amber-200 text-gray-900 placeholder:text-gray-500 focus:border-amber-400 focus:ring-amber-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-amber-200 text-gray-900 focus:border-amber-400 focus:ring-amber-400">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-amber-200">
                            <SelectItem value="developer" className="text-gray-900 hover:bg-amber-50">Developer</SelectItem>
                            <SelectItem value="qa" className="text-gray-900 hover:bg-amber-50">QA Engineer</SelectItem>
                            <SelectItem value="product_manager" className="text-gray-900 hover:bg-amber-50">Product Manager</SelectItem>
                            <SelectItem value="designer" className="text-gray-900 hover:bg-amber-50">Designer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself and your experience"
                            className="min-h-[100px] bg-white border-amber-200 text-gray-900 placeholder:text-gray-500 focus:border-amber-400 focus:ring-amber-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button 
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-2 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8 py-2 rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Complete Profile"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )
    }
  }

  return (
    <div 
      className="min-h-screen bg-black flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("/onboarding-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75" />
      
      {/* Content */}
      <div className="max-w-4xl w-full px-4 relative z-10">
        {renderStep()}
      </div>
    </div>
  )
} 