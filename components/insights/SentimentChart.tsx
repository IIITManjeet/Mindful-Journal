'use client'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface SentimentPoint {
  label: string
  score: number
}

const SentimentChart = ({ data }: { data: SentimentPoint[] }) => {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-ink-soft">
        Write a few entries to see your emotional trend.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C9885" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#7C9885" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D8" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#8A857C', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#EAE3D8' }}
          minTickGap={28}
        />
        <YAxis
          domain={[-10, 10]}
          tick={{ fill: '#8A857C', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={42}
        />
        <ReferenceLine y={0} stroke="#C5D6C7" strokeWidth={1.5} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #EAE3D8',
            background: '#FDFBF8',
            fontSize: 13,
            color: '#33302B',
            boxShadow: '0 4px 20px -6px rgba(80,70,55,0.18)',
          }}
          formatter={(value: any) => [`${value} / 10`, 'Sentiment']}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#647D6E"
          strokeWidth={2.5}
          fill="url(#sentimentFill)"
          dot={{ r: 3, fill: '#647D6E', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default SentimentChart
