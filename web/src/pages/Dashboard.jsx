import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ExpenseForm from '../components/forms/ExpenseForm';
import ExpenseList from '../components/forms/ExpenseList';
import { addExpense, createCategory, deleteExpense, listCategories, listExpenses } from '../api/expenses';
import { getRange } from '../lib/dateRange';
import { attachCategory } from '../lib/categoryMap';

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const range = useMemo(() => getRange('daily'), []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [categoriesData, expenseData] = await Promise.all([
        listCategories(),
        listExpenses(range),
      ]);
      setCategories(categoriesData);
      setExpenses(attachCategory(expenseData, categoriesData));
    } catch (err) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddExpense(payload) {
    const created = await addExpense(payload);
    setExpenses((prev) => [attachCategory([created], categories)[0], ...prev]);
    return created;
  }

  async function handleCreateCategory(payload) {
    const created = await createCategory(payload);
    setCategories((prev) => {
      const next = [created, ...prev];
      return next.sort((a, b) => a.name.localeCompare(b.name));
    });
    return created;
  }

  async function handleDeleteExpense(id) {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }

  const totalToday = expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);

  function formatDisplayDate(value) {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}-${month}-${year}`;
  }

  return (
    <AppLayout title="Today at a glance">
      <section className="grid-2">
        <div className="card highlight">
          <h2>{totalToday.toFixed(2)}</h2>
          <p>Total spent today ({formatDisplayDate(range.from)})</p>
        </div>
        <div className="card">
          <h2>{categories.length}</h2>
          <p>Active categories</p>
        </div>
      </section>

      {loading ? (
        <div className="page-center">Loading your dashboard...</div>
      ) : error ? (
        <div className="page-center">{error}</div>
      ) : (
        <section className="grid-2">
          <ExpenseForm
            categories={categories}
            onAddExpense={handleAddExpense}
            onCreateCategory={handleCreateCategory}
          />
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        </section>
      )}
    </AppLayout>
  );
}
