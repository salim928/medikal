'use client';

import { useState } from 'react';
import { transactions, type TransactionType } from '@/lib/data';
import { Wallet, BarChart3, CheckCircle2, Stethoscope, ClipboardList, Pill, CreditCard, Inbox, Download } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function PaymentHistoryPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const filteredTransactions = transactions.filter(
    (tx) => filter === 'all' || tx.type === filter
  );

  const totalSpent = transactions
    .filter((tx) => tx.status === 'success')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="h-8 w-8 text-brand-600" />;
      case 'subscription':
        return <ClipboardList className="h-8 w-8 text-brand-600" />;
      case 'prescription':
        return <Pill className="h-8 w-8 text-brand-600" />;
      default:
        return <CreditCard className="h-8 w-8 text-brand-600" />;
    }
  };

  const paymentMethodLabel = (method: string) => {
    switch (method) {
      case 'paystack':
        return 'Paystack';
      case 'stripe':
        return 'Card (Stripe)';
      case 'mobile_money':
        return 'Mobile Money';
      default:
        return method;
    }
  };

  const downloadReceipt = (reference: string) => {
    toast.info(`Receipt ${reference} will be emailed to you (demo)`);
  };

  return (
    <div className="py-4">
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
              <Wallet className="h-6 w-6 text-brand-600" />
            </div>
            <div className="text-3xl font-bold text-brand-600">
              GH₵ {totalSpent.toFixed(2)}
            </div>
          </div>

          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Total Transactions</span>
              <BarChart3 className="h-6 w-6 text-brand-600" />
            </div>
            <div className="text-3xl font-bold text-ink">{transactions.length}</div>
          </div>

          <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Success Rate</span>
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-600">
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
              <Inbox className="mx-auto mb-4 h-14 w-14 text-slate-300" />
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">{getTypeIcon(transaction.type)}</div>
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
                        <p>{transaction.description}</p>
                        <p>Reference: {transaction.reference}</p>
                        <p>Date: {transaction.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-600">
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mt-1">
                        {paymentMethodLabel(transaction.paymentMethod)}
                      </div>
                    </div>

                    {transaction.status === 'success' && (
                      <button
                        onClick={() => downloadReceipt(transaction.reference)}
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
