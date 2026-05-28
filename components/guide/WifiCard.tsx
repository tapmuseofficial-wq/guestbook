'use client'

import { useState } from 'react'

type Props = { name: string; password: string }

export default function WifiCard({ name, password }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">WiFi</span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-stone-400 mb-0.5">Network</p>
          <p className="text-sm font-medium text-stone-800">{name}</p>
        </div>
        <div>
          <p className="text-xs text-stone-400 mb-0.5">Password</p>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-stone-800 font-mono tracking-wide">{password}</p>
            <button
              onClick={copy}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
