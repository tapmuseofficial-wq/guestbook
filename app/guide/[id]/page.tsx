import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import WifiCard from '@/components/guide/WifiCard'
import type { ReactNode } from 'react'

// ── Icons ────────────────────────────────────────────────────────────────────

function KeyIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5"/>
      <path d="M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>
    </svg>
  )
}

function ChecklistIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

function CarIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v6h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

// ── Section card ─────────────────────────────────────────────────────────────

type SectionMeta = { icon: ReactNode; label: string; color: string; bg: string }

const SECTIONS: Record<string, SectionMeta> = {
  checkin_instructions: { icon: <KeyIcon />,       label: 'Check-in',          color: 'text-amber-600',  bg: 'bg-amber-50'  },
  checkout_checklist:   { icon: <ChecklistIcon />, label: 'Checkout',          color: 'text-violet-600', bg: 'bg-violet-50' },
  parking_instructions: { icon: <CarIcon />,       label: 'Parking',           color: 'text-sky-600',    bg: 'bg-sky-50'    },
  trash_instructions:   { icon: <TrashIcon />,     label: 'Trash & recycling', color: 'text-teal-600',   bg: 'bg-teal-50'   },
  emergency_contact:    { icon: <PhoneIcon />,     label: 'Emergency contact', color: 'text-rose-600',   bg: 'bg-rose-50'   },
}

function Section({ icon, label, color, bg, children }: SectionMeta & { children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{children}</p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function GuestGuidePage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: guide } = await supabase
    .from('guides')
    .select('title, wifi_name, wifi_password, checkin_instructions, checkout_checklist, parking_instructions, trash_instructions, emergency_contact')
    .eq('id', params.id)
    .eq('published', true)
    .single()

  if (!guide) notFound()

  const ORDER = ['checkin_instructions', 'checkout_checklist', 'parking_instructions', 'trash_instructions', 'emergency_contact'] as const

  return (
    <div className="min-h-screen bg-[#F9F8F6]">

      {/* Hero */}
      <div className="bg-white border-b border-stone-200/60">
        <div className="max-w-lg mx-auto px-5 pt-9 pb-10">
          {/* Mini brand */}
          <div className="flex items-center gap-1.5 mb-8 opacity-60">
            <div className="w-4 h-4 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 20 20" fill="none">
                <path d="M10 4C8.5 3 6 3 4 4v11c2-1 4.5-1 6 0V4z" fill="white" fillOpacity=".95"/>
                <path d="M10 4c1.5-1 4-1 6 0v11c-2-1-4.5-1-6 0V4z" fill="white" fillOpacity=".6"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-stone-500 tracking-wide">Guestbook</span>
          </div>

          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Your guide</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-[1.1] text-balance">
            {guide.title}
          </h1>
          <div className="w-10 h-[3px] bg-indigo-500 rounded-full mt-5" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-3">

        {/* WiFi */}
        {guide.wifi_name && guide.wifi_password && (
          <WifiCard name={guide.wifi_name} password={guide.wifi_password} />
        )}
        {guide.wifi_name && !guide.wifi_password && (
          <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <WifiIcon />
              </div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Wi-Fi</span>
            </div>
            <p className="text-base font-semibold text-stone-900">{guide.wifi_name}</p>
          </div>
        )}

        {/* Sections */}
        {ORDER.map(key => {
          const value = guide[key]
          if (!value) return null
          return <Section key={key} {...SECTIONS[key]}>{value}</Section>
        })}
      </div>

      {/* Footer */}
      <div className="pb-10 pt-2 text-center">
        <span className="inline-flex items-center gap-1.5 text-stone-300">
          <span className="w-3 h-3 rounded-sm bg-stone-300 inline-flex items-center justify-center">
            <svg width="6" height="6" viewBox="0 0 20 20" fill="none">
              <path d="M10 4C8.5 3 6 3 4 4v11c2-1 4.5-1 6 0V4z" fill="white"/>
              <path d="M10 4c1.5-1 4-1 6 0v11c-2-1-4.5-1-6 0V4z" fill="white" fillOpacity=".6"/>
            </svg>
          </span>
          <span className="text-xs">Made with Guestbook</span>
        </span>
      </div>
    </div>
  )
}
