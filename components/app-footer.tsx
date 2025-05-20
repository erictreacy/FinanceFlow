import Link from "next/link"

export function AppFooter() {
  return (
    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
      <p className="text-xs sm:text-sm">
        FinanceFlow is made by{" "}
        <Link href="https://etreacy.me" className="underline hover:text-gray-700">
          Eric Treacy
        </Link>
        .
      </p>
      <Link href="/faq" className="underline hover:text-gray-700 text-xs sm:text-sm">
        Read the FAQs
      </Link>
    </div>
  )
}
