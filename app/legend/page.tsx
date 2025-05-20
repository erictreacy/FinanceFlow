import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppFooter } from "@/components/app-footer"
import { FinancialStatusLegend } from "@/components/financial-status-legend"

export default function LegendPage() {
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

        <main className="py-8">
          <h1 className="text-2xl font-bold mb-6">Financial Status Legend</h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium mb-4">Standard Legend</h2>
              <FinancialStatusLegend />
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Compact Legend</h2>
              <FinancialStatusLegend compact={true} />
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-4 text-white">Dark Background</h2>
              <FinancialStatusLegend className="bg-gray-800 text-white border-gray-700" />
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Inline Usage Example</h2>
              <div className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium">Your Financial Status</h3>
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-sm">Healthy: $1,200.00</div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Your finances are in good shape. You have more than 20% of your income remaining after expenses.
                </p>
                <FinancialStatusLegend compact={true} />
              </div>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
