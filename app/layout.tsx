import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/SideBar"
import Providers from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>

        </Providers>
      </body>
    </html>
  )
}
