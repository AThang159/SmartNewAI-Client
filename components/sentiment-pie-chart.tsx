"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type SentimentPieChartProps = {
  pos: number;
  neg: number;
  neu: number;
};

const COLORS = ["#22c55e", "#ef4444", "#9ca3af"]; // Xanh lá, đỏ, xám

export default function SentimentPieChart({ pos, neg, neu }: SentimentPieChartProps) {
  const data = [
    { name: "Tích cực", value: pos, color: COLORS[0] },
    { name: "Tiêu cực", value: neg, color: COLORS[1] },
    { name: "Trung lập", value: neu, color: COLORS[2] },
  ];

  return (
    <div className="flex flex-col w-full p-2 bg-white">
      {/* Biểu đồ */}
      <div className="flex justify-center">
        <div className="w-[250px] h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend — căn trái */}
      <div className="mt-4 flex flex-col items-start space-y-1 text-sm pl-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span
              className="font-medium"
              style={{ color: item.color }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
