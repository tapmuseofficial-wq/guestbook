'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from './supabase-server'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createGuide(_: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Free plan: max 1 guide
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()
  const isPro = sub?.plan === 'pro' && sub?.status === 'active'

  if (!isPro) {
    const { count } = await supabase
      .from('guides')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if ((count ?? 0) >= 1) {
      return { error: 'Free plan is limited to 1 property. Upgrade to Pro for unlimited guides.' }
    }
  }

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string).trim() || slugify(title)

  const { data, error } = await supabase
    .from('guides')
    .insert({ user_id: user.id, title, slug })
    .select('id')
    .single()

  if (error) return { error: error.message }
  redirect(`/dashboard/${data.id}`)
}

export async function updateGuide(id: string, _: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const str = (key: string) => (formData.get(key) as string)?.trim() || null

  const { error } = await supabase
    .from('guides')
    .update({
      title: (formData.get('title') as string).trim(),
      slug: (formData.get('slug') as string).trim(),
      wifi_name:             str('wifi_name'),
      wifi_password:         str('wifi_password'),
      checkin_instructions:  str('checkin_instructions'),
      checkout_checklist:    str('checkout_checklist'),
      parking_instructions:  str('parking_instructions'),
      trash_instructions:    str('trash_instructions'),
      emergency_contact:     str('emergency_contact'),
      tv_entertainment:      str('tv_entertainment'),
      laundry:               str('laundry'),
      amenities:             str('amenities'),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath(`/dashboard/${id}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { error } = await supabase
    .from('guides')
    .update({ published })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/${id}`)
  return { success: true }
}

export async function deleteGuide(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  await supabase.from('guides').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/auth')
}
