import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import GuideCard from '@/components/dashboard/GuideCard'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: guides } = await supabase
    .from('guides')
    .select('id, title, slug, published, updated_at')
    .order('updated_at', { ascending: false })

  const count = guides?.length ?? 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Properties</h1>
          <p className="text-sm text-stone-400 mt-0.5 font-medium">
            {count} {count === 1 ? 'guide' : 'guides'}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New guide
        </Link>
      </div>

      {guides && guides.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} colorIndex={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-stone-700 mb-1">No guides yet</h3>
          <p className="text-sm text-stone-400 mb-6 max-w-xs">
            Create a digital guidebook for your first property.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Create your first guide
          </Link>
        </div>
      )}
    </div>
  )
}
