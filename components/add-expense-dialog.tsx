"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Expense = {
  id: string
  name: string
  amount: number
  description: string
  category?: string
  color?: string
  date: string
}

type AddExpenseDialogProps = {
  onAddExpense: (expense: Omit<Expense, "id">) => void
}

export function AddExpenseDialog({ onAddExpense }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Uncategorized")

  // Category options
  const categories = [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Education",
    "Shopping",
    "Uncategorized",
  ]

  // Generate a random color for the expense
  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#33FFF5", "#FFD133", "#8C33FF", "#FF8C33"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !amount) return

    const newExpense = {
      name,
      amount: Number.parseFloat(amount),
      description,
      category,
      color: getRandomColor(),
      date: new Date().toISOString(),
    }

    onAddExpense(newExpense)
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setAmount("")
    setDescription("")
    setCategory("Uncategorized")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-2 sm:px-4 py-1 h-7 sm:h-8 text-xs sm:text-sm">
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-4 sm:p-6 text-xs sm:text-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Add Expense</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Add a new expense to your budget. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="name" className="text-right text-xs sm:text-sm">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 text-xs sm:text-sm h-8 sm:h-9"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="amount" className="text-right text-xs sm:text-sm">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3 text-xs sm:text-sm h-8 sm:h-9"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="category" className="text-right text-xs sm:text-sm">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3 text-xs sm:text-sm h-8 sm:h-9">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs sm:text-sm">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="description" className="text-right text-xs sm:text-sm">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 text-xs sm:text-sm h-8 sm:h-9"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="text-xs sm:text-sm h-8 sm:h-9">
              Save Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
