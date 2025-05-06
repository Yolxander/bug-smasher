"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { completeOnboarding } from "../actions/profiles"
import { toast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { ArrowRight, ArrowLeft, Bug, Target, Users, Zap, X } from "lucide-react"

const onboardingSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  role: z.enum(["developer", "qa", "product_manager", "designer"]),
  bio: z.string().min(1, "Bio is required"),
})

const teamMembers = [
  {
    name: "Robin",
    role: "Web Manager",
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
  const { user, profileId } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1: Welcome, 2: Features, 3: Team, 4: Profile
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"developer" | "qa" | "product_manager" | "designer" | null>(null)
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profileId) {
      router.push("/")
    }
  }, [profileId, router])

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: "",
      role: "developer",
      bio: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user || !user.email) {
        console.log('No user or email found')
        setError('User not authenticated')
        return
      }

      console.log('User data:', user)
      console.log('Form submitted with values:', values)
      
      const profileData = {
        full_name: values.full_name,
        role: values.role,
        bio: values.bio,
        email: user.email,
        user_id: user.id
      }

      console.log('Creating profile with data:', profileData)
      
      const result = await completeOnboarding(profileData)
      console.log('completeOnboarding result:', result)

      if (result) {
        toast({
          title: "Profile created successfully",
          description: "Your profile has been created and you can now access all features.",
        })
        // Force a refresh of the auth context
        window.location.href = '/'
      } else {
        throw new Error('Failed to create profile')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleExit = async () => {
    try {
      await signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "There was an error signing out",
        variant: "destructive",
      })
    }
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        {...form.register("full_name")}
                        placeholder="Enter your full name"
                      />
                      {form.formState.errors.full_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <Select
                        onValueChange={(value) => form.setValue("role", value as any)}
                        defaultValue={form.getValues("role")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="qa">QA Engineer</SelectItem>
                          <SelectItem value="product_manager">Product Manager</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.role.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <Textarea
                        {...form.register("bio")}
                        placeholder="Tell us about yourself"
                      />
                      {form.formState.errors.bio && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.bio.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#FFD700] hover:bg-[#F4C430]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Profile..." : "Complete Profile"}
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
      
      {/* Exit button */}
      <button
        onClick={handleExit}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        aria-label="Exit onboarding"
      >
        <X className="h-6 w-6" />
      </button>
      
      {/* Content */}
      <div className="max-w-4xl w-full px-4 relative z-10">
        {renderStep()}
      </div>
    </div>
  )
} 