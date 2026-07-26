import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  await client.connect();
  
  try {
    await client.query("ALTER TABLE publications ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;");
    console.log("Column is_featured added successfully.");
  } catch (err) {
    console.error("Error adding column:", err);
  } finally {
    await client.end();
  }
}

main();
