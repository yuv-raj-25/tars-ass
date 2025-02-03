"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid credentials')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred')
    }
  }

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-600">Login to AI Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="Email" name="email" required />
            <Input
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-purple-600">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

