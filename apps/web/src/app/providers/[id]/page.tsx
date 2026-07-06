'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star, MapPin, Clock, CheckCircle, GraduationCap, Languages, ArrowLeft, CalendarPlus,
} from 'lucide-react';
import PaymentModal from '@/components/payment/PaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { getProvider, consultTimes, providerReviews } from '@/lib/data';
import { useToast } from "@/components/ui/toast";

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const provider = getProvider(params.id as string);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  if (!provider) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-ink">Provider not found</p>
        <button
          onClick={() => router.push('/providers')}
          className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Back to providers
        </button>
      </div>
    );
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    toast.success('Appointment booked — a confirmation has been sent');
    setShowPaymentModal(false);
    router.push('/appointments');
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/providers')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> All providers
      </button>

      {/* Provider header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-brand-500/15">
            <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-brand-700 shadow-sm">
              {provider.initials}
            </span>
            {provider.verified && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand-600 px-2 py-1 text-xs font-semibold text-white">
                <CheckCircle className="h-3 w-3" /> Verified
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{provider.name}</h1>
            <p className="mb-4 mt-1 text-slate-500">{provider.credentials}</p>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-brand-500/30 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
                {provider.specialty}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <Clock className="h-4 w-4" /> {provider.experience} years experience
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin className="h-4 w-4" /> {provider.location}
              </span>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-ink">{provider.rating}</span>
              <span className="text-slate-500">({provider.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Languages className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Languages:</span>
              <span className="text-ink">{provider.languages.join(', ')}</span>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center md:items-end md:text-right">
            <span className="text-sm text-slate-500">Consultation fee</span>
            <div className="text-3xl font-bold text-brand-600">GH₵ {provider.fee}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left — details */}
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-3 font-display text-xl font-bold text-ink">About</h2>
            <p className="leading-relaxed text-slate-600">{provider.bio}</p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Education & qualifications</h2>
            <div className="space-y-4">
              {provider.education.map((edu) => (
                <div key={edu.degree} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{edu.degree}</h3>
                    <p className="text-sm text-slate-500">{edu.institution}</p>
                    <p className="text-xs text-slate-400">{edu.year}</p>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                {provider.qualifications.map((q) => (
                  <span key={q} className="rounded-lg bg-mist px-3 py-1.5 text-sm text-slate-600">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Areas of expertise</h2>
            <div className="flex flex-wrap gap-3">
              {provider.expertise.map((item) => (
                <span key={item} className="rounded-lg bg-mist px-4 py-2 text-sm text-slate-600">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-bold text-ink">Patient reviews</h2>
            <div className="space-y-4">
              {providerReviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-ink">{review.patient}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{review.comment}</p>
                  <p className="mt-1 text-xs text-slate-400">{review.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right — booking */}
        <div>
          <div className="sticky top-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-5 font-display text-xl font-bold text-ink">Book appointment</h2>

            <label className="mb-2 block text-sm font-semibold text-slate-600">Select date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mb-4 w-full rounded-lg border border-slate-200 bg-canvas px-4 py-3 text-ink focus:border-transparent focus:ring-2 focus:ring-brand-500"
            />

            <label className="mb-2 block text-sm font-semibold text-slate-600">Select time</label>
            <div className="mb-6 grid grid-cols-2 gap-2">
              {consultTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-lg py-2 text-sm font-semibold transition ${
                    selectedTime === time
                      ? 'bg-brand-600 text-white'
                      : 'bg-mist text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarPlus className="h-4 w-4" />
              Book consultation — GH₵ {provider.fee}
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Secure payment · Your data is protected
            </p>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentType="consultation"
          amount={provider.fee}
          currency="GHS"
          userId={user?.id ?? 'demo-user'}
          userEmail={user?.email ?? 'demo@medicom.app'}
          metadata={{
            appointmentId: `APT-${Date.now()}`,
            doctorName: provider.name,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
