'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateGuide, togglePublished, deleteGuide } from '@/lib/actions'
import type { Guide } from '@/lib/types'
import ShareCard from './ShareCard'

type Field = { key: keyof Guide; label: string; placeholder: string; rows?: number; proOnly?: boolean }

const FIELDS: Field[] = [
  { key: 'checkin_instructions',  label: 'Check-in instructions',  placeholder: 'Key is in the lockbox (code: 1234). Enter through the side gate…', rows: 4 },
  { key: 'checkout_checklist',    label: 'Checkout checklist',     placeholder: 'Strip the beds and leave towels in the bathtub. Lock the front door…', rows: 4 },
  { key: 'parking_instructions',  label: 'Parking',                placeholder: 'Park in spot #12 in the garage. Use the blue remote on the key ring…', rows: 3, proOnly: true },
  { key: 'trash_instructions',    label: 'Trash & recycling',      placeholder: 'Bins are on the left side of the house. Pickup is Tuesday morning…', rows: 3, proOnly: true },
  { key: 'emergency_contact',     label: 'Emergency contact',      placeholder: 'Jane (host): +1 555 123 4567\nBuilding manager: +1 555 987 6543', rows: 2, proOnly: true },
  { key: 'tv_entertainment',      label: 'TV & Entertainment',     placeholder: 'Smart TV — Netflix: guest@email.com / Pass: xxxxx\nHBO Max, Hulu, and Apple TV also logged in…', rows: 3, proOnly: true },
  { key: 'laundry',               label: 'Laundry',                placeholder: 'Washer/dryer in the hallway closet. Detergent on the shelf above…', rows: 3, proOnly: true },
  { key: 'amenities',             label: 'Amenities',              placeholder: 'Pool: open 8am–10pm, towels at the gate.\nGym: 24/7 access with key fob…', rows: 3, proOnly: true },
]

const INPUT = "w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"

function LockIcon() {
  return (
    <svg className="w-5 h-5 text-stone-400" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="9" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function GuideEditor({ guide, isPro }: { guide: Guide; isPro: boolean }) {
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
    tv_entertainment:      guide.tv_entertainment      ?? '',
    laundry:               guide.laundry               ?? '',
    amenities:             guide.amenities             ?? '',
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
        {FIELDS.map(({ key, label, placeholder, rows, proOnly }) => {
          const locked = proOnly && !isPro
          return (
            <section key={key} className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">{label}</h2>
                {locked && (
                  <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Pro
                  </span>
                )}
              </div>
              {locked ? (
                <div className="relative">
                  <textarea
                    value="Upgrade to Pro to unlock this section."
                    readOnly
                    rows={rows ?? 3}
                    className={`${INPUT} resize-none blur-[2px] pointer-events-none select-none text-stone-400`}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/70">
                    <LockIcon />
                    <Link
                      href="/dashboard/upgrade"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Upgrade to Pro to unlock →
                    </Link>
                  </div>
                </div>
              ) : (
                <textarea
                  value={fields[key as string] ?? ''}
                  onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                  rows={rows ?? 3}
                  placeholder={placeholder}
                  className={`${INPUT} resize-y`}
                />
              )}
            </section>
          )
        })}

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

      <ShareCard guideId={guide.id} title={title} published={published} isPro={isPro} />
    </div>
  )
}
