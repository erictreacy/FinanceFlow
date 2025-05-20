"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AppFooter } from "@/components/app-footer"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check if we have a session when the component mounts
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // If no session, the user might have clicked an expired link
      if (!session) {
        setError("Your password reset link may have expired. Please request a new one.")
      }
    }

    checkSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setMessage("Your password has been reset successfully!")

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center py-4 border-b border-gray-100">
          <Link href="/" className="text-xl font-bold">
            FinanceFlow
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard-preview" className="text-sm hover:underline mr-2">
              Demo
            </Link>
            <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-1 h-8">
              <Link href="/login">Log In/Sign Up</Link>
            </Button>
          </div>
        </header>

        <main className="py-12">
          <h1 className="text-2xl font-bold mb-2">Create new password</h1>
          <p className="text-gray-600 mb-6">Enter your new password below</p>

          {message ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <p className="text-green-800 text-sm">{message}</p>
              <p className="text-green-800 text-sm mt-2">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
