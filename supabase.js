// supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jssaibrzqzclidtipzdd.supabase.co'; // ⬅️ Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc2FpYnJ6cXpjbGlkdGlwemRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODQzOTMsImV4cCI6MjA2MzM2MDM5M30.rSTsKg8Fmwj-s7cyjHjIgo94p7p_SQjHfIzUK18sb2c'; // ⬅️ Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
