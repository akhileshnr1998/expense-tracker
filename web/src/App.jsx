import { useEffect, useState } from 'react';
import { supabase } from './superbaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) {
      console.error('Failed to fetch expenses:', error.message);
      setExpenses([]);
      return;
    }
    setExpenses(data ?? []);
  }

  // Simple analytics: Total by category
  const chartData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += Number(curr.amount);
    else acc.push({ name: curr.category, value: Number(curr.amount) });
    return acc;
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Expense Tracker</h1>
      {/* Simple Bar Chart for Analytics */}
      <BarChart width={350} height={200} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
      
      {/* Add your List and Input Form components here */}
    </div>
  );
}

export default App;
