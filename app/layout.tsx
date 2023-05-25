import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'yNews API',
  description: 'yNews, y not?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name={'description'} content={metadata.description} />
        <link rel={'icon'} href={'/favicon.ico'} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
