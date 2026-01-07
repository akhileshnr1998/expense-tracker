import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function MonthlyBar({ data }) {
  if (!data.length) {
    return <p className="empty-state">No monthly totals for this range.</p>;
  }

  return (
    <div className="chart-card">
      <h3>Month-wise totals</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#153f6b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
