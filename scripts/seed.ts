import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://smqlnrkhyhnrklqblmyz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log('Seeding users...');

  // 1. Create a super_admin
  const { data: superAdmin, error: superAdminErr } = await supabase.auth.admin.createUser({
    email: "superadmin_test_123@gmail.com",
    password: "password123",
    email_confirm: true,
    user_metadata: { name: "System Super Admin", role: "super_admin" }
  });

  if (superAdminErr) {
    console.error("Failed to create super_admin:", superAdminErr.message);
  } else {
    console.log("Created Super Admin:", superAdmin?.user?.email);
  }

  // 2. Create a standard admin
  const dummyUsers = [
    { name: 'John Doe', email: 'john_test_123@gmail.com', password: 'password123', role: 'user' },
    { name: 'Jane Smith', email: 'jane_test_123@gmail.com', password: 'password123', role: 'user' },
  ];

  for (const user of dummyUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        role: user.role,
      },
    });

    if (error) {
      console.error(`Failed to seed user ${user.email}:`, error.message);
    } else {
      console.log(`Successfully seeded user: ${user.email}`);
    }
  }

  console.log('Seeding categories...');
  const mainCategories = [
    { name: 'Engineering', slug: 'engineering' },
    { name: 'Medical Sciences', slug: 'medical-sciences' },
    { name: 'Computer Science', slug: 'computer-science' }
  ];

  for (const cat of mainCategories) {
    const { data: insertedCat, error: catError } = await supabase
      .from('categories')
      .insert({ name: cat.name, slug: cat.slug })
      .select()
      .single();

    if (catError) {
      console.error(`Failed to insert category ${cat.name}:`, catError.message);
    } else if (insertedCat) {
      console.log(`Inserted category: ${cat.name}`);
      
      // Add a subcategory for each
      const subName = `${cat.name} Sub-field`;
      const subSlug = `${cat.slug}-sub`;
      await supabase.from('categories').insert({
        name: subName,
        slug: subSlug,
        parent_id: insertedCat.id
      });
    }
  }

  console.log('Seeding completed.');
}

seed();
