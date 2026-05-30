import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getUserPlan } from '@/lib/subscription'
import GuideEditor from '@/components/dashboard/GuideEditor'

export default async function EditGuidePage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const [{ data: guide }, plan] = await Promise.all([
    supabase.from('guides').select('*').eq('id', params.id).single(),
    getUserPlan(),
  ])

  if (!guide) notFound()

  return <GuideEditor guide={guide} isPro={plan === 'pro'} />
}
