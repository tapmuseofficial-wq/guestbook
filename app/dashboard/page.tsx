import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import GuideCard from '@/components/dashboard/GuideCard'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: guides } = await supabase
    .from('guides')
    .select('id, title, slug, published, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Your Guidebooks</h1>
        <Link
          href="/dashboard/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          New guide
        </Link>
      </div>

      {guides && guides.length > 0 ? (
        <div className="space-y-3">
          {guides.map(guide => <GuideCard key={guide.id} guide={guide} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 text-sm">
          No guides yet.{' '}
          <Link href="/dashboard/new" className="text-blue-600 hover:underline">
            Create your first one.
          </Link>
        </div>
      )}
    </div>
  )
}
