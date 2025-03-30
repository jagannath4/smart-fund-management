"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InvestmentResults } from "@/components/investment-results"
import { calculateInvestments } from "@/lib/calculate-investments"
import type { RiskProfile, InvestmentAllocation } from "@/lib/types"

export function InvestmentForm() {
  const [amount, setAmount] = useState<string>("")
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("balanced")
  const [allocation, setAllocation] = useState<InvestmentAllocation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid investment amount")
      return
    }

    setError(null)
    const investmentAmount = Number.parseFloat(amount)
    const result = calculateInvestments(investmentAmount, riskProfile)
    setAllocation(result)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Investment Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            step="any"
            placeholder="Enter your investment amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="space-y-3">
          <Label>Risk Profile</Label>
          <RadioGroup
            value={riskProfile}
            onValueChange={(value) => setRiskProfile(value as RiskProfile)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="conservative" id="conservative" />
              <Label htmlFor="conservative" className="cursor-pointer font-medium">
                Conservative
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="cursor-pointer font-medium">
                Balanced
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="aggressive" id="aggressive" />
              <Label htmlFor="aggressive" className="cursor-pointer font-medium">
                Aggressive
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full py-6 text-lg">
          Analyze Investment
        </Button>
      </form>

      {allocation && (
        <div className="mt-8">
          <InvestmentResults allocation={allocation} amount={Number.parseFloat(amount)} riskProfile={riskProfile} />
        </div>
      )}
    </div>
  )
}

