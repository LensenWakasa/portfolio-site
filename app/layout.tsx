import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})
const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lensen Wakasa — Continual Learning & Cognitive Architectures',
  description:
    'Portfolio and research hub of Lensen Wakasa — AI researcher, founder of Wakasa Labs, and medic-in-training. Work on continual learning, cognitive architectures, and AI for science, from Nakuru, Kenya.',
  generator: 'Next.js',
  openGraph: {
    title: 'Lensen Wakasa — Research Hub',
    description:
      'Continual learning, cognitive architectures, and AI for science from Nakuru, Kenya.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5EDD6' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0804' },
  ],
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='light'){d.classList.add('light');d.classList.remove('dark')}else{d.classList.add('dark');d.classList.remove('light')}}catch(e){document.documentElement.classList.add('dark')}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
