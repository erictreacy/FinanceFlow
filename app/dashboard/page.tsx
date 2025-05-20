"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { AppFooter } from "@/components/app-footer"
import { FinancialStatusLegend } from "@/components/financial-status-legend"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { EditExpenseDialog } from "@/components/edit-expense-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useCurrency } from "@/hooks/use-currency"
import { getExpenses, getIncomes, addExpense, updateExpense, deleteExpense, type Expense } from "@/services/database"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null)
  const [isEditExpenseDialogOpen, setIsEditExpenseDialogOpen] = useState(false)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [sortColumn, setSortColumn] = useState<"amount" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const currency = useCurrency()
  const { toast } = useToast()

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load expenses
        const expensesData = await getExpenses()
        setExpenses(expensesData)
        setTotalExpenses(expensesData.reduce((sum, expense) => sum + expense.amount, 0))

        // Load incomes
        const incomesData = await getIncomes()
        setTotalIncome(incomesData.reduce((sum, income) => sum + income.amount, 0))
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load your financial data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Calculate remaining amount
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

  // Expense handlers
  const handleEditExpenseClick = (expense: Expense) => {
    setExpenseToEdit(expense)
    setIsEditExpenseDialogOpen(true)
  }

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    try {
      const expense = await addExpense(newExpense)
      setExpenses([expense, ...expenses])
      setTotalExpenses(totalExpenses + newExpense.amount)
      toast({
        title: "Expense added",
        description: "Your expense has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditExpense = async (updatedExpense: Expense) => {
    try {
      await updateExpense(updatedExpense)

      // Find the old expense to calculate the difference
      const oldExpense = expenses.find((e) => e.id === updatedExpense.id)
      const amountDifference = oldExpense ? updatedExpense.amount - oldExpense.amount : 0

      // Update the expenses list
      setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))

      // Update the total expenses
      setTotalExpenses(totalExpenses + amountDifference)

      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating expense:", error)
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id)

      // Find the expense to calculate the difference
      const expenseToDelete = expenses.find((e) => e.id === id)
      const amountToSubtract = expenseToDelete ? expenseToDelete.amount : 0

      // Update the expenses list
      setExpenses(expenses.filter((expense) => expense.id !== id))

      // Update the total expenses
      setTotalExpenses(totalExpenses - amountToSubtract)

      toast({
        title: "Expense deleted",
        description: "Your expense has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting expense:", error)
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Sorting handler
  const handleSort = (column: "amount" | null) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new column and default to descending
      setSortColumn(column)
      setSortDirection("desc")
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

  // Generate random colors for expenses if they don't have one
  const getExpenseColor = (expense: Expense) => {
    if (expense.color) return expense.color

    // Generate a color based on the category
    const colors: Record<string, string> = {
      Housing: "#FF5733",
      Food: "#33FF57",
      Transportation: "#3357FF",
      Utilities: "#FF33A8",
      Entertainment: "#33FFF5",
      Healthcare: "#FFD133",
      Education: "#8C33FF",
      Shopping: "#FF8C33",
      Uncategorized: "#AAAAAA",
    }

    return colors[expense.category] || "#AAAAAA"
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardNav />

      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <main className="py-4 sm:py-8">
          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-bold">Expenses Dashboard</h1>
                <div
                  className={`${statusClass} text-white px-2 py-1 rounded text-xs sm:text-sm self-start sm:self-auto`}
                >
                  {statusText}: {currency.format(remaining)}
                </div>
              </div>

              {/* Financial Status Legend */}
              <FinancialStatusLegend className="mb-4 sm:mb-6" compact={true} />

              <div className="mb-6 sm:mb-8">
                <p className="text-base sm:text-xl">
                  You have{" "}
                  <span className={`${statusClass} text-white px-2 py-1 rounded text-xs sm:text-base font-medium`}>
                    {currency.format(remaining)}
                  </span>{" "}
                  safe to spend.
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Based on your total income of {currency.format(totalIncome)} and expenses of{" "}
                  {currency.format(totalExpenses)}.
                </p>
              </div>

              {/* Financial Summary */}
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-md text-xs sm:text-sm">
                <h3 className="text-sm sm:text-md font-medium mb-2 sm:mb-3">Financial Summary</h3>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between">
                    <span>Total Income:</span>
                    <span className="font-medium">{currency.format(totalIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span className="font-medium">{currency.format(totalExpenses)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1 sm:pt-2 mt-1 sm:mt-2">
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span
                        className={`font-medium ${remaining < 0 ? "text-red-600" : remaining < totalIncome * 0.2 ? "text-orange-600" : "text-green-600"}`}
                      >
                        {currency.format(remaining)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage of Income:</span>
                      <span
                        className={`font-medium ${remaining < 0 ? "text-red-600" : remaining < totalIncome * 0.2 ? "text-orange-600" : "text-green-600"}`}
                      >
                        {totalIncome === 0 ? "0" : remaining < 0 ? "0" : ((remaining / totalIncome) * 100).toFixed(1)}%
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
                            Category
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
                                    style={{ backgroundColor: getExpenseColor(expense) }}
                                  ></div>
                                  <span className="text-gray-900 text-xs sm:text-sm">{expense.name}</span>
                                </div>
                              </td>
                              <td className="py-2 sm:py-3 text-right text-gray-900 text-xs sm:text-sm">
                                {currency.format(expense.amount)}
                              </td>
                              <td className="py-2 sm:py-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                                {expense.category || "Uncategorized"}
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
            </>
          )}
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
