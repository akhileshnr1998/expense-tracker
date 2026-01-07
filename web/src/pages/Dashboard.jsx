import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ExpenseForm from '../components/forms/ExpenseForm';
import ExpenseList from '../components/forms/ExpenseList';
import { addExpense, createCategory, deleteExpense, listCategories, listExpenses } from '../api/expenses';
import { getRange } from '../lib/dateRange';

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const range = useMemo(() => getRange('daily'), []);

  async function loadData() {
    setLoading(true);
    try {
      const [categoriesData, expenseData] = await Promise.all([
        listCategories(),
        listExpenses(range),
      ]);
      setCategories(categoriesData);
      setExpenses(expenseData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddExpense(payload) {
    await addExpense(payload);
    await loadData();
  }

  async function handleCreateCategory(payload) {
    await createCategory(payload);
    await loadData();
  }

  async function handleDeleteExpense(id) {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }

  const totalToday = expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);

  return (
    <AppLayout title="Today at a glance">
      <section className="grid-2">
        <div className="card highlight">
          <h2>{totalToday.toFixed(2)}</h2>
          <p>Total spent today ({range.from})</p>
        </div>
        <div className="card">
          <h2>{categories.length}</h2>
          <p>Active categories</p>
        </div>
      </section>

      {loading ? (
        <div className="page-center">Loading your dashboard...</div>
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
