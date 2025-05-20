"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Expense = {
  id: string
  name: string
  amount: number
  description: string
  category?: string
  color?: string
  date: string
}

type EditExpenseDialogProps = {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
}

export function EditExpenseDialog({
  expense,
  open,
  onOpenChange,
  onEditExpense,
  onDeleteExpense,
}: EditExpenseDialogProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Uncategorized")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  useEffect(() => {
    if (expense) {
      setName(expense.name)
      setAmount(expense.amount.toString())
      setDescription(expense.description || "")
      setCategory(expense.category || "Uncategorized")
    }
  }, [expense])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!expense || !name || !amount) return

    const updatedExpense = {
      ...expense,
      name,
      amount: Number.parseFloat(amount),
      description,
      category,
    }

    onEditExpense(updatedExpense)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (!expense) return
    onDeleteExpense(expense.id)
    setIsDeleteDialogOpen(false)
    onOpenChange(false)
  }

  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-4 sm:p-6 text-xs sm:text-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Expense</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Make changes to your expense. Click save when you're done.
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
          <DialogFooter className="flex justify-between">
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" className="text-xs sm:text-sm h-8 sm:h-9">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6 text-xs sm:text-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base sm:text-lg">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs sm:text-sm">
                    This action cannot be undone. This will permanently delete this expense.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-xs sm:text-sm h-8 sm:h-9">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="text-xs sm:text-sm h-8 sm:h-9">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit" className="text-xs sm:text-sm h-8 sm:h-9">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
