import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function check() {
  const { data, error } = await supabase
    .from('publications')
    .select(`*, categories(name)`)
    
  console.log('Error:', error);
  console.log('Publications:', JSON.stringify(data, null, 2));
}

check();
