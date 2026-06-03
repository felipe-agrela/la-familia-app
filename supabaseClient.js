import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uqqwcxoyfduznjthgupq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcXdjeG95ZmR1em5qdGhndXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDUxNDgsImV4cCI6MjA5NTkyMTE0OH0._3YPhQgOpSlxjhM-tBsfz7c6vOiQDjLU5mOfg9qCY3Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);