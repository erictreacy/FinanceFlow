import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { AppFooter } from "@/components/app-footer"

export default function SignUpSuccessPage() {
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

        <main className="py-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Account created successfully!</h1>
            <p className="text-gray-600 mb-8">
              We&apos;ve sent a confirmation email to your inbox. Please verify your email address to complete the
              registration process.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full bg-black hover:bg-gray-800 text-white">
                <Link href="/login">Go to Login</Link>
              </Button>
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email?{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Resend verification email
                </Link>
              </p>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
