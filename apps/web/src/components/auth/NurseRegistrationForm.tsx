"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-fresh";
import { Heart } from "lucide-react";

const nurseSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  specialization: z.string().optional(),
  shiftPreference: z.enum(["day", "night", "rotating", "flexible"]),
  availableForHomeCare: z.boolean().default(false),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type NurseFormData = z.infer<typeof nurseSchema>;

export function NurseRegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NurseFormData>({
    resolver: zodResolver(nurseSchema),
  });

  const onSubmit = async (data: NurseFormData) => {
    setLoading(true);
    setError(null);

    try {
      const metadata = {
        full_name: data.fullName,
        phone: data.phone,
        license_number: data.licenseNumber,
        specialization: data.specialization || null,
        shift_preference: data.shiftPreference,
        available_for_home_care: data.availableForHomeCare,
      };

      const result = await signUp(data.email, data.password, "nurse", data.fullName, metadata);
      
      // Check for errors
      if (result.error) {
        throw new Error(result.error.message);
      }

      // Check if email confirmation is required
      if (!result.session) {
        setError("Please check your email to confirm your account before signing in.");
        setLoading(false);
        return;
      }

      // Success! Redirect to nurse dashboard
      router.push("/dashboard/nurse");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-slate-900" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Nurse Registration</h2>
        <p className="text-slate-500">Join our healthcare team</p>
      </div>

      {/* Verification Notice */}
      <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> Your account will be pending verification. Our team will review your
          license credentials before granting full access.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              placeholder="Jane Doe, RN"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              placeholder="jane.doe@hospital.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Phone and License */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              License Number *
            </label>
            <input
              type="text"
              {...register("licenseNumber")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              placeholder="RN-123456"
            />
            {errors.licenseNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.licenseNumber.message}</p>
            )}
          </div>
        </div>

        {/* Row 3: Specialization and Shift Preference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Specialization (Optional)
            </label>
            <input
              type="text"
              {...register("specialization")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              placeholder="e.g., ICU, Pediatrics, ER"
            />
            {errors.specialization && (
              <p className="mt-1 text-sm text-red-400">{errors.specialization.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Shift Preference *
            </label>
            <select
              {...register("shiftPreference")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 focus:outline-none focus:border-pink-500"
            >
              <option value="day">Day Shift</option>
              <option value="night">Night Shift</option>
              <option value="rotating">Rotating</option>
              <option value="flexible">Flexible</option>
            </select>
            {errors.shiftPreference && (
              <p className="mt-1 text-sm text-red-400">{errors.shiftPreference.message}</p>
            )}
          </div>
        </div>

        {/* Home Care Availability */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register("availableForHomeCare")}
            className="w-5 h-5 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-pink-500"
          />
          <label className="text-sm text-slate-700">
            Available for home care visits
          </label>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              placeholder="Min 8 characters"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-slate-900 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="text-pink-400 hover:text-pink-300 font-medium">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
