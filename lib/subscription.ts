import { createServerSupabaseClient } from './supabase-server'

export async function getUserPlan(): Promise<'free' | 'pro'> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'free'

  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  if (data?.plan === 'pro' && data?.status === 'active') return 'pro'
  return 'free'
}
