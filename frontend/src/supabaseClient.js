import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://horsnrkhfjxsniaddbox.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcnNucmtoZmp4c25pYWRkYm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzkxMDYsImV4cCI6MjA2ODMxNTEwNn0.oj1BLzaa89DTlGwYfB2keQDT-_eggQ-HYBvR6jlwglQ'
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }
