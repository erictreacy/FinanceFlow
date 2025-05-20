"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { EditExpenseDialog } from "@/components/edit-expense-dialog"
import { AppFooter } from "@/components/app-footer"
import { FinancialStatusLegend } from "@/components/financial-status-legend"

type Expense = {
  id: string
  name: string
  amount: number
  description: string
  color: string
  date: string
}

export default function DashboardPreview() {
  // Mock expenses data
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      name: "Rent",
      amount: 1200,
      description: "Monthly apartment rent",
      color: "#FF5733",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Groceries",
      amount: 350,
      description: "Weekly grocery shopping",
      color: "#33FF57",
      date: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Utilities",
      amount: 180,
      description: "Electricity and water",
      color: "#3357FF",
      date: new Date().toISOString(),
    },
  ])

  // Mock income data
  const totalIncome = 3000
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = totalIncome - totalExpenses

  // Expense state
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null)
  const [isEditExpenseDialogOpen, setIsEditExpenseDialogOpen] = useState(false)

  // Sorting state
  const [sortColumn, setSortColumn] = useState<"amount" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

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

  // Expense handlers
  const handleEditExpenseClick = (expense: Expense) => {
    setExpenseToEdit(expense)
    setIsEditExpenseDialogOpen(true)
  }

  // Add expense handler
  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setExpenses([...expenses, { ...newExpense, id }])
  }

  // Edit expense handler
  const handleEditExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
  }

  // Delete expense handler
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  // Sorting handler
  const handleSort = (column: "amount" | null) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Get sorted expenses
  const getSortedExpenses = () => {
    if (!sortColumn) return expenses

    return [...expenses].sort((a, b) => {
      if (sortColumn === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      }
      return 0
    })
  }

  // Get sort indicator
  const getSortIndicator = (column: "amount" | null) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? " ▲" : " ▼"
  }

  const sortedExpenses = getSortedExpenses()

  // Currency symbol
  const currencySymbol = "$"

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
            <Link href="/account-preview" className="text-xs sm:text-sm hover:underline">
              Account
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
            <h1 className="text-xl sm:text-2xl font-bold">Expenses Dashboard</h1>
            <div className={`${statusClass} text-white px-2 py-1 rounded text-xs sm:text-sm self-start sm:self-auto`}>
              {statusText}: {currencySymbol}
              {remaining.toFixed(2)}
            </div>
          </div>

          {/* Financial Status Legend */}
          <FinancialStatusLegend className="mb-4 sm:mb-6" compact={true} />

          <div className="mb-6 sm:mb-8">
            <p className="text-base sm:text-xl">
              You have{" "}
              <span className={`${statusClass} text-white px-2 py-1 rounded text-xs sm:text-base font-medium`}>
                {currencySymbol}
                {remaining.toFixed(2)}
              </span>{" "}
              safe to spend.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Based on your total income of {currencySymbol}
              {totalIncome.toFixed(2)} and expenses of {currencySymbol}
              {totalExpenses.toFixed(2)}.
            </p>
          </div>

          {/* Financial Summary */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-md text-xs sm:text-sm">
            <h3 className="text-sm sm:text-md font-medium mb-2 sm:mb-3">Financial Summary</h3>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between">
                <span>Total Income:</span>
                <span className="font-medium">
                  {currencySymbol}
                  {totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses:</span>
                <span className="font-medium">
                  {currencySymbol}
                  {totalExpenses.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-1 sm:pt-2 mt-1 sm:mt-2">
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span
                    className={`font-medium ${remaining < 0 ? "text-red-600" : remaining < totalIncome * 0.2 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {currencySymbol}
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

          {/* Expenses Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
              <h2 className="text-base sm:text-lg font-medium">Your Expenses</h2>
              <AddExpenseDialog onAddExpense={handleAddExpense} />
            </div>

            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-3 sm:px-0">
                <table className="min-w-full divide-y divide-gray-100 text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th scope="col" className="text-left py-2 font-medium text-gray-500 text-xs sm:text-sm">
                        Name
                      </th>
                      <th
                        scope="col"
                        className="text-right py-2 font-medium text-gray-500 text-xs sm:text-sm cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("amount")}
                      >
                        Cost{getSortIndicator("amount")}
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
                    {sortedExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500 text-xs sm:text-sm">
                          No expenses yet. Add your first expense to get started.
                        </td>
                      </tr>
                    ) : (
                      sortedExpenses.map((expense) => (
                        <tr key={expense.id} className="border-b border-gray-100">
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 border border-gray-200"
                                style={{ backgroundColor: expense.color }}
                              ></div>
                              <span className="text-gray-900 text-xs sm:text-sm">{expense.name}</span>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 text-right text-gray-900 text-xs sm:text-sm">
                            {currencySymbol}
                            {expense.amount.toFixed(2)}
                          </td>
                          <td className="py-2 sm:py-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                            {expense.description}
                          </td>
                          <td className="py-2 sm:py-3">
                            <button
                              onClick={() => handleEditExpenseClick(expense)}
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
        </main>

        <AppFooter />
      </div>

      {/* Expense Dialog */}
      <EditExpenseDialog
        expense={expenseToEdit}
        open={isEditExpenseDialogOpen}
        onOpenChange={setIsEditExpenseDialogOpen}
        onEditExpense={handleEditExpense}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  )
}
