import Link from "next/link"
import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { AppFooter } from "@/components/app-footer"

export const metadata: Metadata = {
  title: "FAQ - FinanceFlow",
  description: "Frequently asked questions about FinanceFlow",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center py-4 border-b border-gray-100">
          <Link href="/" className="text-xl font-bold">
            FinanceFlow
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard-preview" className="text-sm hover:underline mr-2">
              Demo
            </Link>
            <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-1 h-8">
              <Link href="/login">Log In/Sign Up</Link>
            </Button>
          </div>
        </header>

        <main className="py-12">
          <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="about-1">
              <AccordionTrigger className="text-lg font-medium">What is FinanceFlow?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                FinanceFlow is a personal finance management application designed to help you track your income,
                expenses, and overall financial health. It provides a simple and intuitive interface to manage your
                budget, set financial goals, and gain insights into your spending habits.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="about-2">
              <AccordionTrigger className="text-lg font-medium">Is FinanceFlow free to use?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, FinanceFlow is completely free to use. There are no premium tiers, no hidden fees, and no feature
                restrictions. All features are available to all users at no cost.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="about-3">
              <AccordionTrigger className="text-lg font-medium">
                What devices can I use FinanceFlow on?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                FinanceFlow is a web-based application that works on any device with a modern web browser, including
                desktops, laptops, tablets, and smartphones. We&apos;ve designed the interface to be responsive and
                user-friendly across all screen sizes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <h2 className="text-2xl font-semibold mb-4">Security & Privacy</h2>
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="security-1">
              <AccordionTrigger className="text-lg font-medium">How secure is my financial data?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                <p>We take security very seriously. FinanceFlow implements several layers of protection:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>All data is encrypted both in transit and at rest using industry-standard encryption</li>
                  <li>We use Supabase for authentication, which implements secure password hashing and storage</li>
                  <li>Two-factor authentication is available for additional account security</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>We never store your bank credentials or account numbers</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-2">
              <AccordionTrigger className="text-lg font-medium">Does FinanceFlow sell my data?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                No, we do not sell your personal or financial data to third parties. Your data is yours, and we only use
                it to provide and improve our services. We may use anonymized, aggregated data for analytics purposes,
                but this never includes personally identifiable information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <h2 className="text-2xl font-semibold mb-4">Using FinanceFlow</h2>
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="usage-1">
              <AccordionTrigger className="text-lg font-medium">How do I add expenses and income?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                <p>Adding expenses and income is simple:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Navigate to the Dashboard</li>
                  <li>Click the "Add Expense" or "Add Income" button</li>
                  <li>Fill in the details in the dialog that appears</li>
                  <li>Click "Save" to add the entry to your records</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usage-2">
              <AccordionTrigger className="text-lg font-medium">Can I categorize my expenses?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, FinanceFlow allows you to categorize expenses to better track your spending patterns. You can
                create custom categories or use our default ones like Housing, Food, Transportation, Entertainment, etc.
                This feature helps you identify areas where you might be overspending and make more informed financial
                decisions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
