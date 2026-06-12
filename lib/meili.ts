import { Meilisearch } from 'meilisearch';

export const meiliClient = new Meilisearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'global_meili_master_key',
});
