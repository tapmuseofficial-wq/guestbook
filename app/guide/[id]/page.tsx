import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import WifiCard from '@/components/guide/WifiCard'
import type { ReactNode } from 'react'

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function KeyIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5"/>
      <path d="M21 2l-9.6 9.6"/>
      <path d="M15.5 7.5l3 3L22 7l-3-3"/>
    </svg>
  )
}

function ChecklistIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

function CarIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v6h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────

type SectionConfig = {
  icon: ReactNode
  label: string
  color: string
  iconBg: string
}

const SECTION_CONFIG: SectionConfig & { key: string } extends never ? never : Record<string, SectionConfig> = {
  checkin_instructions: {
    icon:    <KeyIcon />,
    label:   'Check-in',
    color:   'text-amber-500',
    iconBg:  'bg-amber-50',
  },
  checkout_checklist: {
    icon:    <ChecklistIcon />,
    label:   'Checkout',
    color:   'text-violet-500',
    iconBg:  'bg-violet-50',
  },
  parking_instructions: {
    icon:    <CarIcon />,
    label:   'Parking',
    color:   'text-sky-500',
    iconBg:  'bg-sky-50',
  },
  trash_instructions: {
    icon:    <TrashIcon />,
    label:   'Trash & recycling',
    color:   'text-teal-500',
    iconBg:  'bg-teal-50',
  },
  emergency_contact: {
    icon:    <PhoneIcon />,
    label:   'Emergency contact',
    color:   'text-rose-500',
    iconBg:  'bg-rose-50',
  },
}

function Section({ label, icon, iconBg, color, children }: SectionConfig & { children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${iconBg} ${color} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{children}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function GuestGuidePage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: guide } = await supabase
    .from('guides')
    .select('title, wifi_name, wifi_password, checkin_instructions, checkout_checklist, parking_instructions, trash_instructions, emergency_contact')
    .eq('id', params.id)
    .eq('published', true)
    .single()

  if (!guide) notFound()

  const sections = [
    'checkin_instructions',
    'checkout_checklist',
    'parking_instructions',
    'trash_instructions',
    'emergency_contact',
  ] as const

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-md mx-auto px-4 py-10 space-y-4">

        {/* Header */}
        <div className="pb-2">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Your guidebook</p>
          <h1 className="text-3xl font-bold text-stone-900 leading-tight">{guide.title}</h1>
        </div>

        {/* WiFi */}
        {guide.wifi_name && guide.wifi_password && (
          <WifiCard name={guide.wifi_name} password={guide.wifi_password} />
        )}
        {guide.wifi_name && !guide.wifi_password && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
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
            <p className="text-sm font-medium text-stone-800">{guide.wifi_name}</p>
          </div>
        )}

        {/* Other sections — only render non-empty ones */}
        {sections.map(key => {
          const value = guide[key]
          if (!value) return null
          const config = SECTION_CONFIG[key]
          return (
            <Section key={key} {...config}>
              {value}
            </Section>
          )
        })}

        <p className="text-center text-xs text-stone-300 pt-6">Made with Guestbook</p>
      </div>
    </div>
  )
}
