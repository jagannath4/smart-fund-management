import type { RiskProfile, InvestmentAllocation, AssetData, PortfolioProjection } from "./types"

// Asset class expected returns and risk levels
const assetClasses = {
  "Government Bonds": { returnRange: [1.5, 2.5, 3.5], risk: 2 },
  "Corporate Bonds": { returnRange: [3.0, 4.0, 5.0], risk: 3 },
  "Large Cap Stocks": { returnRange: [5.0, 7.0, 9.0], risk: 5 },
  "Mid Cap Stocks": { returnRange: [6.0, 8.0, 10.0], risk: 6 },
  "Small Cap Stocks": { returnRange: [7.0, 9.0, 12.0], risk: 7 },
  "International Stocks": { returnRange: [5.5, 7.5, 10.5], risk: 6 },
  "Emerging Markets": { returnRange: [7.0, 9.0, 13.0], risk: 8 },
  "Real Estate": { returnRange: [4.0, 6.0, 8.0], risk: 6 },
  Commodities: { returnRange: [3.0, 5.0, 8.0], risk: 7 },
  Cash: { returnRange: [0.5, 1.0, 1.5], risk: 1 },
  "High-Yield Bonds": { returnRange: [4.0, 5.5, 7.0], risk: 4 },
  "Treasury Inflation-Protected Securities": { returnRange: [1.0, 2.0, 3.0], risk: 2 },
}

export function calculateInvestments(amount: number, riskProfile: RiskProfile): InvestmentAllocation {
  switch (riskProfile) {
    case "conservative":
      return {
        "Government Bonds": 30,
        "Corporate Bonds": 20,
        "Large Cap Stocks": 15,
        "International Stocks": 10,
        "Treasury Inflation-Protected Securities": 15,
        Cash: 10,
      }

    case "balanced":
      return {
        "Government Bonds": 15,
        "Corporate Bonds": 15,
        "Large Cap Stocks": 25,
        "Mid Cap Stocks": 10,
        "International Stocks": 15,
        "Real Estate": 10,
        "High-Yield Bonds": 10,
      }

    case "aggressive":
      return {
        "Corporate Bonds": 10,
        "Large Cap Stocks": 25,
        "Mid Cap Stocks": 15,
        "Small Cap Stocks": 15,
        "International Stocks": 15,
        "Emerging Markets": 10,
        "Real Estate": 10,
      }

    default:
      return {
        "Government Bonds": 15,
        "Corporate Bonds": 15,
        "Large Cap Stocks": 25,
        "Mid Cap Stocks": 10,
        "International Stocks": 15,
        "Real Estate": 10,
        "High-Yield Bonds": 10,
      }
  }
}

export function calculateAssetData(amount: number, riskProfile: RiskProfile): AssetData[] {
  const allocation = calculateInvestments(amount, riskProfile)
  const riskIndex = riskProfile === "conservative" ? 0 : riskProfile === "balanced" ? 1 : 2

  return Object.entries(allocation).map(([name, percentage]) => {
    const value = (percentage * amount) / 100
    const assetClass = assetClasses[name as keyof typeof assetClasses]
    const expectedReturn = assetClass ? assetClass.returnRange[riskIndex] : 5.0
    const risk = assetClass ? assetClass.risk : 5

    return {
      name,
      percentage,
      value,
      expectedReturn,
      risk,
    }
  })
}

export function calculatePortfolioReturn(assetData: AssetData[]): number {
  const totalValue = assetData.reduce((sum, asset) => sum + asset.value, 0)
  const weightedReturn = assetData.reduce((sum, asset) => {
    return sum + (asset.value / totalValue) * asset.expectedReturn
  }, 0)

  return weightedReturn
}

export function calculatePortfolioRisk(assetData: AssetData[]): number {
  const totalValue = assetData.reduce((sum, asset) => sum + asset.value, 0)
  const weightedRisk = assetData.reduce((sum, asset) => {
    return sum + (asset.value / totalValue) * asset.risk
  }, 0)

  return Math.round(weightedRisk * 10) / 10
}

export function projectPortfolioGrowth(amount: number, annualReturn: number, years = 20): PortfolioProjection {
  const yearValues: number[] = []
  const yearLabels: number[] = []

  let currentValue = amount
  for (let i = 0; i <= years; i++) {
    yearLabels.push(i)
    yearValues.push(Math.round(currentValue))
    currentValue *= 1 + annualReturn / 100
  }

  return {
    years: yearLabels,
    values: yearValues,
  }
}

