"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppFooter } from "@/components/app-footer"
import { FinancialStatusLegend } from "@/components/financial-status-legend"
import { AddIncomeDialog } from "@/components/add-income-dialog"
import { EditIncomeDialog } from "@/components/edit-income-dialog"

type Income = {
  id: string
  name: string
  amount: number
  description: string
  color: string
}

type Currency = {
  code: string
  name: string
  symbol: string
}

export default function AccountPreview() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Income state
  const [incomes, setIncomes] = useState<Income[]>([
    {
      id: "1",
      name: "Salary",
      amount: 2500,
      description: "Monthly salary from work",
      color: "#4CAF50",
    },
    {
      id: "2",
      name: "Freelance",
      amount: 500,
      description: "Side projects",
      color: "#2196F3",
    },
  ])

  // Income dialog state
  const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null)
  const [isEditIncomeDialogOpen, setIsEditIncomeDialogOpen] = useState(false)

  // Currency state
  const [currencies] = useState<Currency[]>([
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  ])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])

  // Calculate totals for reference
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpenses = 1800 // Mock value
  const remaining = totalIncome - totalExpenses

  // Determine financial status
  let statusClass = "bg-green-500"
  let statusText = "Healthy"

  if (remaining < 0) {
    statusClass = "bg-red-500"
    statusText = "Critical"
  } else if (remaining < totalIncome * 0.2) {
    statusClass = "bg-orange-400"
    statusText = "Needs Attention"
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 800)
  }

  // Currency handler
  const handleCurrencyChange = (value: string) => {
    const currency = currencies.find((c) => c.code === value)
    if (currency) {
      setSelectedCurrency(currency)
    }
  }

  // Income handlers
  const handleAddIncome = (newIncome: Omit<Income, "id" | "color">) => {
    // Generate a random color for the income
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#E91E63", "#F44336", "#3F51B5", "#009688"]
    const color = colors[Math.floor(Math.random() * colors.length)]

    // Generate a unique ID
    const id = Math.random().toString(36).substring(2, 9)

    // Add the new income to the state
    setIncomes([...incomes, { ...newIncome, id, color }])
  }

  const handleEditIncome = (updatedIncome: Income) => {
    setIncomes(incomes.map((income) => (income.id === updatedIncome.id ? updatedIncome : income)))
  }

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id))
  }

  const handleEditIncomeClick = (income: Income) => {
    setIncomeToEdit(income)
    setIsEditIncomeDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="flex flex-wrap justify-between items-center py-3 border-b border-gray-100">
          <Link href="/" className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">
            FinanceFlow
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/dashboard-preview" className="text-xs sm:text-sm hover:underline">
              Demo
            </Link>
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white rounded-md px-2 sm:px-4 py-1 h-7 sm:h-8 text-xs sm:text-sm"
            >
              <Link href="/login">Log In/Sign Up</Link>
            </Button>
          </div>
        </header>

        <main className="py-4 sm:py-8">
          <Alert
            variant="destructive"
            className="mb-4 sm:mb-6 bg-red-50 border-red-200 text-red-800 text-xs sm:text-sm"
          >
            <ExclamationTriangleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <AlertTitle>Preview Mode</AlertTitle>
            <AlertDescription>This is a preview with mock data. No authentication required.</AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold">Account Settings</h1>
            <div className={`${statusClass} text-white px-2 py-1 rounded text-xs sm:text-sm self-start sm:self-auto`}>
              {statusText}: {selectedCurrency.symbol}
              {remaining.toFixed(2)}
            </div>
          </div>

          {/* Financial Status Legend */}
          <FinancialStatusLegend className="mb-4 sm:mb-6" compact={true} />

          {saveSuccess && (
            <div className="mb-4 sm:mb-6 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-xs sm:text-sm">
              Your changes have been saved successfully.
            </div>
          )}

          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
              <h2 className="text-base sm:text-lg font-medium">Income Sources</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-medium">
                  Total: {selectedCurrency.symbol}
                  {totalIncome.toFixed(2)}
                </p>
                <AddIncomeDialog onAdd={handleAddIncome} />
              </div>
            </div>

            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-3 sm:px-0">
                <table className="min-w-full divide-y divide-gray-100 text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th scope="col" className="text-left py-2 font-medium text-gray-500 text-xs sm:text-sm">
                        Source
                      </th>
                      <th scope="col" className="text-right py-2 font-medium text-gray-500 text-xs sm:text-sm">
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="text-left py-2 font-medium text-gray-500 text-xs sm:text-sm hidden sm:table-cell"
                      >
                        Description
                      </th>
                      <th scope="col" className="text-left py-2 font-medium text-gray-500 text-xs sm:text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500 text-xs sm:text-sm">
                          No income sources yet. Add your first income source to get started.
                        </td>
                      </tr>
                    ) : (
                      incomes.map((income) => (
                        <tr key={income.id} className="border-b border-gray-100">
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 border border-gray-200"
                                style={{ backgroundColor: income.color }}
                              ></div>
                              <span className="text-gray-900 text-xs sm:text-sm">{income.name}</span>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 text-right text-gray-900 text-xs sm:text-sm">
                            {selectedCurrency.symbol}
                            {income.amount.toFixed(2)}
                          </td>
                          <td className="py-2 sm:py-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                            {income.description}
                          </td>
                          <td className="py-2 sm:py-3">
                            <button
                              onClick={() => handleEditIncomeClick(income)}
                              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-md text-xs sm:text-sm">
            <h3 className="text-sm sm:text-md font-medium mb-2 sm:mb-3">Financial Summary</h3>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between">
                <span>Total Income:</span>
                <span className="font-medium">
                  {selectedCurrency.symbol}
                  {totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses:</span>
                <span className="font-medium">
                  {selectedCurrency.symbol}
                  {totalExpenses.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-1 sm:pt-2 mt-1 sm:mt-2">
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span
                    className={`font-medium ${remaining < 0 ? "text-red-600" : remaining < totalIncome * 0.2 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {selectedCurrency.symbol}
                    {remaining.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Percentage of Income:</span>
                  <span
                    className={`font-medium ${remaining < 0 ? "text-red-600" : remaining < totalIncome * 0.2 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {remaining < 0 ? "0" : ((remaining / totalIncome) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 sm:pt-8">
            <h2 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Profile Information</h2>
            <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="currency" className="text-xs sm:text-sm font-medium text-gray-700">
                    Currency
                  </Label>
                  <Select defaultValue={selectedCurrency.code} onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="w-full mt-1 text-xs sm:text-sm">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code} className="text-xs sm:text-sm">
                          {currency.symbol} - {currency.name} ({currency.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white w-full text-xs sm:text-sm h-8 sm:h-9"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </main>

        <AppFooter />
      </div>

      {/* Income Edit Dialog */}
      <EditIncomeDialog
        income={incomeToEdit}
        open={isEditIncomeDialogOpen}
        onOpenChange={setIsEditIncomeDialogOpen}
        onSave={handleEditIncome}
        onDelete={handleDeleteIncome}
      />
    </div>
  )
}
