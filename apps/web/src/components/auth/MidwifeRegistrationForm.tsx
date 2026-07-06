"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-fresh";
import { Baby } from "lucide-react";

const midwifeSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  certifications: z.string().optional(),
  yearsOfExperience: z.number().min(0).optional(),
  availableForHomeBirth: z.boolean().default(false),
  prenatalCareServices: z.boolean().default(true),
  postnatalCareServices: z.boolean().default(true),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type MidwifeFormData = z.infer<typeof midwifeSchema>;

export function MidwifeRegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MidwifeFormData>({
    resolver: zodResolver(midwifeSchema),
  });

  const onSubmit = async (data: MidwifeFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Parse certifications as comma-separated array
      const certificationsArray = data.certifications
        ? data.certifications.split(",").map((cert) => cert.trim())
        : [];

      const metadata = {
        full_name: data.fullName,
        phone: data.phone,
        license_number: data.licenseNumber,
        certifications: certificationsArray,
        years_of_experience: data.yearsOfExperience || 0,
        available_for_home_birth: data.availableForHomeBirth,
        prenatal_care_services: data.prenatalCareServices,
        postnatal_care_services: data.postnatalCareServices,
      };

      const result = await signUp(data.email, data.password, "midwife", data.fullName, metadata);
      
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

      // Success! Redirect to midwife dashboard
      router.push("/dashboard/midwife");
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Baby className="w-8 h-8 text-slate-900" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Midwife Registration</h2>
        <p className="text-slate-500">Supporting mothers and families</p>
      </div>

      {/* Verification Notice */}
      <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
        <p className="text-brand-300 text-sm">
          <strong>Note:</strong> Your account will be pending verification. Our team will review your
          license and certifications before granting full access.
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="Sarah Johnson, CNM"
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="sarah@birthcenter.com"
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="CNM-123456"
            />
            {errors.licenseNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.licenseNumber.message}</p>
            )}
          </div>
        </div>

        {/* Row 3: Certifications and Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Certifications (Optional)
            </label>
            <input
              type="text"
              {...register("certifications")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="CNM, CPM (comma-separated)"
            />
            <p className="mt-1 text-xs text-slate-500">Separate multiple certifications with commas</p>
            {errors.certifications && (
              <p className="mt-1 text-sm text-red-400">{errors.certifications.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Years of Experience (Optional)
            </label>
            <input
              type="number"
              {...register("yearsOfExperience", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="5"
              min="0"
            />
            {errors.yearsOfExperience && (
              <p className="mt-1 text-sm text-red-400">{errors.yearsOfExperience.message}</p>
            )}
          </div>
        </div>

        {/* Services Offered */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Services Offered</p>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register("prenatalCareServices")}
              defaultChecked
              className="w-5 h-5 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label className="text-sm text-slate-700">
              Prenatal care services
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register("postnatalCareServices")}
              defaultChecked
              className="w-5 h-5 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label className="text-sm text-slate-700">
              Postnatal care services
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register("availableForHomeBirth")}
              className="w-5 h-5 bg-slate-700 border border-slate-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label className="text-sm text-slate-700">
              Available for home birth assistance
            </label>
          </div>
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
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
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-slate-900 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
