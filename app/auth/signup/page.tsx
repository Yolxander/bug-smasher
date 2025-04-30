"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/components/ui/use-toast";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Starting signup process for:', email);
      await signUp(email, password);
      console.log('Signup successful, showing success message');
      toast({
        title: "Check your email",
        description: "We've sent you a verification link. Please check your email to complete the signup process.",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Signup failed:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign up form */}
      <div className="w-1/2 p-8 flex flex-col justify-center max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4 text-black">Join the Bug Hunt</h2>
          <p className="text-gray-500">Become a valued member of our bug hunting community. Find bugs, earn rewards, and help create better software.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus-visible:ring-[#FFD700] focus-visible:border-[#FFD700]"
              disabled={isLoading}
              required
            />
            <Input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus-visible:ring-[#FFD700] focus-visible:border-[#FFD700]"
              disabled={isLoading}
              required
            />
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus-visible:ring-[#FFD700] focus-visible:border-[#FFD700]"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-black/90 text-[#FFD700] py-3 rounded-lg border-2 border-[#FFD700] font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Start Bug Hunting"}
          </Button>

          <p className="text-center text-gray-600 text-sm">
            Already hunting bugs?{" "}
            <Link href="/auth/login" className="text-[#FFD700] hover:text-[#F4C430] font-medium">
              Sign In
            </Link>
          </p>
        </form>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black/5 rounded-full">
              <Image src="/target-icon.svg" alt="Target" width={20} height={20} />
            </div>
            <p className="text-sm text-gray-600">Find and report software issues</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black/5 rounded-full">
              <Image src="/reward-icon.svg" alt="Reward" width={20} height={20} />
            </div>
            <p className="text-sm text-gray-600">Earn rewards for verified bugs</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black/5 rounded-full">
              <Image src="/community-icon.svg" alt="Community" width={20} height={20} />
            </div>
            <p className="text-sm text-gray-600">Join a community of bug hunters</p>
          </div>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="w-1/2 relative">
        <Image
          src="/login-right-bg.png"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
} 