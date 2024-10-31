import Header from './Header'
import Footer from './Footer'
import CookieConsent from './CookieConsent'
import localFont from "next/font/local"


const geistSans = localFont({
  src: [
    { path: "../pages/fonts/GeistVF.woff", weight: "100 900" },
  ],
  variable: "--font-geist-sans"
})



const geistMono = localFont({
  src: [
    { path: "../pages/fonts/GeistMonoVF.woff", weight: "100 900" },
  ],
  variable: "--font-geist-mono"
})

export default function Layout({ children }) {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${geistSans.variable} ${geistMono.variable} font-geist-sans`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  )
}




