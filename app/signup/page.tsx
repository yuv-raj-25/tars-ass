"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }
    if (!email || !password) {
      alert("Please fill in all fields.")
      return
    }
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (response.ok) {
      localStorage.setItem("token", data.token)
      router.push("/")
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-600">Sign up for AI Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-purple-600">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

