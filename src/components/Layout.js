import Header from './Header'
import Footer from './Footer'
import CookieConsent from './CookieConsent'
import localFont from "next/font/local"

const geistSans = localFont({
  src: "../pages/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "../pages/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export default function Layout({ children }) {
  return (
    <div className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  )
}