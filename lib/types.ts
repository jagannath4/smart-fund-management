export type RiskProfile = "conservative" | "balanced" | "aggressive"

export interface InvestmentAllocation {
  [key: string]: number // Asset name: percentage
}

export interface AssetData {
  name: string
  percentage: number
  expectedReturn: number // Annual expected return percentage
  risk: number // Risk level 1-10
  value: number // Calculated monetary value
}

export interface PortfolioProjection {
  years: number[]
  values: number[]
}

