"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { AppFooter } from "@/components/app-footer"
import { FinancialStatusLegend } from "@/components/financial-status-legend"
import { AddIncomeDialog } from "@/components/add-income-dialog"
import { EditIncomeDialog } from "@/components/edit-income-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useCurrency } from "@/hooks/use-currency"
import {
  getIncomes,
  getExpenses,
  addIncome,
  updateIncome,
  deleteIncome,
  getProfile,
  updateProfile,
  type Income,
  type Profile,
} from "@/services/database"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"

export default function Account() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null)
  const [isEditIncomeDialogOpen, setIsEditIncomeDialogOpen] = useState(false)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const currency = useCurrency()
  const { toast } = useToast()
  const { user } = useAuth()

  // Currency options
  const currencies = [
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
  ]

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load profile
        const profileData = await getProfile()
        if (profileData) {
          setProfile(profileData)
          setName(profileData.name)
          setSelectedCurrency(profileData.currency || "USD")
        } else if (user) {
          setName(user.user_metadata.name || "")
        }

        // Load incomes
        const incomesData = await getIncomes()
        setIncomes(incomesData)
        setTotalIncome(incomesData.reduce((sum, income) => sum + income.amount, 0))

        // Load expenses for total
        const expensesData = await getExpenses()
        setTotalExpenses(expensesData.reduce((sum, expense) => sum + expense.amount, 0))
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load your account data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast, user])

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

  // Income handlers
  const handleEditIncomeClick = (income: Income) => {
    setIncomeToEdit(income)
    setIsEditIncomeDialogOpen(true)
  }

  const handleAddIncome = async (newIncome: Omit<Income, "id" | "color">) => {
    try {
      const income = await addIncome({
        ...newIncome,
        date: new Date().toISOString(),
      })
      setIncomes([income, ...incomes])
      setTotalIncome(totalIncome + newIncome.amount)
      toast({
        title: "Income added",
        description: "Your income source has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding income:", error)
      toast({
        title: "Error",
        description: "Failed to add income source. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditIncome = async (updatedIncome: Income) => {
    try {
      await updateIncome(updatedIncome)

      // Find the old income to calculate the difference
      const oldIncome = incomes.find((i) => i.id === updatedIncome.id)
      const amountDifference = oldIncome ? updatedIncome.amount - oldIncome.amount : 0

      // Update the incomes list
      setIncomes(incomes.map((income) => (income.id === updatedIncome.id ? updatedIncome : income)))

      // Update the total income
      setTotalIncome(totalIncome + amountDifference)

      toast({
        title: "Income updated",
        description: "Your income source has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating income:", error)
      toast({
        title: "Error",
        description: "Failed to update income source. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id)

      // Find the income to calculate the difference
      const incomeToDelete = incomes.find((i) => i.id === id)
      const amountToSubtract = incomeToDelete ? incomeToDelete.amount : 0

      // Update the incomes list
      setIncomes(incomes.filter((income) => income.id !== id))

      // Update the total income
      setTotalIncome(totalIncome - amountToSubtract)

      toast({
        title: "Income deleted",
        description: "Your income source has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting income:", error)
      toast({
        title: "Error",
        description: "Failed to delete income source. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Profile handlers
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateProfile({
        name,
        currency: selectedCurrency,
      })

      setSaveSuccess(true)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Generate random colors for incomes if they don't have one
  const getIncomeColor = (income: Income, index: number) => {
    if (income.color) return income.color

    // Generate a color based on the index
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#E91E63", "#F44336", "#3F51B5", "#009688"]
    return colors[index % colors.length]
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
                <h1 className="text-xl sm:text-2xl font-bold">Account Settings</h1>
                <div
                  className={`${statusClass} text-white px-2 py-1 rounded text-xs sm:text-sm self-start sm:self-auto`}
                >
                  {statusText}: {currency.format(remaining)}
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
                    <p className="text-xs sm:text-sm font-medium">Total: {currency.format(totalIncome)}</p>
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
                          incomes.map((income, index) => (
                            <tr key={income.id} className="border-b border-gray-100">
                              <td className="py-2 sm:py-3">
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 border border-gray-200"
                                    style={{ backgroundColor: getIncomeColor(income, index) }}
                                  ></div>
                                  <span className="text-gray-900 text-xs sm:text-sm">{income.name}</span>
                                </div>
                              </td>
                              <td className="py-2 sm:py-3 text-right text-gray-900 text-xs sm:text-sm">
                                {currency.format(income.amount)}
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
                        value={user?.email || ""}
                        disabled
                        className="mt-1 text-xs sm:text-sm bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <Label htmlFor="currency" className="text-xs sm:text-sm font-medium text-gray-700">
                        Currency
                      </Label>
                      <Select defaultValue={selectedCurrency} onValueChange={setSelectedCurrency}>
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
            </>
          )}
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
