import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YnZmeXVmcHlhaWdlZ3l0aWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTkzNjEsImV4cCI6MjEwMDM3NTM2MX0.VJEN1zsTsvwkFXJUMXRaYOmEd1gOMZnFkDG89cV35jU';

export const supabase = createClient(
  supabaseUrl || 'https://uxbvfyufpyaigegytigk.supabase.co',
  supabaseAnonKey || DEFAULT_ANON_KEY
);

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://tasksphere-backend-m0e7.onrender.com';
