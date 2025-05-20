"use client"

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

type Income = {
  id: string
  name: string
  amount: number
  description: string
  color: string
}

interface AddIncomeDialogProps {
  onAdd?: (income: Omit<Income, "id" | "color">) => void
}

export function AddIncomeDialog({ onAdd }: AddIncomeDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const resetForm = () => {
    setName("")
    setAmount("")
    setDescription("")
    setError("")
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleAdd = () => {
    // Validate form
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Amount must be a positive number")
      return
    }

    // Add new income
    onAdd?.({
      name,
      amount: amountValue,
      description,
    })

    // Close dialog and reset form
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-2 sm:px-4 py-1 h-7 sm:h-8 text-xs sm:text-sm">
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-4 sm:p-6 text-xs sm:text-sm">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Add Income Source</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Add a new income source to your account.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          {error && <div className="text-red-500 text-xs sm:text-sm">{error}</div>}
          <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="name" className="text-right text-xs sm:text-sm">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 text-xs sm:text-sm h-8 sm:h-9"
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
            />
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
          <Button
            type="submit"
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9"
          >
            Add Income
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
