"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface SymptomAnalysis {
  symptoms: string[];
  possibleConditions: Array<{
    name: string;
    probability: string;
    description: string;
  }>;
  recommendedActions: string[];
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Emergency';
  recommendedSpecialist?: string;
}

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock AI analysis (would be replaced with OpenAI API call)
  const analyzeSymptoms = () => {
    setIsAnalyzing(true);
    
    // Simulate AI API call
    setTimeout(() => {
      const mockAnalysis: SymptomAnalysis = {
        symptoms: symptoms.split(',').map(s => s.trim()),
        possibleConditions: [
          {
            name: 'Common Cold',
            probability: '65%',
            description: 'A viral infection affecting the upper respiratory tract'
          },
          {
            name: 'Seasonal Allergies',
            probability: '25%',
            description: 'Allergic reaction to environmental triggers like pollen'
          },
          {
            name: 'Sinusitis',
            probability: '10%',
            description: 'Inflammation of the sinuses often following a cold'
          }
        ],
        recommendedActions: [
          'Get adequate rest (7-8 hours)',
          'Stay hydrated - drink plenty of fluids',
          'Use over-the-counter pain relievers if needed',
          'Monitor your temperature',
          'If symptoms worsen or persist beyond 7 days, consult a doctor'
        ],
        urgencyLevel: 'Low',
        recommendedSpecialist: 'General Practitioner'
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      analyzeSymptoms();
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-brand-500/20 text-green-400 border-green-500/50';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'High':
        return 'bg-brand-500/20 text-orange-400 border-orange-500/50';
      case 'Emergency':
        return 'bg-red-500/20 text-red-600 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink mb-2">AI Symptom Checker</h1>
          <p className="text-slate-500">Get preliminary health insights powered by AI</p>
        </div>

        {/* Medical Disclaimer */}
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ <strong>Medical Disclaimer:</strong> This AI tool provides preliminary information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
          </p>
        </div>

        {/* Symptom Input Form */}
        <form onSubmit={handleSubmit} className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-ink font-semibold mb-2">
                What symptoms are you experiencing?
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., headache, fever, cough, sore throat"
                rows={4}
                className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500/50"
                required
              />
              <p className="text-slate-500 text-sm mt-2">
                Describe your symptoms in detail. Separate multiple symptoms with commas.
              </p>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-2">
                How long have you had these symptoms?
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 3 days, 1 week"
                className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-ink font-semibold mb-2">
                Severity Level
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSeverity('mild')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    severity === 'mild'
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white'
                      : 'bg-white/80 border border-slate-200 text-slate-500 hover:border-brand-500/50'
                  }`}
                >
                  Mild
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('moderate')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    severity === 'moderate'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-ink'
                      : 'bg-white/80 border border-slate-200 text-slate-500 hover:border-brand-500/50'
                  }`}
                >
                  Moderate
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('severe')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    severity === 'severe'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      : 'bg-white/80 border border-slate-200 text-slate-500 hover:border-brand-500/50'
                  }`}
                >
                  Severe
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !symptoms.trim() || !duration.trim()}
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:from-brand-600 disabled:to-brand-500 text-white font-semibold rounded-lg transition text-lg"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </div>
        </form>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Urgency Level */}
            <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ink">Urgency Assessment</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getUrgencyColor(analysis.urgencyLevel)}`}>
                  {analysis.urgencyLevel} Priority
                </span>
              </div>
              
              {analysis.urgencyLevel === 'Emergency' && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-600 font-semibold">
                    🚨 Seek immediate medical attention or call emergency services!
                  </p>
                </div>
              )}
            </div>

            {/* Possible Conditions */}
            <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-ink mb-4">Possible Conditions</h3>
              <div className="space-y-4">
                {analysis.possibleConditions.map((condition, index) => (
                  <div key={index} className="p-4 bg-white/80 rounded-lg border border-brand-500/10">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-ink">{condition.name}</h4>
                      <span className="px-3 py-1 bg-brand-50 text-brand-600 text-sm rounded-full">
                        {condition.probability}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{condition.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-ink mb-4">Recommended Actions</h3>
              <ul className="space-y-3">
                {analysis.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-brand-600 mt-1">•</span>
                    <span className="text-slate-600">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialist Recommendation */}
            {analysis.recommendedSpecialist && (
              <div className="bg-brand-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-brand-600 mb-3">
                  Recommended Specialist: {analysis.recommendedSpecialist}
                </h3>
                <div className="flex gap-3">
                  <Link
                    href="/appointments"
                    className="flex-1 text-center bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 px-6 py-3 rounded-lg font-semibold text-white transition"
                  >
                    Book Appointment
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 border border-slate-200 hover:border-brand-500 text-brand-600 rounded-lg font-semibold transition"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
