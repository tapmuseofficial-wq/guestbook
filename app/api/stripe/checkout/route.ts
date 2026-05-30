import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rateLimit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })

// Allowlist of origins that may initiate a checkout session.
// Falls back to localhost for local development.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map(o => o.trim())

function safeOrigin(req: NextRequest): string {
  const origin = req.headers.get('origin') ?? ''
  if (ALLOWED_ORIGINS.includes(origin)) return origin
  // In production, fall back to the first configured origin rather than
  // reflecting an untrusted header.
  return ALLOWED_ORIGINS[0]
}

export async function POST(req: NextRequest) {
  // Rate limit: 5 checkout attempts per IP per 10 minutes
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!rateLimit(`checkout:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const origin = safeOrigin(req)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      customer_email: user.email,
      metadata: { user_id: user.id },
      success_url: `${origin}/dashboard?upgraded=1`,
      cancel_url: `${origin}/dashboard/upgrade`,
    })
    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
