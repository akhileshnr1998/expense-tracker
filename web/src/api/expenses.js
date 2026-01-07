import { supabase } from '../lib/supabaseClient';

async function getUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (!data?.user?.id) {
    throw new Error('Not authenticated. Please sign in again.');
  }
  return data.user.id;
}

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
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, color, user_id })
    .select('id, name, color')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addExpense(payload) {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...payload, user_id })
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
    .select('id, amount, currency, description, spent_at, created_at, category_id')
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
