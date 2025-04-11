// ❌ REMOVE: 'use client'
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import NavbarWrapper from '@/components/NavbarWrapper'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Altar Give",
  description: "Create by Nerowork Service",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarWrapper />
        <main>{children}</main>
      </body>
    </html>
  )
}
