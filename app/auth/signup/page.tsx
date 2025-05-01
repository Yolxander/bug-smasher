"use client";

import { useState, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update name when email changes
  useEffect(() => {
    if (email && !name) {
      setName(email.split('@')[0]);
    }
  }, [email, name]);

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
      await signUp(email, password, name);
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
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            {isLoading ? "Creating account..." : "Join the Bug Hunt"}
          </Button>

          <p className="text-center text-gray-600 text-sm">
            Already a bug hunter?{" "}
            <Link href="/auth/login" className="text-[#FFD700] hover:text-[#F4C430] font-medium">
              Sign In
            </Link>
          </p>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to help improve software quality and follow our community guidelines.
          </p>
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