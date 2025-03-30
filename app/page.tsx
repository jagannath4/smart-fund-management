import { InvestmentForm } from "@/components/investment-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Smart Fund Management</h1>
          <p className="mt-3 text-xl text-gray-600">
            Enter your investment amount and let our AI suggest the best allocation strategies
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <InvestmentForm />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Our AI considers multiple factors, including risk level, diversification strategies, and potential returns.
          </p>
        </div>
      </div>
    </main>
  )
}

