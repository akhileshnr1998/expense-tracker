import { useMemo, useState } from 'react';
import Select from './Select';
import DatePicker from './DatePicker';

function getLocalDateString(date = new Date()) {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

const initialState = {
  amount: '',
  currency: 'INR',
  category_id: '',
  description: '',
  spent_at: getLocalDateString(),
};

export default function ExpenseForm({ categories, onAddExpense }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const isValid = useMemo(() => {
    return Number(form.amount) > 0 && form.spent_at;
  }, [form.amount, form.spent_at]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;

    setFormError('');
    setLoading(true);
    try {
      await onAddExpense({
        amount: Number(form.amount),
        currency: form.currency,
        category_id: form.category_id || null,
        description: form.description,
        spent_at: form.spent_at,
      });
      setForm((prev) => ({ ...prev, amount: '', description: '' }));
    } catch (error) {
      setFormError(error.message || 'Failed to add expense.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="card">
      <div className="card-header">
        <h2>Add expense</h2>
        <p>Capture any spend as it happens.</p>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Amount
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </label>
        <label>
          Currency
          <input
            type="text"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          />
        </label>
        <Select
          label="Category"
          value={form.category_id}
          onChange={(nextValue) => setForm((prev) => ({ ...prev, category_id: nextValue }))}
          placeholder="Uncategorized"
          options={[
            { value: '', label: 'Uncategorized' },
            ...categories.map((category) => ({
              value: category.id,
              label: category.name,
              color: category.color,
            })),
          ]}
        />
        <DatePicker
          label="Spent on"
          value={form.spent_at}
          onChange={(nextValue) => setForm((prev) => ({ ...prev, spent_at: nextValue }))}
        />
        <label className="full">
          Description
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Lunch, taxi, subscription..."
          />
        </label>
        <div className="form-actions full">
          <button className="button primary" type="submit" disabled={!isValid || loading}>
            {loading ? 'Saving...' : 'Add expense'}
          </button>
        </div>
        {formError ? <p className="form-error full">{formError}</p> : null}
      </form>

    </div>
  );
}
