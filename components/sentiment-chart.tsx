"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"

type SentimentProps = {
  pos: number
  neg: number
  neu: number
}

const COLORS = {
  pos: "#22c55e", // xanh lá
  neg: "#ef4444", // đỏ
  neu: "#6b7280", // xám
}

export function SentimentChart({ pos, neg, neu }: SentimentProps) {
  const total = pos + neg + neu || 1 // tránh chia 0
  const data = [
    { name: "Pos", value: pos, fill: COLORS.pos },
    { name: "Neg", value: neg, fill: COLORS.neg },
    { name: "Neu", value: neu, fill: COLORS.neu },
  ]

  return (
    <div className="w-20 h-28"> 
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, bottom: -10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis hide />
          <Tooltip
            formatter={(val: number) =>
              `${val.toFixed(5)} (${((val / total) * 100).toFixed(1)}%)`
            }
          />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              style={{ fontSize: 10 }}
              formatter={(val: number) => `${((val / total) * 100).toFixed(1)}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
