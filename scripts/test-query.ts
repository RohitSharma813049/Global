import 'dotenv/config'
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data, error } = await supabaseAdmin
      .from('publications')
      .select(`
        *,
        scholars (
          users (
            raw_user_meta_data
          )
        )
      `)
      .limit(1)

  console.log("Error:", error)
  console.log("Data:", JSON.stringify(data, null, 2))
}

run()
