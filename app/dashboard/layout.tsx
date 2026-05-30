import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { signOut } from '@/lib/actions'
import Logo from '@/components/ui/Logo'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Logo size="sm" href="/dashboard" />
          <div className="flex items-center gap-5">
            <span className="hidden sm:block text-xs text-stone-400 font-medium tabular-nums">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  )
}
