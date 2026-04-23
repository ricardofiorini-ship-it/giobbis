import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://docbrjtjdduowprwpofo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvY2JyanRqZGR1b3dwcndwb2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NzI3NjksImV4cCI6MjA5MjU0ODc2OX0.4Ei276GF-YJYXUgWq6YOdOdNzLvXOIdvq0RDkRIGWkg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
