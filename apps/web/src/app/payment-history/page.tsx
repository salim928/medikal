'use client';

import { useState, useEffect } from 'react';
import { fromKobo } from '@/lib/paystack';

interface PaymentTransaction {
  id: string;
  reference: string;
  type: 'consultation' | 'subscription' | 'prescription';
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: 'paystack' | 'stripe' | 'mobile_money';
  date: string;
  metadata: {
    appointmentId?: string;
    doctorName?: string;
    planName?: string;
    prescriptionId?: string;
    pharmacyName?: string;
  };
}

export default function PaymentHistoryPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'consultation' | 'subscription' | 'prescription'>('all');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTransactions: PaymentTransaction[] = [
        {
          id: '1',
          reference: 'CONSULT-1234567890',
          type: 'consultation',
          amount: 150.00,
          currency: 'GHS',
          status: 'success',
          paymentMethod: 'paystack',
          date: '2024-01-15T10:30:00Z',
          metadata: {
            appointmentId: 'APT-001',
            doctorName: 'Dr. Sarah Johnson',
          },
        },
        {
          id: '2',
          reference: 'SUB-9876543210',
          type: 'subscription',
          amount: 299.00,
          currency: 'GHS',
          status: 'success',
          paymentMethod: 'mobile_money',
          date: '2024-01-10T14:20:00Z',
          metadata: {
            planName: 'Family Plan',
          },
        },
        {
          id: '3',
          reference: 'PRESC-5555666777',
          type: 'prescription',
          amount: 85.50,
          currency: 'GHS',
          status: 'success',
          paymentMethod: 'paystack',
          date: '2024-01-08T09:15:00Z',
          metadata: {
            prescriptionId: 'RX-123',
            pharmacyName: 'City Central Pharmacy',
          },
        },
        {
          id: '4',
          reference: 'CONSULT-1111222333',
          type: 'consultation',
          amount: 150.00,
          currency: 'GHS',
          status: 'pending',
          paymentMethod: 'stripe',
          date: '2024-01-05T16:45:00Z',
          metadata: {
            appointmentId: 'APT-002',
            doctorName: 'Dr. Michael Chen',
          },
        },
      ];

      setTransactions(mockTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (tx) => filter === 'all' || tx.type === filter
  );

  const totalSpent = transactions
    .filter((tx) => tx.status === 'success')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-brand-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-600 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return '👨‍⚕️';
      case 'subscription':
        return '📋';
      case 'prescription':
        return '💊';
      default:
        return '💳';
    }
  };

  const getPaymentMethodLogo = (method: string) => {
    switch (method) {
      case 'paystack':
        return 'PAY';
      case 'stripe':
        return '💳';
      case 'mobile_money':
        return 'MM';
      default:
        return '💰';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadReceipt = (transactionId: string) => {
    // Implement receipt download
    console.log('Downloading receipt for:', transactionId);
    alert('Receipt download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-700 via-blue-900 to-brand-600 flex items-center justify-center">
        <div className="text-ink text-xl">Loading payment history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 via-blue-900 to-brand-600 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink mb-2">Payment History</h1>
          <p className="text-slate-500">View all your transactions and download receipts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Total Spent</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-brand-600">
              GH₵ {totalSpent.toFixed(2)}
            </div>
          </div>

          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Total Transactions</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-ink">{transactions.length}</div>
          </div>

          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Success Rate</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {transactions.length > 0
                ? Math.round(
                    (transactions.filter((tx) => tx.status === 'success').length /
                      transactions.length) *
                      100
                  )
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-mist'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('consultation')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'consultation'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-mist'
            }`}
          >
            Consultations
          </button>
          <button
            onClick={() => setFilter('subscription')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'subscription'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-mist'
            }`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setFilter('prescription')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'prescription'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-mist'
            }`}
          >
            Prescriptions
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 bg-mist backdrop-blur-sm border border-slate-200 rounded-xl">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-slate-500 text-lg">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:border-brand-500/50 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getTypeIcon(transaction.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-ink capitalize">
                          {transaction.type}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-slate-500">
                        {transaction.metadata.doctorName && (
                          <p>Doctor: {transaction.metadata.doctorName}</p>
                        )}
                        {transaction.metadata.planName && (
                          <p>Plan: {transaction.metadata.planName}</p>
                        )}
                        {transaction.metadata.pharmacyName && (
                          <p>Pharmacy: {transaction.metadata.pharmacyName}</p>
                        )}
                        <p>Reference: {transaction.reference}</p>
                        <p>Date: {formatDate(transaction.date)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-600">
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mt-1">
                        {getPaymentMethodLogo(transaction.paymentMethod)} {transaction.paymentMethod}
                      </div>
                    </div>

                    {transaction.status === 'success' && (
                      <button
                        onClick={() => downloadReceipt(transaction.id)}
                        className="px-4 py-2 bg-mist hover:bg-slate-200 text-ink rounded-lg text-sm font-semibold transition flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
