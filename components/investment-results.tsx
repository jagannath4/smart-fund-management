"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InvestmentAllocation, RiskProfile } from "@/lib/types"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import {
  calculateAssetData,
  calculatePortfolioReturn,
  calculatePortfolioRisk,
  projectPortfolioGrowth,
} from "@/lib/calculate-investments"

interface InvestmentResultsProps {
  allocation: InvestmentAllocation
  amount: number
  riskProfile: RiskProfile
}

export function InvestmentResults({ allocation, amount, riskProfile }: InvestmentResultsProps) {
  const assetData = calculateAssetData(amount, riskProfile)
  const portfolioReturn = calculatePortfolioReturn(assetData)
  const portfolioRisk = calculatePortfolioRisk(assetData)
  const projection = projectPortfolioGrowth(amount, portfolioReturn)

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#A4DE6C",
    "#D0ED57",
    "#FFC658",
    "#FF6B6B",
    "#4ECDC4",
    "#C7F464",
    "#FF9F1C",
    "#2EC4B6",
    "#E71D36",
  ]

  const riskProfileDescriptions = {
    conservative: "This conservative allocation prioritizes capital preservation with steady, modest returns.",
    balanced: "This balanced approach aims for moderate growth while managing volatility.",
    aggressive: "This aggressive strategy focuses on maximizing growth potential with higher risk tolerance.",
  }

  // Calculate 5-year and 10-year projections
  const fiveYearValue = projection.values[5]
  const tenYearValue = projection.values[10]
  const twentyYearValue = projection.values[20]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Your Investment Allocation</h2>
      <p className="text-center text-gray-600">{riskProfileDescriptions[riskProfile]}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Total Investment</div>
                  <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Expected Annual Return</div>
                  <div className="text-2xl font-bold text-emerald-600">{portfolioReturn.toFixed(2)}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Risk Level</div>
                  <div className="text-2xl font-bold">{portfolioRisk}/10</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Asset Classes</div>
                  <div className="text-2xl font-bold">{Object.keys(allocation).length}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Projected Growth</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">5 Years</div>
                    <div className="font-bold">{formatCurrency(fiveYearValue)}</div>
                    <div className="text-xs text-emerald-600">+{((fiveYearValue / amount - 1) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">10 Years</div>
                    <div className="font-bold">{formatCurrency(tenYearValue)}</div>
                    <div className="text-xs text-emerald-600">+{((tenYearValue / amount - 1) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">20 Years</div>
                    <div className="font-bold">{formatCurrency(twentyYearValue)}</div>
                    <div className="text-xs text-emerald-600">
                      +{((twentyYearValue / amount - 1) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allocation Chart</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percentage }) => `${percentage}%`}
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(name) => `${name}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
          <TabsTrigger value="returns">Returns Analysis</TabsTrigger>
          <TabsTrigger value="projection">Growth Projection</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Investment Breakdown</CardTitle>
              <CardDescription>Detailed allocation of your investment across asset classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Asset Class</th>
                      <th className="text-right py-2">Allocation</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Expected Return</th>
                      <th className="text-right py-2">Annual Yield</th>
                      <th className="text-right py-2">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetData.map((asset, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {asset.name}
                          </div>
                        </td>
                        <td className="text-right">{asset.percentage}%</td>
                        <td className="text-right">{formatCurrency(asset.value)}</td>
                        <td className="text-right text-emerald-600">{asset.expectedReturn.toFixed(1)}%</td>
                        <td className="text-right text-emerald-600">
                          {formatCurrency((asset.value * asset.expectedReturn) / 100)}
                        </td>
                        <td className="text-right">{asset.risk}/10</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-gray-50">
                      <td className="py-3">Total Portfolio</td>
                      <td className="text-right">100%</td>
                      <td className="text-right">{formatCurrency(amount)}</td>
                      <td className="text-right text-emerald-600">{portfolioReturn.toFixed(2)}%</td>
                      <td className="text-right text-emerald-600">
                        {formatCurrency((amount * portfolioReturn) / 100)}
                      </td>
                      <td className="text-right">{portfolioRisk}/10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>Returns Analysis</CardTitle>
              <CardDescription>Expected returns by asset class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Expected Return (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value: any) => [`${value}%`, "Expected Return"]} />
                    <Bar dataKey="expectedReturn" name="Expected Annual Return">
                      {assetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Return vs. Risk Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This chart shows the relationship between expected returns and risk levels for each asset class.
                </p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="risk" name="Risk Level (1-10)" fill="#ff8042" />
                      <Bar dataKey="expectedReturn" name="Expected Return (%)" fill="#0088fe" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projection">
          <Card>
            <CardHeader>
              <CardTitle>Growth Projection</CardTitle>
              <CardDescription>Estimated growth of your investment over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={projection.years.map((year, index) => ({
                      year,
                      value: projection.values[index],
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -5 }} />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      label={{ value: "Portfolio Value", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Projected Value"]}
                      labelFormatter={(year) => `Year ${year}`}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Projection Details</h3>
                <p className="text-sm text-gray-600">
                  This projection is based on an average annual return of {portfolioReturn.toFixed(2)}% for your{" "}
                  {riskProfile} portfolio. The calculation assumes a constant return rate and no additional
                  contributions or withdrawals.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Initial Investment</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">After 10 Years</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{formatCurrency(tenYearValue)}</div>
                      <div className="text-sm text-emerald-600">
                        +{formatCurrency(tenYearValue - amount)} ({((tenYearValue / amount - 1) * 100).toFixed(1)}%)
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">After 20 Years</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{formatCurrency(twentyYearValue)}</div>
                      <div className="text-sm text-emerald-600">
                        +{formatCurrency(twentyYearValue - amount)} ({((twentyYearValue / amount - 1) * 100).toFixed(1)}
                        %)
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Investment Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Based on your {riskProfile} risk profile and investment amount of {formatCurrency(amount)}, our AI has
              generated a personalized investment strategy designed to optimize your returns while aligning with your
              risk tolerance.
            </p>

            <p>
              Your portfolio has an expected annual return of{" "}
              <span className="font-bold text-emerald-600">{portfolioReturn.toFixed(2)}%</span> with a risk level of{" "}
              <span className="font-bold">{portfolioRisk}/10</span>. This means you can expect to earn approximately
              <span className="font-bold text-emerald-600"> {formatCurrency((amount * portfolioReturn) / 100)}</span>{" "}
              per year on average.
            </p>

            {riskProfile === "conservative" && (
              <p>
                This conservative allocation emphasizes stability with a higher percentage in bonds and low-risk assets.
                While the growth potential is more modest, this approach provides better protection against market
                volatility and is suitable for investors with a shorter time horizon or lower risk tolerance.
              </p>
            )}

            {riskProfile === "balanced" && (
              <p>
                Your balanced portfolio provides a good mix of growth potential and stability. The diversification
                across different asset classes helps manage risk while still positioning you to benefit from market
                growth. This approach is suitable for medium-term investment horizons of 5-10 years.
              </p>
            )}

            {riskProfile === "aggressive" && (
              <p>
                This aggressive allocation maximizes your growth potential with a higher concentration in stocks and
                alternative investments. While this approach carries more volatility, it offers the highest potential
                returns over the long term. This strategy is best suited for investors with a long time horizon (10+
                years) and high risk tolerance.
              </p>
            )}

            <p>
              Remember that all investments carry risk, and past performance is not indicative of future results.
              Consider consulting with a financial advisor before making investment decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

