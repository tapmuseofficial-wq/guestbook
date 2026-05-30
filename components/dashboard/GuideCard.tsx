import Link from 'next/link'
import type { Guide } from '@/lib/types'

type Props = {
  guide: Pick<Guide, 'id' | 'title' | 'slug' | 'published' | 'updated_at'>
  colorIndex: number
}

const GRADIENTS = [
  'from-indigo-400 to-violet-500',
  'from-amber-400 to-orange-400',
  'from-teal-400 to-emerald-500',
  'from-sky-400 to-blue-500',
  'from-rose-400 to-pink-500',
  'from-lime-400 to-teal-400',
]

export default function GuideCard({ guide, colorIndex }: Props) {
  const gradient = GRADIENTS[colorIndex % GRADIENTS.length]
  const updatedAt = new Date(guide.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
  const initial = guide.title.charAt(0).toUpperCase()

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Gradient header */}
      <div className={`h-[88px] bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/[0.06]" />
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
            guide.published
              ? 'bg-white/25 text-white'
              : 'bg-black/15 text-white/75'
          }`}>
            {guide.published ? 'Published' : 'Draft'}
          </span>
        </div>
        {/* Initial avatar */}
        <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <span className="text-white font-bold text-lg leading-none select-none">
            {initial}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 mb-0.5 truncate leading-snug">{guide.title}</h3>
        <p className="text-xs text-stone-400 font-medium mb-4">
          /{guide.slug} · Updated {updatedAt}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/${guide.id}`}
            className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            Edit
          </Link>
          {guide.published ? (
            <Link
              href={`/guide/${guide.id}`}
              target="_blank"
              className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              View
            </Link>
          ) : (
            <span className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-stone-50 text-stone-300 cursor-default select-none">
              View
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
