const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // Add deleted_at to magazines
    const query = `
      ALTER TABLE public.magazines ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ(6);
    `;
    
    await client.query(query);
    console.log("Successfully added deleted_at to magazines.");

  } catch (error) {
    console.error("Error updating schema:", error);
  } finally {
    await client.end();
  }
}

main();
