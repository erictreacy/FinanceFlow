"use client"

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

type Income = {
  id: string
  name: string
  amount: number
  description: string
  color: string
}

interface EditIncomeDialogProps {
  income: Income | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (income: Income) => void
  onDelete?: (id: string) => void
}

export function EditIncomeDialog({ income, open, onOpenChange, onSave, onDelete }: EditIncomeDialogProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Reset form when income changes
  useEffect(() => {
    if (income) {
      setName(income.name)
      setAmount(income.amount.toString())
      setDescription(income.description)
      setError("")
    }
  }, [income, open])

  const handleSave = () => {
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

    if (!income) return

    // Save changes
    onSave?.({
      ...income,
      name,
      amount: amountValue,
      description,
    })

    // Close dialog
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (!income) return
    onDelete?.(income.id)
    setIsDeleteDialogOpen(false)
    onOpenChange(false)
  }

  if (!income) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-4 sm:p-6 text-xs sm:text-sm">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Edit Income Source</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Make changes to your income source here.</DialogDescription>
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
                  This action cannot be undone. This will permanently delete this income source.
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
          <Button
            type="submit"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
