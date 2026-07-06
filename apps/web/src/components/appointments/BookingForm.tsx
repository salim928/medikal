"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookAppointmentSchema, type BookAppointmentInput } from "@/lib/validation";
import { useAppointments } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface BookingFormProps {
  providerId: string;
  providerName: string;
  onSuccess?: () => void;
}

export function BookingForm({ providerId, providerName, onSuccess }: BookingFormProps) {
  const [generalError, setGeneralError] = useState("");
  const { createAppointment, isCreating } = useAppointments();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookAppointmentInput>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      providerId,
    },
  });

  function onSubmit(data: BookAppointmentInput) {
    setGeneralError("");
    createAppointment(data, {
      onSuccess: () => {
        alert("Appointment booked successfully!");
        onSuccess?.();
      },
      onError: (error) => {
        setGeneralError(
          error instanceof Error ? error.message : "Failed to book appointment"
        );
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Book with Dr. {providerName}</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {generalError}
            </div>
          )}

          <Input
            {...register("scheduledAt")}
            label="Preferred Date & Time"
            type="datetime-local"
            error={errors.scheduledAt?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit
            </label>
            <textarea
              {...register("reasonForVisit")}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe your symptoms or reason for visit..."
            />
            {errors.reasonForVisit && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reasonForVisit.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              {...register("reasonCategory")}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type...</option>
              <option value="follow_up">Follow-up</option>
              <option value="acute">Acute Condition</option>
              <option value="preventive">Preventive Care</option>
              <option value="urgent">Urgent</option>
            </select>
            {errors.reasonCategory && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reasonCategory.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}