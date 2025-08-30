import { INestApplication } from '@nestjs/common';

export function applyGlobalPrefix(app: INestApplication): void {
  const globalPrefix = process.env.GLOBAL_PREFIX || '';
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
    console.log(`✅ Global prefix set to "/${globalPrefix}"`);
  } else {
    console.log(`ℹ️ No global prefix set`);
  }
}
