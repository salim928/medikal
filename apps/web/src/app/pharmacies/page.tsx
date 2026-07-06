"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  licensed: boolean;
  openHours: string;
  services: string[];
  distance?: string;
}

export default function PharmaciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  
  const pharmacies: Pharmacy[] = [
    {
      id: '1',
      name: 'City Central Pharmacy',
      address: '123 Independence Avenue',
      city: 'Accra',
      phone: '+233 20 123 4567',
      rating: 4.8,
      licensed: true,
      openHours: '8:00 AM - 10:00 PM',
      services: ['Prescription Fulfillment', 'Drug Verification', 'Home Delivery'],
      distance: '2.3 km'
    },
    {
      id: '2',
      name: 'MediCare Plus Pharmacy',
      address: '45 Ring Road East',
      city: 'Accra',
      phone: '+233 24 987 6543',
      rating: 4.6,
      licensed: true,
      openHours: '7:00 AM - 9:00 PM',
      services: ['Prescription Fulfillment', 'Drug Verification', 'Health Consultation'],
      distance: '3.8 km'
    },
    {
      id: '3',
      name: 'Kumasi Health Pharmacy',
      address: '78 Adum Street',
      city: 'Kumasi',
      phone: '+233 32 555 1234',
      rating: 4.7,
      licensed: true,
      openHours: '8:00 AM - 8:00 PM',
      services: ['Prescription Fulfillment', 'Drug Verification', 'Home Delivery', 'Medical Supplies'],
      distance: '1.5 km'
    },
    {
      id: '4',
      name: 'Cape Coast Medical Supplies',
      address: '12 London Street',
      city: 'Cape Coast',
      phone: '+233 33 222 8899',
      rating: 4.5,
      licensed: true,
      openHours: '8:30 AM - 7:00 PM',
      services: ['Prescription Fulfillment', 'Drug Verification'],
      distance: '800 m'
    }
  ];

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
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-500/20 text-green-400 border border-green-500/30">
                      ✓ FDA Licensed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
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
                <button className="flex-1 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 px-4 py-2 rounded-lg font-semibold text-white transition">
                  Order Prescription
                </button>
                <button className="px-4 py-2 border border-slate-200 hover:border-brand-500 text-brand-600 rounded-lg font-semibold transition">
                  Get Directions
                </button>
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
