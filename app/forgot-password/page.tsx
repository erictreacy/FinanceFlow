"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AppFooter } from "@/components/app-footer"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
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
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className="text-gray-600 mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>

          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <p className="text-green-800 text-sm">
                If an account exists with the email you entered, we&apos;ve sent a password reset link. Please check
                your email.
              </p>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
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
