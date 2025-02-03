'use client'

import { Home, Star, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className="w-64 border-r bg-background flex flex-col h-screen">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            {/* <span className="text-lg font-semibold text-primary-foreground">AI</span> */}
            <Image src="/tars_logo.jpeg" alt="logo" width={32} height={16} />
          </div>
          <Link href="/" className="text-lg font-semibold"> Ai-Notes</Link>
        </div>
      </div>
      <nav className="space-y-1 p-4 flex-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2 text-secondary-foreground"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
        >
          <Star className="h-5 w-5" />
          <span>Favorites</span>
        </Link>
      </nav>
      <div className="p-4 border-t">
        {session ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground truncate">{session.user?.email}</p>
            <Button variant="outline" className="w-full" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

