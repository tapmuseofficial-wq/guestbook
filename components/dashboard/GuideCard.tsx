import Link from 'next/link'
import type { Guide } from '@/lib/types'

type Props = {
  guide: Pick<Guide, 'id' | 'title' | 'slug' | 'published' | 'updated_at'>
}

export default function GuideCard({ guide }: Props) {
  const updatedAt = new Date(guide.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-gray-900">{guide.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            guide.published
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {guide.published ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="text-xs text-gray-400">/{guide.slug} · Updated {updatedAt}</p>
      </div>
      <div className="flex items-center gap-4">
        {guide.published && (
          <Link
            href={`/guide/${guide.id}`}
            target="_blank"
            className="text-sm text-blue-600 hover:underline"
          >
            View
          </Link>
        )}
        <Link href={`/dashboard/${guide.id}`} className="text-sm text-gray-600 hover:text-gray-900 font-medium">
          Edit
        </Link>
      </div>
    </div>
  )
}
