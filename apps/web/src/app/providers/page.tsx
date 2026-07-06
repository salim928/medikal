'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Users, Star, MapPin, Clock, CheckCircle, Search } from 'lucide-react';
import { providers } from '@/lib/data';

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'experience'>('rating');

  const specialties = useMemo(
    () => Array.from(new Set(providers.map((p) => p.specialty))),
    []
  );
  const locations = ['Accra', 'Kumasi', 'Cape Coast', 'Tamale'];

  const filteredProviders = useMemo(
    () =>
      providers
        .filter((provider) => {
          const matchesSearch =
            provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesSpecialty =
            selectedSpecialty === 'all' || provider.specialty === selectedSpecialty;
          const matchesLocation =
            selectedLocation === 'all' ||
            provider.location.toLowerCase().includes(selectedLocation.toLowerCase());
          return matchesSearch && matchesSpecialty && matchesLocation;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'fee':
              return a.fee - b.fee;
            case 'experience':
              return b.experience - a.experience;
            default:
              return 0;
          }
        }),
    [searchQuery, selectedSpecialty, selectedLocation, sortBy]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-brand-600" />
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Find your healthcare provider</h1>
            <p className="mt-1 text-slate-600">Connect with verified doctors and therapists.</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name or specialty…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-canvas px-4 py-3 text-ink placeholder-slate-400 focus:border-transparent focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="rounded-lg border border-slate-200 bg-canvas px-4 py-3 text-ink focus:border-transparent focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-lg border border-slate-200 bg-canvas px-4 py-3 text-ink focus:border-transparent focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-slate-500">Sort by:</span>
          <div className="flex gap-2">
            {([
              { id: 'rating', label: 'Rating' },
              { id: 'fee', label: 'Fee (low to high)' },
              { id: 'experience', label: 'Experience' },
            ] as const).map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  sortBy === s.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-mist text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-slate-600">
        Found <span className="font-semibold text-brand-600">{filteredProviders.length}</span> providers
      </p>

      {/* Providers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.map((provider) => (
          <Link
            key={provider.id}
            href={`/providers/${provider.id}`}
            className="group block overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-brand-500/50 hover:shadow-card"
          >
            {/* Provider Image */}
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-brand-500/10 to-brand-500/10">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-brand-700 shadow-sm">
                {provider.initials}
              </span>
              {provider.verified && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-green-500/30 bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="p-6">
              <h3 className="mb-1 text-xl font-bold text-ink transition group-hover:text-brand-600">
                {provider.name}
              </h3>
              <p className="mb-3 text-sm text-slate-500">{provider.credentials}</p>

              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                  {provider.specialty}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(provider.rating)
                          ? 'fill-yellow-400 text-amber-600'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  {provider.rating} ({provider.reviews} reviews)
                </span>
              </div>

              <div className="mb-4 space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{provider.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-green-600">{provider.availability}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <div>
                  <span className="text-sm text-slate-500">Consultation fee</span>
                  <div className="text-xl font-bold text-brand-600">GH₵ {provider.fee}</div>
                </div>
                <span className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-brand-700">
                  View profile
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white py-12 text-center">
          <Search className="mx-auto mb-4 h-16 w-16 text-slate-300" />
          <p className="text-lg text-slate-500">No providers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
