export default function ExpenseList({ expenses, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Recent expenses</h2>
        <p>Track what you have spent so far.</p>
      </div>
      {expenses.length === 0 ? (
        <p className="empty-state">No expenses yet. Add your first one.</p>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-row">
              <div>
                <p className="expense-title">{expense.description || 'Untitled expense'}</p>
                <p className="expense-meta">
                  <span
                    className="category-dot"
                    style={{ backgroundColor: expense.categories?.color || '#c3b7a8' }}
                  />
                  {expense.categories?.name || 'Uncategorized'} · {expense.spent_at}
                </p>
              </div>
              <div className="expense-actions">
                <span className="amount">
                  {expense.currency} {Number(expense.amount).toFixed(2)}
                </span>
                <button
                  className="button ghost"
                  type="button"
                  onClick={() => onDelete(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
