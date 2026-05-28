'use client'

import { useState, useEffect } from 'react'

type Props = {
  guideId: string
  title: string
  published: boolean
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ShareCard({ guideId, title, published }: Props) {
  const [url, setUrl] = useState('')
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
      width: 512,
      margin: 2,
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
      width: 512,
      margin: 2,
      color: { dark: '#1c1917', light: '#ffffff' },
    })

    // A6 postcard: 105 × 148 mm
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [105, 148] })

    // Outer border
    pdf.setDrawColor(231, 229, 228)
    pdf.setLineWidth(0.4)
    pdf.roundedRect(5, 5, 95, 138, 4, 4)

    // Property name
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    pdf.setTextColor(28, 25, 23)
    const titleLines = pdf.splitTextToSize(title, 80) as string[]
    const titleBlockH = titleLines.length * 8
    const titleY = 28
    pdf.text(titleLines, 52.5, titleY, { align: 'center' })

    // QR code — centered, 54 × 54 mm
    const qrY = titleY + titleBlockH + 6
    pdf.addImage(qrDataUrl, 'PNG', 25.5, qrY, 54, 54)

    // Tagline
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(120, 113, 108)
    pdf.text('Scan for Wi-Fi & house info', 52.5, qrY + 60, { align: 'center' })

    // URL in small text at bottom
    pdf.setFontSize(6.5)
    pdf.setTextColor(168, 162, 158)
    pdf.text(url, 52.5, 138, { align: 'center' })

    pdf.save(`${slugify(title)}-welcome-card.pdf`)
  }

  if (!published) {
    return (
      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Share</h2>
        <p className="text-sm text-gray-400">Publish your guide first to get a shareable link.</p>
      </section>
    )
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Share</h2>

      {/* URL row */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-sm text-gray-600 truncate flex-1 font-mono">{url}</span>
        <button
          onClick={copyLink}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
            linkCopied
              ? 'bg-green-100 text-green-700'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {linkCopied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={downloadQR}
          className="flex-1 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          Download QR Code
        </button>
        <button
          onClick={printWelcomeCard}
          className="flex-1 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Welcome Card
        </button>
      </div>
    </section>
  )
}
