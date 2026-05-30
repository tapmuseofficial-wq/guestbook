'use client'

import { useState, useEffect } from 'react'

type Props = { guideId: string; title: string; published: boolean }

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ShareCard({ guideId, title, published }: Props) {
  const [url, setUrl]             = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    setUrl(`${window.location.origin}/guide/${guideId}`)
  }, [guideId])

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  async function downloadQR() {
    const QRCode = (await import('qrcode')).default
    const dataUrl = await QRCode.toDataURL(url, {
      width: 512, margin: 2,
      color: { dark: '#1c1917', light: '#ffffff' },
    })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${slugify(title)}-qr.png`
    a.click()
  }

  async function printWelcomeCard() {
    const [{ default: QRCode }, { jsPDF }] = await Promise.all([
      import('qrcode'),
      import('jspdf'),
    ])
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 512, margin: 2,
      color: { dark: '#1c1917', light: '#ffffff' },
    })
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [105, 148] })

    pdf.setDrawColor(231, 229, 228)
    pdf.setLineWidth(0.4)
    pdf.roundedRect(5, 5, 95, 138, 4, 4)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    pdf.setTextColor(28, 25, 23)
    const lines = pdf.splitTextToSize(title, 80) as string[]
    pdf.text(lines, 52.5, 28, { align: 'center' })

    const qrY = 28 + lines.length * 8 + 6
    pdf.addImage(qrDataUrl, 'PNG', 25.5, qrY, 54, 54)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(120, 113, 108)
    pdf.text('Scan for Wi-Fi & house info', 52.5, qrY + 60, { align: 'center' })

    pdf.setFontSize(6.5)
    pdf.setTextColor(168, 162, 158)
    pdf.text(url, 52.5, 138, { align: 'center' })

    pdf.save(`${slugify(title)}-welcome-card.pdf`)
  }

  if (!published) {
    return (
      <section className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5">
        <h2 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Share</h2>
        <p className="text-sm text-stone-400">Publish your guide to get a shareable link for guests.</p>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5 space-y-4">
      <h2 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Share</h2>

      <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5">
        <span className="text-sm text-stone-500 truncate flex-1 font-mono">{url}</span>
        <button
          onClick={copyLink}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            linkCopied
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          {linkCopied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={downloadQR}
          className="flex-1 py-2.5 text-sm font-semibold border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-stone-600"
        >
          Download QR
        </button>
        <button
          onClick={printWelcomeCard}
          className="flex-1 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Print Welcome Card
        </button>
      </div>
    </section>
  )
}
