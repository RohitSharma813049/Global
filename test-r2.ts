import { uploadFileToR2 } from './lib/r2.ts';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const buffer = Buffer.from('test');
  try {
    const url = await uploadFileToR2(buffer, 'test.txt', 'test', 'text/plain');
    console.log("Success URL:", url);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
