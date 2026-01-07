import { listExpenses } from './expenses';

function sumAmount(items) {
  return items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
}

export async function categoryTotals({ from, to }) {
  const expenses = await listExpenses({ from, to });
  const totals = new Map();

  expenses.forEach((expense) => {
    const name = expense.categories?.name || 'Uncategorized';
    const current = totals.get(name) || 0;
    totals.set(name, current + Number(expense.amount || 0));
  });

  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}

export async function monthlyTotals({ from, to }) {
  const expenses = await listExpenses({ from, to });
  const totals = new Map();

  expenses.forEach((expense) => {
    const monthKey = expense.spent_at.slice(0, 7);
    const current = totals.get(monthKey) || 0;
    totals.set(monthKey, current + Number(expense.amount || 0));
  });

  return Array.from(totals.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, value]) => ({ month, value }));
}

export async function topExpenses({ from, to, limit = 8 }) {
  const expenses = await listExpenses({ from, to });
  const sorted = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount));

  return sorted.slice(0, limit).map((expense) => ({
    id: expense.id,
    amount: Number(expense.amount || 0),
    description: expense.description,
    spent_at: expense.spent_at,
    category: expense.categories?.name || 'Uncategorized',
  }));
}

export function totalForRange(expenses) {
  return sumAmount(expenses);
}
