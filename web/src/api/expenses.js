import { supabase } from '../lib/supabaseClient';

export async function listCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, color')
    .order('name');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createCategory({ name, color }) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, color })
    .select('id, name, color')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addExpense(payload) {
  const { data, error } = await supabase
    .from('expenses')
    .insert(payload)
    .select('id, amount, currency, description, spent_at, category_id')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listExpenses({ from, to }) {
  const query = supabase
    .from('expenses')
    .select('id, amount, currency, description, spent_at, created_at, category_id, categories ( id, name, color )')
    .order('spent_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (from) {
    query.gte('spent_at', from);
  }

  if (to) {
    query.lte('spent_at', to);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateExpense(id, payload) {
  const { data, error } = await supabase
    .from('expenses')
    .update(payload)
    .eq('id', id)
    .select('id, amount, currency, description, spent_at, category_id')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteExpense(id) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
