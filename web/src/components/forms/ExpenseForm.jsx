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

export default function ExpenseForm({ categories, onAddExpense, onCreateCategory }) {
  const [form, setForm] = useState(initialState);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3a6ea5' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState('');

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

  async function handleCreateCategory() {
    if (!newCategory.name.trim()) return;
    setCategoryError('');
    setCategoryLoading(true);
    try {
      const created = await onCreateCategory({
        name: newCategory.name.trim(),
        color: newCategory.color,
      });
      if (created?.id) {
        setForm((prev) => ({ ...prev, category_id: created.id }));
      }
      setNewCategory({ name: '', color: newCategory.color });
    } catch (error) {
      setCategoryError(error.message || 'Failed to add category.');
    } finally {
      setCategoryLoading(false);
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

      <div className="divider" />

      <div className="inline-form">
        <div>
          <h3>Create category</h3>
          <p>Add a quick label for your expenses.</p>
        </div>
        <div className="inline-controls">
          <input
            type="text"
            value={newCategory.name}
            onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })}
            placeholder="e.g. Groceries"
          />
          <input
            type="color"
            value={newCategory.color}
            onChange={(event) => setNewCategory({ ...newCategory, color: event.target.value })}
            aria-label="Category color"
          />
          <button className="button ghost" type="button" onClick={handleCreateCategory}>
            {categoryLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
      {categoryError ? <p className="form-error">{categoryError}</p> : null}
    </div>
  );
}
