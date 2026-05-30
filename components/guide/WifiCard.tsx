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
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Wi-Fi</span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-stone-400 mb-1">Network</p>
            <p className="text-base font-semibold text-stone-900">{name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-400 mb-2">Password</p>
            <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
              <span className="text-sm font-mono font-medium text-stone-800 tracking-wider flex-1 select-all">
                {password}
              </span>
              <button
                onClick={copy}
                className={`shrink-0 min-w-[68px] text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500 text-white scale-95'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                }`}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
