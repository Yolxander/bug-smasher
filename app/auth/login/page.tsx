"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      await signIn(email, password);
      console.log('Login successful, redirecting...');
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="w-1/2 p-8 flex flex-col justify-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Image src="/bug-icon.svg" alt="Bug Smasher" width={32} height={32} />
            <h1 className="text-2xl font-bold text-black">Bug Smasher</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-black">Welcome Back, Bug Hunter!</h2>
          <p className="text-gray-500">Ready to help make software better? Sign in to start reporting bugs and earning rewards.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus-visible:ring-[#FFD700] focus-visible:border-[#FFD700]"
              disabled={isLoading}
              required
            />
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus-visible:ring-[#FFD700] focus-visible:border-[#FFD700]"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#FFD700] text-[#FFD700] focus:ring-[#FFD700]"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#FFD700] hover:text-[#F4C430]"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-black/90 text-[#FFD700] py-3 rounded-lg border-2 border-[#FFD700] font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In to Hunt Bugs"}
          </Button>

          <p className="text-center text-gray-600 text-sm">
            New to bug hunting?{" "}
            <Link href="/auth/signup" className="text-[#FFD700] hover:text-[#F4C430] font-medium">
              Join the Community
            </Link>
          </p>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to help improve software quality and follow our community guidelines.
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