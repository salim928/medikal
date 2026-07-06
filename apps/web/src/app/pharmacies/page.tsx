"use client";

import React, { useState } from 'react';
import { pharmacies } from '@/lib/data';
import { useToast } from '@/components/ui/toast';

export default function PharmaciesPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = ['all', ...Array.from(new Set(pharmacies.map(p => p.city)))];

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || pharmacy.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink mb-2">Licensed Pharmacies</h1>
          <p className="text-slate-500">Find verified pharmacies near you</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search pharmacies by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500/50"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500/50"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city === 'all' ? 'All Cities' : city}
              </option>
            ))}
          </select>
        </div>

        {/* Pharmacies Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPharmacies.map((pharmacy) => (
            <div 
              key={pharmacy.id}
              className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-brand-500/50 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-ink mb-1">
                    {pharmacy.name}
                  </h3>
                  {pharmacy.licensed && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ FDA Licensed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-ink font-semibold">{pharmacy.rating}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-brand-600 text-sm">📍</span>
                  <span className="text-slate-600 text-sm">{pharmacy.address}, {pharmacy.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-600 text-sm">📞</span>
                  <span className="text-slate-600 text-sm">{pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-600 text-sm">🕒</span>
                  <span className="text-slate-600 text-sm">{pharmacy.openHours}</span>
                </div>
                {pharmacy.distance && (
                  <div className="flex items-center gap-2">
                    <span className="text-brand-600 text-sm">📏</span>
                    <span className="text-slate-600 text-sm">{pharmacy.distance} away</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-slate-500 text-sm mb-2">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {pharmacy.services.map((service, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-brand-50 border border-slate-200 text-brand-600 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toast.success(`Prescription order sent to ${pharmacy.name} — they will confirm shortly`)}
                  className="flex-1 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 px-4 py-2 rounded-lg font-semibold text-white transition"
                >
                  Order Prescription
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pharmacy.name}, ${pharmacy.address}, ${pharmacy.city}, Ghana`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-200 hover:border-brand-500 text-brand-600 rounded-lg font-semibold transition"
                >
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredPharmacies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No pharmacies found matching your search</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-brand-50 border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-600 mb-2">All Listed Pharmacies are FDA Verified</h3>
          <p className="text-slate-600 text-sm">
            Every pharmacy in our network is licensed by the Ghana Food and Drugs Authority (FDA). 
            You can verify any medication purchased through our drug authentication feature.
          </p>
        </div>
      </div>
    </div>
  );
}
