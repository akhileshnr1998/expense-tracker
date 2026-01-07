import { supabase } from '../lib/supabaseClient';

export async function signUp({ email, password, username }) {
  const redirectTo = import.meta.env.VITE_SITE_URL;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  });

  if (error) {
    throw error;
  }

  if (username && data?.user?.id) {
    await supabase.from('profiles').insert({ id: data.user.id, username });
  }

  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}
