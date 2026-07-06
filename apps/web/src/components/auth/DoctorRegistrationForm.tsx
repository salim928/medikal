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

const doctorSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Phone number is required"),
  specialization: z.string().min(2, "Specialization is required"),
  licenseNumber: z.string().min(4, "Medical license number is required"),
  yearsOfExperience: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type DoctorInput = z.infer<typeof doctorSchema>;

export function DoctorRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorInput>({
    resolver: zodResolver(doctorSchema),
  });

  async function onSubmit(data: DoctorInput) {
    setIsLoading(true);
    setError("");

    try {
      // Include additional metadata for doctor profile
      const metadata = {
        full_name: data.fullName,
        phone: data.phone,
        specialization: data.specialization,
        license_number: data.licenseNumber,
        years_of_experience: data.yearsOfExperience,
        hospital_affiliation: data.hospitalAffiliation,
      };

      const result = await signUp(data.email, data.password, "doctor", data.fullName, metadata);
      
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

      // Success! Redirect to doctor dashboard
      router.push("/dashboard/doctor");
      router.refresh();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold">Doctor Registration</h2>
        <p className="text-slate-500">Create your professional account</p>
        <div className="mt-2 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300">
            ⚠️ Your account will be pending verification. You'll need to provide proof of medical license before accessing full features.
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("fullName")}
              label="Full Name"
              type="text"
              placeholder="Dr. John Doe"
              autoComplete="name"
              error={errors.fullName?.message}
              required
            />

            <Input
              {...register("phone")}
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              error={errors.phone?.message}
              required
            />
          </div>

          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="doctor@hospital.com"
            autoComplete="email"
            error={errors.email?.message}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("specialization")}
              label="Specialization"
              type="text"
              placeholder="e.g., Cardiology, Pediatrics"
              error={errors.specialization?.message}
              required
            />

            <Input
              {...register("licenseNumber")}
              label="Medical License Number"
              type="text"
              placeholder="MED-123456"
              error={errors.licenseNumber?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("yearsOfExperience")}
              label="Years of Experience"
              type="number"
              placeholder="5"
              error={errors.yearsOfExperience?.message}
            />

            <Input
              {...register("hospitalAffiliation")}
              label="Hospital/Clinic Affiliation"
              type="text"
              placeholder="City General Hospital"
              error={errors.hospitalAffiliation?.message}
            />
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
            {isLoading ? "Creating Account..." : "Create Doctor Account"}
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
