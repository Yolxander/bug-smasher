"use client";

import { useState } from "react";
import { AuthForm } from "@/components/auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <AuthForm mode="signin" />
        </TabsContent>
        <TabsContent value="signup">
          <AuthForm mode="signup" />
        </TabsContent>
      </Tabs>
    </div>
  );
} 