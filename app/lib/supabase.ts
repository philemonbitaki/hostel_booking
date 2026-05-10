import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://cyumpqeujvwskrploapo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dW1wcWV1anZ3c2tycGxvYXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzE4OTQsImV4cCI6MjA5MjYwNzg5NH0.cI49k3BfrAhqnsDZF5mJkhHNc0UPOs7ZE7lF1ey4YTU"
)