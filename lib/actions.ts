'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from './supabase-server'

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Sanitize text input: trim, enforce max length, return null if empty.
// HTML is not stripped because content is always rendered as React text nodes
// (never dangerouslySetInnerHTML), so XSS from stored content is not possible.
function str(formData: FormData, key: string, maxLen = 5000): string | null {
  const val = (formData.get(key) as string | null)?.trim() ?? ''
  if (!val) return null
  return val.slice(0, maxLen)
}

function strRequired(formData: FormData, key: string, maxLen = 100): string {
  return ((formData.get(key) as string | null)?.trim() ?? '').slice(0, maxLen)
}

// Map Postgres error codes to user-friendly messages; never leak internals.
function dbError(code?: string): string {
  if (code === '23505') return 'That slug is already taken. Choose a different one.'
  if (code === '23503') return 'Referenced record not found.'
  return 'Something went wrong. Please try again.'
}

async function getIsPro(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single()
  return data?.plan === 'pro' && data?.status === 'active'
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function createGuide(_: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Server-side free-tier enforcement — never trust the client
  const isPro = await getIsPro(supabase, user.id)
  if (!isPro) {
    const { count } = await supabase
      .from('guides')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if ((count ?? 0) >= 1) {
      return { error: 'Free plan is limited to 1 property. Upgrade to Pro for unlimited guides.' }
    }
  }

  const title = strRequired(formData, 'title')
  if (!title) return { error: 'Title is required.' }

  const rawSlug = strRequired(formData, 'slug', 80)
  const slug = rawSlug ? slugify(rawSlug) : slugify(title)
  if (!slug) return { error: 'Could not generate a valid slug from that title.' }

  const { data, error } = await supabase
    .from('guides')
    .insert({ user_id: user.id, title, slug })
    .select('id')
    .single()

  if (error) return { error: dbError(error.code) }
  redirect(`/dashboard/${data.id}`)
}

export async function updateGuide(id: string, _: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const title = strRequired(formData, 'title')
  if (!title) return { error: 'Title is required.' }

  const rawSlug = strRequired(formData, 'slug', 80)
  const slug = rawSlug ? slugify(rawSlug) : slugify(title)
  if (!slug) return { error: 'Could not generate a valid slug.' }

  // Server-side pro-field enforcement — free users cannot save pro-only sections.
  // Fields are nulled out (not just ignored) so downgraded users don't retain
  // pro-only content on their next save.
  const isPro = await getIsPro(supabase, user.id)
  const proFields = isPro
    ? {
        parking_instructions: str(formData, 'parking_instructions'),
        trash_instructions:   str(formData, 'trash_instructions'),
        emergency_contact:    str(formData, 'emergency_contact'),
        tv_entertainment:     str(formData, 'tv_entertainment'),
        laundry:              str(formData, 'laundry'),
        amenities:            str(formData, 'amenities'),
      }
    : {
        parking_instructions: null,
        trash_instructions:   null,
        emergency_contact:    null,
        tv_entertainment:     null,
        laundry:              null,
        amenities:            null,
      }

  const { error } = await supabase
    .from('guides')
    .update({
      title,
      slug,
      wifi_name:            str(formData, 'wifi_name', 100),
      wifi_password:        str(formData, 'wifi_password', 200),
      checkin_instructions: str(formData, 'checkin_instructions'),
      checkout_checklist:   str(formData, 'checkout_checklist'),
      ...proFields,
    })
    .eq('id', id)
    .eq('user_id', user.id) // RLS double-check: never update another user's guide

  if (error) return { error: dbError(error.code) }
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

  if (error) return { error: 'Something went wrong. Please try again.' }
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
