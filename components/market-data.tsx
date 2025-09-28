"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface MarketDataItem {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
  isPositive: boolean
}

const marketData: MarketDataItem[] = [
  {
    symbol: "SPX",
    name: "S&P 500",
    price: "6,606.76",
    change: "+16.52",
    changePercent: "+0.25%",
    isPositive: true,
  },
  {
    symbol: "IXIC",
    name: "NASDAQ",
    price: "22,333.96",
    change: "+45.12",
    changePercent: "+0.20%",
    isPositive: true,
  },
  {
    symbol: "DJI",
    name: "Dow Jones",
    price: "45,870.24",
    change: "+114.75",
    changePercent: "+0.25%",
    isPositive: true,
  },
  {
    symbol: "FTSE",
    name: "FTSE 100",
    price: "8,245.32",
    change: "-12.45",
    changePercent: "-0.15%",
    isPositive: false,
  },
  {
    symbol: "DAX",
    name: "DAX",
    price: "19,456.78",
    change: "+23.67",
    changePercent: "+0.12%",
    isPositive: true,
  },
]

export function MarketData() {
  return (
    <section className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Markets</h2>
          <span className="text-sm text-muted-foreground">Live data • Updated continuously</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {marketData.map((item) => {
            const changeClasses = item.isPositive
              ? "text-sm font-medium text-green-600"
              : "text-sm font-medium text-red-600"

            return (
              <div
                key={item.symbol}
                className="bg-background rounded-lg p-4 border border-border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{item.symbol}</span>
                  {item.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-foreground">{item.price}</div>
                  <div className="text-sm text-muted-foreground">{item.name}</div>
                  <div className={changeClasses}>
                    {item.change} ({item.changePercent})
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
