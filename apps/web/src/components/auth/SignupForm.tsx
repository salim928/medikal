"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validation";
import { signUp } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const role = watch("role");

  async function onSubmit(data: SignupInput) {
    setIsLoading(true);
    setGeneralError("");

    try {
      console.log('📝 Starting signup...', data.email);
      
      await signUp(data.email, data.password, data.role, data.fullName);
      
      console.log('✅ Signup successful');
      
      // Small delay to ensure user creation is complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('🔄 Redirecting to dashboard...');
      
      // Use window.location.href for reliable full-page navigation
      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error('❌ Signup failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Signup failed. Please try again.";
      
      setGeneralError(errorMessage);
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create Account</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {generalError}
            </div>
          )}

          <Input
            {...register("fullName")}
            label="Full Name"
            placeholder="John Doe"
            autoComplete="name"
            error={errors.fullName?.message}
          />

          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="patient"
                  {...register("role")}
                  className="mr-2"
                />
                Patient
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="provider"
                  {...register("role")}
                  className="mr-2"
                />
                Provider
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <Input
            {...register("password")}
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
          />

          <Input
            {...register("confirmPassword")}
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}