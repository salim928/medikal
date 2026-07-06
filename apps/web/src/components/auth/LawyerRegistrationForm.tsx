"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-fresh";
import { Scale } from "lucide-react";

const lawyerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  barLicenseNumber: z.string().min(3, "Bar license number is required"),
  stateBar: z.string().min(2, "State bar is required"),
  specializations: z.string().optional(),
  lawFirmName: z.string().optional(),
  yearsOfPractice: z.number().min(0).optional(),
  acceptingNewClients: z.boolean().default(true),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LawyerFormData = z.infer<typeof lawyerSchema>;

export function LawyerRegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LawyerFormData>({
    resolver: zodResolver(lawyerSchema),
  });

  const onSubmit = async (data: LawyerFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Parse specializations as comma-separated array
      const specializationsArray = data.specializations
        ? data.specializations.split(",").map((spec) => spec.trim())
        : [];

      const metadata = {
        full_name: data.fullName,
        phone: data.phone,
        bar_license_number: data.barLicenseNumber,
        state_bar: data.stateBar,
        specializations: specializationsArray,
        law_firm_name: data.lawFirmName || null,
        years_of_practice: data.yearsOfPractice || 0,
        accepting_new_clients: data.acceptingNewClients,
      };

      const result = await signUp(data.email, data.password, "lawyer", data.fullName, metadata);
      
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

      // Success! Redirect to lawyer dashboard
      router.push("/dashboard/lawyer");
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
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Scale className="w-8 h-8 text-slate-900" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Healthcare Lawyer Registration</h2>
        <p className="text-slate-500">Providing legal expertise in healthcare</p>
      </div>

      {/* Verification Notice */}
      <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> Your account will be pending verification. Our team will review your
          bar license and credentials before granting full access.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="John Smith, Esq."
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="john.smith@lawfirm.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Phone and Bar License */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bar License Number *
            </label>
            <input
              type="text"
              {...register("barLicenseNumber")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="BAR-123456"
            />
            {errors.barLicenseNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.barLicenseNumber.message}</p>
            )}
          </div>
        </div>

        {/* Row 3: State Bar and Specializations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              State Bar *
            </label>
            <input
              type="text"
              {...register("stateBar")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="e.g., California, New York"
            />
            {errors.stateBar && (
              <p className="mt-1 text-sm text-red-400">{errors.stateBar.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Specializations (Optional)
            </label>
            <input
              type="text"
              {...register("specializations")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="Medical Malpractice, Healthcare Compliance"
            />
            <p className="mt-1 text-xs text-slate-500">Separate multiple specializations with commas</p>
            {errors.specializations && (
              <p className="mt-1 text-sm text-red-400">{errors.specializations.message}</p>
            )}
          </div>
        </div>

        {/* Row 4: Law Firm and Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Law Firm Name (Optional)
            </label>
            <input
              type="text"
              {...register("lawFirmName")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="Smith & Associates"
            />
            {errors.lawFirmName && (
              <p className="mt-1 text-sm text-red-400">{errors.lawFirmName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Years of Practice (Optional)
            </label>
            <input
              type="number"
              {...register("yearsOfPractice", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              placeholder="10"
              min="0"
            />
            {errors.yearsOfPractice && (
              <p className="mt-1 text-sm text-red-400">{errors.yearsOfPractice.message}</p>
            )}
          </div>
        </div>

        {/* Accepting New Clients */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register("acceptingNewClients")}
            defaultChecked
            className="w-5 h-5 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-amber-500"
          />
          <label className="text-sm text-slate-700">
            Currently accepting new clients
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
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
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
