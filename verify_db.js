require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log("Checking database at:", supabaseUrl);
  
  // Try to query scholar_applications
  const { data, error } = await supabase.from('scholar_applications').select('id').limit(1);
  
  if (error) {
    console.error("ERROR querying scholar_applications:", error.message);
  } else {
    console.log("SUCCESS: scholar_applications table exists!");
  }
}

checkTables();
