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

  // 1. Create a super_admin
  const { data: superAdmin, error: superAdminErr } = await supabase.auth.admin.createUser({
    email: "superadmin@example.com",
    password: "password123",
    email_confirm: true,
    user_metadata: { name: "System Super Admin", role: "super_admin" }
  });

  if (superAdminErr) {
    console.error("Failed to create super_admin:", superAdminErr.message);
  } else {
    console.log("Created Super Admin:", superAdmin?.user.email);
  }

  // 2. Create a standard admin
  const dummyUsers = [
    { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'user' },
  ];

  for (const user of dummyUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
          role: user.role,
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
