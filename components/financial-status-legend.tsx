import { Card, CardContent } from "@/components/ui/card"

interface FinancialStatusLegendProps {
  className?: string
  compact?: boolean
}

export function FinancialStatusLegend({ className = "", compact = false }: FinancialStatusLegendProps) {
  return (
    <Card className={`${className} text-xs sm:text-sm`}>
      <CardContent className={`${compact ? "p-2 sm:p-3" : "p-3 sm:p-4"}`}>
        <h3 className={`${compact ? "text-xs" : "text-xs sm:text-sm"} font-medium mb-1 sm:mb-2`}>
          Financial Status Indicators
        </h3>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
            <span className={`${compact ? "text-xs" : "text-xs sm:text-sm"}`}>
              <strong>Healthy:</strong> More than 20% of income remaining
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full mr-1 sm:mr-2"></div>
            <span className={`${compact ? "text-xs" : "text-xs sm:text-sm"}`}>
              <strong>Needs Attention:</strong> Less than 20% of income remaining
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-1 sm:mr-2"></div>
            <span className={`${compact ? "text-xs" : "text-xs sm:text-sm"}`}>
              <strong>Critical:</strong> Expenses exceed income
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
