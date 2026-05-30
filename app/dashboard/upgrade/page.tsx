'use client'

import { useState } from 'react'
import Link from 'next/link'

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-indigo-500 shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const FREE_FEATURES = [
  '1 property guide',
  'Wi-Fi info',
  'Check-in instructions',
  'Checkout checklist',
  'Public guest link',
]

const PRO_FEATURES = [
  'Unlimited properties',
  'All free features',
  'Parking instructions',
  'Trash & recycling info',
  'Emergency contact',
  'TV & Entertainment guide',
  'Laundry instructions',
  'Amenities listing',
  'QR code download (PNG)',
  'Printable welcome card (PDF)',
]

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url, error } = await res.json()
    if (error || !url) { setLoading(false); return }
    window.location.href = url
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
          ← Back
        </Link>
      </div>

      <div className="text-center mb-10">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Pricing</p>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Simple, honest pricing</h1>
        <p className="text-stone-400 mt-2 text-sm">Start free. Upgrade when you need more.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Free */}
        <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-6 space-y-5">
          <div>
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Free</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-stone-900">$0</span>
              <span className="text-stone-400 text-sm mb-1">/month</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-stone-700">
                <CheckIcon />{f}
              </li>
            ))}
          </ul>
          <div className="pt-1">
            <div className="w-full py-2.5 text-sm font-semibold border border-stone-200 rounded-xl text-center text-stone-400 cursor-default">
              Current plan
            </div>
          </div>
        </div>

        {/* Pro */}
        <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 space-y-5 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-bold text-indigo-200 bg-indigo-500/60 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Most popular
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-widest mb-2">Pro</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-white">$2.99</span>
              <span className="text-indigo-300 text-sm mb-1">/month</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-indigo-100">
                <svg className="w-4 h-4 text-indigo-300 shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="pt-1">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-60"
            >
              {loading ? 'Redirecting…' : 'Upgrade to Pro →'}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-stone-400 mt-6">
        Cancel anytime. Payments processed securely by Stripe.
      </p>
    </div>
  )
}
