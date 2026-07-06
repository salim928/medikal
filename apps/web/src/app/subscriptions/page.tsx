'use client';

import { useState } from 'react';
import PaymentModal from '@/components/payment/PaymentModal';
import { subscriptionPlans as plans, type SubscriptionPlan } from '@/lib/data';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  email?: string;
}

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<{
    plan: SubscriptionPlan;
    billingCycle: 'monthly' | 'yearly';
    startDate: string;
    status: string;
  } | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({});

  const userId = user?.id ?? 'demo-user';
  const userEmail = user?.email ?? 'demo@medicom.app';

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      setCurrentSubscription({
        plan: selectedPlan,
        billingCycle,
        startDate: new Date().toISOString(),
        status: 'active',
      });
    }
    setShowPaymentModal(false);
    toast.success('Subscription activated');
  };

  const handleAddFamilyMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.dateOfBirth) {
      toast.error('Please fill all required fields');
      return;
    }

    const member: FamilyMember = {
      id: `member-${Date.now()}`,
      name: newMember.name,
      relationship: newMember.relationship,
      dateOfBirth: newMember.dateOfBirth,
      email: newMember.email,
    };

    setFamilyMembers([...familyMembers, member]);
    setNewMember({});
    setShowAddMember(false);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const calculateSavings = (plan: SubscriptionPlan) => {
    const yearlyTotal = plan.monthlyPrice * 12;
    const savings = yearlyTotal - plan.yearlyPrice;
    return savings;
  };

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-ink mb-4">
            Choose Your <span className="text-brand-600">Health Plan</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Access quality healthcare anytime, anywhere. Cancel anytime, no questions asked.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              billingCycle === 'monthly'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-mist'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-lg font-semibold transition relative ${
              billingCycle === 'yearly'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-mist'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs px-2 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>

        {/* Current Subscription */}
        {currentSubscription && (
          <div className="mb-8 bg-gradient-to-r from-brand-500/20 to-brand-500/20 border border-brand-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-ink mb-1">
                  Current Plan: {currentSubscription.plan.name}
                </h3>
                <p className="text-slate-600">
                  Billing: {currentSubscription.billingCycle} • Status: <span className="text-emerald-600 font-semibold">Active</span>
                </p>
              </div>
              <button className="px-4 py-2 bg-mist hover:bg-slate-200 text-ink rounded-lg font-semibold transition">
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = calculateSavings(plan);

            return (
              <div
                key={plan.id}
                className={`relative bg-white backdrop-blur-sm border rounded-2xl p-8 hover:scale-105 transition-transform ${
                  plan.popular ? 'border-brand-500 shadow-2xl shadow-brand-500/20' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-ink mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-brand-600 mb-2">
                    GH₵ {price}
                  </div>
                  <div className="text-slate-500 text-sm">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-emerald-600 text-xs mt-1 font-semibold">
                      Save GH₵ {savings} per year
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 rounded-lg font-semibold mb-6 transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600'
                      : 'bg-mist text-ink hover:bg-slate-200'
                  }`}
                >
                  {currentSubscription?.plan.id === plan.id ? 'Current Plan' : 'Subscribe Now'}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Family Members Management */}
        {currentSubscription && currentSubscription.plan.id !== 'individual' && (
          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-ink mb-1">Family Members</h2>
                <p className="text-slate-500">
                  {familyMembers.length} of {currentSubscription.plan.maxFamilyMembers} members added
                </p>
              </div>
              {familyMembers.length < (currentSubscription.plan.maxFamilyMembers ?? 0) && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition"
                >
                  + Add Member
                </button>
              )}
            </div>

            {/* Add Member Form */}
            {showAddMember && (
              <div className="bg-white/80 border border-slate-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-ink mb-4">Add Family Member</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={newMember.name || ''}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-ink placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <select
                    value={newMember.relationship || ''}
                    onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-ink focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="">Select Relationship *</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="date"
                    placeholder="Date of Birth *"
                    value={newMember.dateOfBirth || ''}
                    onChange={(e) => setNewMember({ ...newMember, dateOfBirth: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-ink focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={newMember.email || ''}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-ink placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddFamilyMember}
                    className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => {
                      setShowAddMember(false);
                      setNewMember({});
                    }}
                    className="px-6 py-2 bg-mist hover:bg-slate-200 text-ink rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Family Members List */}
            <div className="grid md:grid-cols-2 gap-4">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white/80 border border-slate-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-ink">{member.name}</h4>
                    <p className="text-sm text-slate-500 capitalize">{member.relationship}</p>
                    <p className="text-xs text-slate-500">
                      Born: {new Date(member.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFamilyMember(member.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {familyMembers.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No family members added yet
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 bg-mist backdrop-blur-sm border border-slate-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-ink mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-ink mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-500 text-sm">
                Yes! You can cancel your subscription at any time with no cancellation fees.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-500 text-sm">
                We accept Paystack (cards, mobile money, bank transfers), Stripe, and all major payment methods.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-slate-500 text-sm">
                Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentType="subscription"
          amount={billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice}
          currency="GHS"
          userId={userId}
          userEmail={userEmail}
          metadata={{
            planName: selectedPlan.name,
            planType: billingCycle,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
