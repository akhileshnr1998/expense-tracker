import { useState } from 'react';

export default function CategoryForm({ onCreateCategory }) {
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3a6ea5' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateCategory() {
    if (!newCategory.name.trim()) return;
    setError('');
    setLoading(true);
    try {
      await onCreateCategory({
        name: newCategory.name.trim(),
        color: newCategory.color,
      });
      setNewCategory({ name: '', color: newCategory.color });
    } catch (err) {
      setError(err.message || 'Failed to add category.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Create category</h2>
        <p>Keep your labels tidy and meaningful.</p>
      </div>
      <div className="inline-form">
        <div>
          <h3>New category</h3>
          <p>Assign a name and color.</p>
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
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
