import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database.types"

export type Expense = {
  id: string
  name: string
  amount: number
  description: string
  category: string
  date: string
  color?: string
}

export type Income = {
  id: string
  name: string
  amount: number
  description: string
  date: string
  color?: string
}

export type Profile = {
  id: string
  name: string
  currency?: string
}

// Create a Supabase client
const createClient = () => createClientComponentClient<Database>()

// Expense functions
export async function getExpenses() {
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error)
    return []
  }

  return data.map((expense) => ({
    id: expense.id,
    name: expense.description,
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: expense.date,
  })) as Expense[]
}

export async function addExpense(expense: Omit<Expense, "id">) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      amount: expense.amount,
      category: expense.category || "Uncategorized",
      description: expense.name,
      date: expense.date,
    })
    .select()

  if (error) {
    console.error("Error adding expense:", error)
    throw error
  }

  return data[0]
}

export async function updateExpense(expense: Expense) {
  const supabase = createClient()
  const { error } = await supabase
    .from("expenses")
    .update({
      amount: expense.amount,
      category: expense.category,
      description: expense.name,
      date: expense.date,
    })
    .eq("id", expense.id)

  if (error) {
    console.error("Error updating expense:", error)
    throw error
  }

  return expense
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting expense:", error)
    throw error
  }

  return id
}

// Income functions
export async function getIncomes() {
  const supabase = createClient()
  const { data, error } = await supabase.from("income").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching incomes:", error)
    return []
  }

  return data.map((income) => ({
    id: income.id,
    name: income.description,
    amount: income.amount,
    description: income.description,
    date: income.date,
  })) as Income[]
}

export async function addIncome(income: Omit<Income, "id">) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("income")
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      amount: income.amount,
      description: income.name,
      date: income.date,
    })
    .select()

  if (error) {
    console.error("Error adding income:", error)
    throw error
  }

  return data[0]
}

export async function updateIncome(income: Income) {
  const supabase = createClient()
  const { error } = await supabase
    .from("income")
    .update({
      amount: income.amount,
      description: income.name,
      date: income.date,
    })
    .eq("id", income.id)

  if (error) {
    console.error("Error updating income:", error)
    throw error
  }

  return income
}

export async function deleteIncome(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("income").delete().eq("id", id)

  if (error) {
    console.error("Error deleting income:", error)
    throw error
  }

  return id
}

// Profile functions
export async function getProfile() {
  const supabase = createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name || user.user.user_metadata.name || "",
    currency: data.currency || "USD",
  } as Profile
}

export async function updateProfile(profile: Partial<Profile>) {
  const supabase = createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) throw new Error("User not authenticated")

  const { error } = await supabase.from("profiles").upsert({
    id: user.user.id,
    name: profile.name,
    currency: profile.currency,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error updating profile:", error)
    throw error
  }

  return profile
}
