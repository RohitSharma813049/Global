const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const id = '0a46090b-afd7-4386-8c47-42e71b5b35ae';
  const { data, error } = await supabase
    .from('scholars')
    .select('*, users(*)')
    .or(`id.eq.${id},user_id.eq.${id}`)
    .single();
  console.log("Data:", data);
  console.log("Error:", error);
}

main();
