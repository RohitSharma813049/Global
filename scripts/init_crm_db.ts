import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();

  console.log("Creating CRM tables...");

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.crm_leads (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      status TEXT DEFAULT 'open' NOT NULL,
      source TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.crm_properties (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT,
      location TEXT,
      price FLOAT,
      status TEXT DEFAULT 'active' NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.crm_projects (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      status TEXT DEFAULT 'active' NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.crm_activities (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'pending' NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      comment TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.crm_bookings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
      property_id UUID NOT NULL REFERENCES public.crm_properties(id) ON DELETE CASCADE,
      amount FLOAT NOT NULL,
      status TEXT DEFAULT 'pending' NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  console.log("CRM tables created successfully!");

  // Insert dummy data for testing the dashboard
  console.log("Inserting dummy data...");
  const leadRes = await client.query(`
    INSERT INTO public.crm_leads (name, email, phone, status, source)
    VALUES ('Darpann Admin (Dummy)', 'admin@example.com', '555-0000', 'open', 'Facebook')
    RETURNING id;
  `);

  const propertyRes = await client.query(`
    INSERT INTO public.crm_properties (title, type, location, price, status)
    VALUES ('Luxury Villa Gurgaon', 'Villa', 'Gurgaon', 1500000, 'active')
    RETURNING id;
  `);

  if (leadRes.rows[0] && propertyRes.rows[0]) {
    await client.query(`
      INSERT INTO public.crm_activities (lead_id, type, status, date, comment)
      VALUES ($1, 'meeting', 'pending', now() + interval '2 days', 'Discussing villa options');
    `, [leadRes.rows[0].id]);
    console.log("Dummy data inserted.");
  }

  await client.end();
}

main().catch(console.error);
