import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://smqlnrkhyhnrklqblmyz.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
);

async function seed() {
  console.log('Seeding users...');

  const dummyUsers = [
    { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
  ];

  for (const user of dummyUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
        },
      },
    });

    if (error) {
      console.error(`Failed to seed user ${user.email}:`, error.message);
    } else {
      console.log(`Successfully seeded user: ${user.email}`);
    }
  }

  console.log('Seeding completed.');
}

seed();
