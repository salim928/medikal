"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-fresh";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const patientSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PatientInput = z.infer<typeof patientSchema>;

export function PatientRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
  });

  async function onSubmit(data: PatientInput) {
    setIsLoading(true);
    setError("");

    try {
      const result = await signUp(data.email, data.password, "patient", data.fullName, {
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
      });
      
      // Check for errors
      if (result.error) {
        throw new Error(result.error.message);
      }

      // Check if email confirmation is required
      if (!result.session) {
        setError("Please check your email to confirm your account before signing in.");
        setIsLoading(false);
        return;
      }

      // Success! Redirect to dashboard
      router.push("/dashboard/patient");
      router.refresh();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold">Patient Registration</h2>
        <p className="text-slate-500">Create your patient account</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            {...register("fullName")}
            label="Full Name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            error={errors.fullName?.message}
            required
          />

          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            required
          />

          <Input
            {...register("phone")}
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            error={errors.phone?.message}
          />

          <Input
            {...register("dateOfBirth")}
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gender
            </label>
            <select
              {...register("gender")}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-brand-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <Input
            {...register("password")}
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            required
          />

          <Input
            {...register("confirmPassword")}
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            required
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating Account..." : "Create Patient Account"}
          </Button>

          <div className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a href="/login" className="text-brand-600 hover:text-brand-700 hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
