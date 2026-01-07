import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ExpenseForm from '../components/forms/ExpenseForm';
import { addExpense, listCategories } from '../api/expenses';

export default function AddExpense() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      setLoading(true);
      setError('');
      try {
        const data = await listCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load categories.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAddExpense(payload) {
    await addExpense(payload);
  }

  return (
    <AppLayout title="Add expense">
      {loading ? (
        <div className="page-center">Loading categories...</div>
      ) : error ? (
        <div className="page-center">{error}</div>
      ) : (
        <section className="grid-2">
          <ExpenseForm categories={categories} onAddExpense={handleAddExpense} />
          <div className="card">
            <div className="card-header">
              <h2>Tips</h2>
              <p>Make every entry count.</p>
            </div>
            <div className="expense-list">
              <p className="expense-meta">Use consistent categories for clean analytics.</p>
              <p className="expense-meta">Add a short description for later recall.</p>
              <p className="expense-meta">Pick the actual spend date for accuracy.</p>
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}
