'use client'

import { useFormState } from 'react-dom'
import { createGuide } from '@/lib/actions'
import Link from 'next/link'

export default function NewGuidePage() {
  const [state, action] = useFormState(createGuide, null)

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3 mb-7">
        <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
          ← Back
        </Link>
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">New guidebook</h1>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
            Property name
          </label>
          <input
            name="title"
            required
            autoFocus
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            placeholder="e.g. Beach House"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
            URL slug{' '}
            <span className="text-stone-300 font-normal normal-case tracking-normal">
              — auto-generated if empty
            </span>
          </label>
          <input
            name="slug"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            placeholder="beach-house"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
        >
          Create guide
        </button>
      </form>
    </div>
  )
}
