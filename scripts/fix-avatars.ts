import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

async function main() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  
  for (const user of users) {
    let changed = false;
    let meta = user.user_metadata || {};
    
    // Check if they have picture but no avatar_url
    if (meta.picture && !meta.avatar_url) {
      meta.avatar_url = meta.picture;
      changed = true;
    }
    
    // Check if they have image but no avatar_url
    if (meta.image && !meta.avatar_url) {
      meta.avatar_url = meta.image;
      changed = true;
    }

    if (changed) {
      console.log(`Fixing avatar for ${user.email}`);
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: meta
      });
    }
  }
  console.log("Done");
}

main().catch(console.error).finally(() => prisma.$disconnect());
