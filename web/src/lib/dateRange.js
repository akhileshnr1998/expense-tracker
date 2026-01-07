function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getRange(type, now = new Date()) {
  const start = new Date(now);
  const end = new Date(now);

  if (type === 'daily') {
    return { from: formatDate(start), to: formatDate(end) };
  }

  if (type === 'weekly') {
    start.setDate(start.getDate() - 6);
    return { from: formatDate(start), to: formatDate(end) };
  }

  if (type === 'monthly') {
    start.setDate(1);
    return { from: formatDate(start), to: formatDate(end) };
  }

  if (type === 'yearly') {
    start.setMonth(0, 1);
    return { from: formatDate(start), to: formatDate(end) };
  }

  return { from: formatDate(start), to: formatDate(end) };
}

export function getCustomRange(from, to) {
  return { from, to };
}
