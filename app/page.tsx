import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppFooter } from "@/components/app-footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center py-4 border-b border-gray-100">
          <h1 className="text-xl font-bold">FinanceFlow</h1>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard-preview" className="text-sm hover:underline mr-2">
              Demo
            </Link>
            <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-1 h-8">
              <Link href="/login">Log In/Sign Up</Link>
            </Button>
          </div>
        </header>

        <main className="py-12 text-left">
          <h2 className="text-4xl font-bold mb-8 leading-tight">
            FinanceFlow is an app made to help you
            <span className="bg-yellow-200 px-1"> track and optimize your monthly cash flow.</span>
          </h2>

          <p className="text-xl mb-8">
            Enter your monthly income and expenses, and we'll analyze your financial health, helping you make smarter
            decisions with your money.
          </p>

          <p className="text-xl mb-8">
            Our intuitive dashboard shows if your finances are
            <span className="bg-green-200 px-1 mx-1">healthy</span>,
            <span className="bg-orange-200 px-1 mx-1">needs attention</span>, or
            <span className="bg-red-200 px-1 mx-1">requires immediate action</span>.
          </p>

          <p className="text-xl mb-10">
            FinanceFlow prioritizes your privacy. We don't connect to your bank accounts, and your data stays secure on
            our servers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-md px-6 py-3 h-12 text-base">
              <Link href="/login">Log In or Sign Up</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-black text-black hover:bg-gray-100 rounded-md px-6 py-3 h-12 text-base"
            >
              <Link href="/dashboard-preview">Try the Demo</Link>
            </Button>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
