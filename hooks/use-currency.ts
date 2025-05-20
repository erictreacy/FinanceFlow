"use client"

import { useState, useEffect } from "react"
import { getProfile } from "@/services/database"

type CurrencyInfo = {
  code: string
  symbol: string
  format: (amount: number) => string
}

export function useCurrency() {
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>({
    code: "USD",
    symbol: "$",
    format: (amount: number) => `$${amount.toFixed(2)}`,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const profile = await getProfile()
        if (profile && profile.currency) {
          const currencyCode = profile.currency
          const currencySymbol = getCurrencySymbol(currencyCode)
          setCurrencyInfo({
            code: currencyCode,
            symbol: currencySymbol,
            format: (amount: number) => `${currencySymbol}${amount.toFixed(2)}`,
          })
        }
      } catch (error) {
        console.error("Error loading currency:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrency()
  }, [])

  return { ...currencyInfo, isLoading }
}

function getCurrencySymbol(currencyCode: string): string {
  const currencies: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    INR: "₹",
    CNY: "¥",
    BRL: "R$",
    ZAR: "R",
    MXN: "Mex$",
    SGD: "S$",
    NZD: "NZ$",
    HKD: "HK$",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    CHF: "Fr",
    RUB: "₽",
    TRY: "₺",
  }

  return currencies[currencyCode] || "$"
}
