import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import GuideEditor from '@/components/dashboard/GuideEditor'

export default async function EditGuidePage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: guide } = await supabase
    .from('guides')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!guide) notFound()

  return <GuideEditor guide={guide} />
}
