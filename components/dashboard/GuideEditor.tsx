'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateGuide, togglePublished, deleteGuide } from '@/lib/actions'
import type { Guide } from '@/lib/types'
import ShareCard from './ShareCard'

type Field = {
  key: keyof Guide
  label: string
  placeholder: string
  rows?: number
  hint?: string
}

const FIELDS: Field[] = [
  { key: 'checkin_instructions',  label: 'Check-in instructions',  placeholder: 'Key is in the lockbox (code: 1234). Enter through the side gate…', rows: 4 },
  { key: 'checkout_checklist',    label: 'Checkout checklist',     placeholder: 'Strip the beds and leave towels in the bathtub. Lock the front door…', rows: 4 },
  { key: 'parking_instructions',  label: 'Parking',                placeholder: 'Park in spot #12 in the garage. Use the blue remote on the key ring…', rows: 3 },
  { key: 'trash_instructions',    label: 'Trash & recycling',      placeholder: 'Bins are on the left side of the house. Pickup is Tuesday morning…', rows: 3 },
  { key: 'emergency_contact',     label: 'Emergency contact',      placeholder: 'Jane (host): +1 555 123 4567\nBuilding manager: +1 555 987 6543', rows: 2 },
]

export default function GuideEditor({ guide }: { guide: Guide }) {
  const [title,         setTitle]         = useState(guide.title)
  const [slug,          setSlug]          = useState(guide.slug)
  const [published,     setPublished]     = useState(guide.published)
  const [wifiName,      setWifiName]      = useState(guide.wifi_name ?? '')
  const [wifiPassword,  setWifiPassword]  = useState(guide.wifi_password ?? '')
  const [fields, setFields] = useState<Record<string, string>>({
    checkin_instructions:  guide.checkin_instructions  ?? '',
    checkout_checklist:    guide.checkout_checklist    ?? '',
    parking_instructions:  guide.parking_instructions  ?? '',
    trash_instructions:    guide.trash_instructions    ?? '',
    emergency_contact:     guide.emergency_contact     ?? '',
  })
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    const fd = new FormData()
    fd.set('title',    title)
    fd.set('slug',     slug)
    fd.set('wifi_name',     wifiName)
    fd.set('wifi_password', wifiPassword)
    Object.entries(fields).forEach(([k, v]) => fd.set(k, v))
    const result = await updateGuide(guide.id, null, fd)
    if (result?.error) setError(result.error)
    else setSaved(true)
  }

  function handleTogglePublish() {
    startTransition(async () => {
      const next = !published
      const result = await togglePublished(guide.id, next)
      if (!result?.error) setPublished(next)
    })
  }

  async function handleDelete() {
    if (!confirm('Delete this guide? This cannot be undone.')) return
    await deleteGuide(guide.id)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Back</Link>
          <h1 className="text-xl font-semibold text-gray-900 truncate">{title}</h1>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
            published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {published ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {published && (
            <Link href={`/guide/${guide.id}`} target="_blank" className="text-sm text-blue-600 hover:underline">
              View →
            </Link>
          )}
          <button
            onClick={handleTogglePublish}
            disabled={isPending}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {published ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={handleDelete} className="text-sm text-red-400 hover:text-red-600">
            Delete
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Property */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Property</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Beach House"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* WiFi */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">WiFi</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Network name</label>
              <input
                value={wifiName}
                onChange={e => setWifiName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MyNetwork_5G"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                value={wifiPassword}
                onChange={e => setWifiPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="supersecret123"
              />
            </div>
          </div>
        </section>

        {/* Other fields */}
        {FIELDS.map(({ key, label, placeholder, rows }) => (
          <section key={key} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</h2>
            <textarea
              value={fields[key as string] ?? ''}
              onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
              rows={rows ?? 3}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </section>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {saved && <p className="text-sm text-green-600">Saved!</p>}
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>

      <ShareCard guideId={guide.id} title={title} published={published} />
    </div>
  )
}
