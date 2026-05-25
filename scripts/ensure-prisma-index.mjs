import fs from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'lib', 'generated', 'prisma', 'index.ts');
const content = "export * from './client';\n";

if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, content);
  console.log('Created lib/generated/prisma/index.ts');
}
