'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateGuide, togglePublished, deleteGuide } from '@/lib/actions'
import type { Guide } from '@/lib/types'
import ShareCard from './ShareCard'

type Field = { key: keyof Guide; label: string; placeholder: string; rows?: number }

const FIELDS: Field[] = [
  { key: 'checkin_instructions',  label: 'Check-in instructions',  placeholder: 'Key is in the lockbox (code: 1234). Enter through the side gate…', rows: 4 },
  { key: 'checkout_checklist',    label: 'Checkout checklist',     placeholder: 'Strip the beds and leave towels in the bathtub. Lock the front door…', rows: 4 },
  { key: 'parking_instructions',  label: 'Parking',                placeholder: 'Park in spot #12 in the garage. Use the blue remote on the key ring…', rows: 3 },
  { key: 'trash_instructions',    label: 'Trash & recycling',      placeholder: 'Bins are on the left side of the house. Pickup is Tuesday morning…', rows: 3 },
  { key: 'emergency_contact',     label: 'Emergency contact',      placeholder: 'Jane (host): +1 555 123 4567\nBuilding manager: +1 555 987 6543', rows: 2 },
]

const INPUT = "w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"

export default function GuideEditor({ guide }: { guide: Guide }) {
  const [title,        setTitle]        = useState(guide.title)
  const [slug,         setSlug]         = useState(guide.slug)
  const [published,    setPublished]    = useState(guide.published)
  const [wifiName,     setWifiName]     = useState(guide.wifi_name     ?? '')
  const [wifiPassword, setWifiPassword] = useState(guide.wifi_password ?? '')
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
    fd.set('title',         title)
    fd.set('slug',          slug)
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
    <div className="max-w-2xl space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-700 transition-colors shrink-0">
            ← Back
          </Link>
          <h1 className="text-lg font-semibold text-stone-900 truncate">{title}</h1>
          <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
            published ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
          }`}>
            {published ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {published && (
            <Link href={`/guide/${guide.id}`} target="_blank"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              View →
            </Link>
          )}
          <button
            onClick={handleTogglePublish}
            disabled={isPending}
            className="text-sm px-3.5 py-1.5 border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-50 transition-colors font-medium text-stone-600"
          >
            {published ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={handleDelete} className="text-sm text-stone-400 hover:text-red-500 transition-colors font-medium">
            Delete
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        {/* Property */}
        <section className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5 space-y-4">
          <h2 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Property</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Name</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required className={INPUT} placeholder="Beach House" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Slug</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} required className={INPUT} />
            </div>
          </div>
        </section>

        {/* WiFi */}
        <section className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5 space-y-4">
          <h2 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Wi-Fi</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Network name</label>
              <input value={wifiName} onChange={e => setWifiName(e.target.value)} className={INPUT} placeholder="MyNetwork_5G" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Password</label>
              <input value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} className={INPUT} placeholder="supersecret123" />
            </div>
          </div>
        </section>

        {/* Content fields */}
        {FIELDS.map(({ key, label, placeholder, rows }) => (
          <section key={key} className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5 space-y-3">
            <h2 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">{label}</h2>
            <textarea
              value={fields[key as string] ?? ''}
              onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
              rows={rows ?? 3}
              placeholder={placeholder}
              className={`${INPUT} resize-y`}
            />
          </section>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-5">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {saved && <p className="text-sm text-emerald-600 font-medium">Saved ✓</p>}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
          >
            Save changes
          </button>
        </div>
      </form>

      <ShareCard guideId={guide.id} title={title} published={published} />
    </div>
  )
}
