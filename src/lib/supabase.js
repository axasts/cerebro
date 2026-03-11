import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rbbibffzuiutqamlxdcq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYmliZmZ6dWl1dHFhbWx4ZGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjczNDUsImV4cCI6MjA4NzQ0MzM0NX0.aZCtoTU6ENy2w_GtczWO22DbjCukQJADD7BWFmB8tcE'

export const supabase = createClient(supabaseUrl, supabaseKey)