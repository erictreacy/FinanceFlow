"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function DashboardNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <header className="border-b border-gray-100 py-5">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/dashboard" className="text-xl font-medium leading-loose">
          FinanceFlow
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className={`text-sm ${pathname === "/dashboard" ? "text-gray-900" : "text-gray-500 hover:text-gray-900"} leading-loose`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/account"
            className={`text-sm ${
              pathname === "/dashboard/account" ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            } leading-loose`}
          >
            Account
          </Link>
          <Button
            variant="default"
            onClick={() => signOut()}
            className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-1 h-9"
          >
            Log Out
          </Button>
        </div>
      </div>
    </header>
  )
}
