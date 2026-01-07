import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#153f6b', '#2f855a', '#a23e2a', '#7c3aed', '#a16207', '#0f766e'];

export default function CategoryPie({ data }) {
  if (!data.length) {
    return <p className="empty-state">No category data for this range.</p>;
  }

  return (
    <div className="chart-card">
      <h3>Category split</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
