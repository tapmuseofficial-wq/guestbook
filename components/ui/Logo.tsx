import Link from 'next/link'

type Size = 'xs' | 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  href?: string
  className?: string
}

const sizes: Record<Size, { box: number; icon: number; text: string; gap: string }> = {
  xs: { box: 20, icon: 10, text: 'text-sm',  gap: 'gap-1.5' },
  sm: { box: 24, icon: 12, text: 'text-base', gap: 'gap-2'   },
  md: { box: 30, icon: 15, text: 'text-xl',   gap: 'gap-2.5' },
  lg: { box: 38, icon: 19, text: 'text-2xl',  gap: 'gap-3'   },
}

function BookIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4C8.5 3 6 3 4 4v11c2-1 4.5-1 6 0V4z" fill="white" fillOpacity=".95" />
      <path d="M10 4c1.5-1 4-1 6 0v11c-2-1-4.5-1-6 0V4z"   fill="white" fillOpacity=".6"  />
      <line x1="10" y1="4.5" x2="10" y2="14.5" stroke="white" strokeOpacity=".4" strokeWidth="1.2" />
    </svg>
  )
}

function LogoInner({ size }: { size: Size }) {
  const { box, icon, text, gap } = sizes[size]
  return (
    <span className={`inline-flex items-center ${gap}`}>
      <span
        className="rounded-xl bg-indigo-600 flex items-center justify-center shrink-0"
        style={{ width: box, height: box }}
      >
        <BookIcon s={icon} />
      </span>
      <span className={`font-semibold tracking-tight text-stone-900 ${text}`}>
        Guestbook
      </span>
    </span>
  )
}

export default function Logo({ size = 'md', href, className = '' }: Props) {
  if (href) {
    return (
      <Link href={href} className={`inline-flex items-center ${className}`}>
        <LogoInner size={size} />
      </Link>
    )
  }
  return (
    <div className={`inline-flex items-center ${className}`}>
      <LogoInner size={size} />
    </div>
  )
}
