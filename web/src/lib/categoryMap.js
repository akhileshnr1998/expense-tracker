export function attachCategory(expenses, categories) {
  const map = new Map(categories.map((category) => [category.id, category]));
  return expenses.map((expense) => ({
    ...expense,
    categories: expense.category_id ? map.get(expense.category_id) : null,
  }));
}
