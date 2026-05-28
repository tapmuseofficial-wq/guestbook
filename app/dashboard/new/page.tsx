'use client'

import { useFormState } from 'react-dom'
import { createGuide } from '@/lib/actions'
import Link from 'next/link'

export default function NewGuidePage() {
  const [state, action] = useFormState(createGuide, null)

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Back</Link>
        <h1 className="text-xl font-semibold text-gray-900">New Guidebook</h1>
      </div>

      <form action={action} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Beach House Guide"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug{' '}
            <span className="text-gray-400 font-normal">(optional — auto-generated from title)</span>
          </label>
          <input
            name="slug"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="beach-house-guide"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create guide
        </button>
      </form>
    </div>
  )
}
