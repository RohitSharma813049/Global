import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: "ALTER TABLE publications ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;"
  });
  
  if (error) {
    console.log("Supabase RPC missing. Using Prisma instead.");
  } else {
    console.log("Success:", data);
  }
}

main();
