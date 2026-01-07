import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import CategoryPie from '../components/charts/CategoryPie';
import MonthlyBar from '../components/charts/MonthlyBar';
import { listCategories, listExpenses } from '../api/expenses';
import { getCustomRange, getRange } from '../lib/dateRange';
import { attachCategory } from '../lib/categoryMap';

function groupByCategory(expenses) {
  const totals = new Map();
  expenses.forEach((expense) => {
    const name = expense.categories?.name || 'Uncategorized';
    totals.set(name, (totals.get(name) || 0) + Number(expense.amount || 0));
  });
  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}

function groupByMonth(expenses) {
  const totals = new Map();
  expenses.forEach((expense) => {
    const monthKey = expense.spent_at.slice(0, 7);
    totals.set(monthKey, (totals.get(monthKey) || 0) + Number(expense.amount || 0));
  });
  return Array.from(totals.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, value]) => ({ month, value }));
}

export default function Analytics() {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [rangeType, setRangeType] = useState('monthly');
  const [customFrom, setCustomFrom] = useState(thirtyDaysAgo);
  const [customTo, setCustomTo] = useState(today);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const range = useMemo(() => {
    if (rangeType === 'custom') {
      return getCustomRange(customFrom, customTo);
    }
    return getRange(rangeType);
  }, [rangeType, customFrom, customTo]);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      setLoading(true);
      try {
        const [expensesData, categoriesData] = await Promise.all([
          listExpenses(range),
          listCategories(),
        ]);
        const data = attachCategory(expensesData, categoriesData);
        if (isMounted) {
          setExpenses(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, [range.from, range.to]);

  const total = expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const categoryData = useMemo(() => groupByCategory(expenses), [expenses]);
  const monthlyData = useMemo(() => groupByMonth(expenses), [expenses]);
  const topExpenses = useMemo(
    () => [...expenses]
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 8),
    [expenses],
  );

  return (
    <AppLayout title="Analytics overview">
      <section className="filter-bar">
        <div>
          <h2>Filters</h2>
          <p>Select a range to analyze spending.</p>
        </div>
        <div className="filter-controls">
          <select value={rangeType} onChange={(event) => setRangeType(event.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
          {rangeType === 'custom' ? (
            <div className="custom-range">
              <label>
                From
                <input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} />
              </label>
              <label>
                To
                <input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} />
              </label>
            </div>
          ) : null}
        </div>
      </section>

      {loading ? (
        <div className="page-center">Crunching your numbers...</div>
      ) : (
        <>
          <section className="grid-3">
            <div className="card highlight">
              <h2>{total.toFixed(2)}</h2>
              <p>Total spent in this range</p>
            </div>
            <div className="card">
              <h2>{expenses.length}</h2>
              <p>Transactions captured</p>
            </div>
            <div className="card">
              <h2>{categoryData.length}</h2>
              <p>Categories used</p>
            </div>
          </section>

          <section className="grid-2">
            <CategoryPie data={categoryData} />
            <MonthlyBar data={monthlyData} />
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Top expenses</h2>
              <p>Highest transactions in this range.</p>
            </div>
            {topExpenses.length === 0 ? (
              <p className="empty-state">No expenses in this period.</p>
            ) : (
              <div className="expense-list">
                {topExpenses.map((expense) => (
                  <div key={expense.id} className="expense-row">
                    <div>
                      <p className="expense-title">{expense.description || 'Untitled expense'}</p>
                      <p className="expense-meta">
                        {expense.categories?.name || 'Uncategorized'} · {expense.spent_at}
                      </p>
                    </div>
                    <div className="expense-actions">
                      <span className="amount">
                        {expense.currency} {Number(expense.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </AppLayout>
  );
}
