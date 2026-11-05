#!/usr/bin/env node
/**
 * Environment Validation Script — The Bike Yard
 *
 * Validates that all required environment variables are present and
 * have safe placeholder values replaced. Does NOT print secret values.
 *
 * Usage: node scripts/validate-env.js
 * Exit code 0 = all required vars present
 * Exit code 1 = missing or unsafe required vars
 */

const REQUIRED_VARS = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];

const OPTIONAL_VARS = [
  'BASE_URL',
  'STORAGE_PROVIDER',
  'S3_BUCKET_NAME',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'AI_PROVIDER',
  'AI_API_KEY',
  'PAYMENT_PROVIDER',
  'NEXT_PUBLIC_BASE_URL',
  // Motorcycle Data Integration Engine
  'CRON_SECRET',
  'BIKE_PROVIDER_MOCK_ENABLED',
  'BIKEWALE_API_BASE_URL',
  'BIKEWALE_API_KEY',
  'BIKEWALE_API_CATALOG_PATH',
];

const PLACEHOLDER_PATTERNS = [
  'your-nextauth-secret-here',
  'USER:PASSWORD@HOST:PORT',
  'postgresql://USER:PASSWORD@HOST:PORT/DATABASE',
  'sk-test-key-do-not-use-in-production',
  'minioadmin',
  'bikeyard-dev',
];

let errors = 0;
let warnings = 0;

function isPlaceholder(value) {
  return PLACEHOLDER_PATTERNS.some((p) => value.includes(p));
}

console.log('=== Environment Validation ===\n');

// Check required variables
console.log('Required variables:');
for (const varName of REQUIRED_VARS) {
  const value = process.env[varName];
  if (!value) {
    console.error(`  [MISSING] ${varName} — required but not set`);
    errors += 1;
  } else if (isPlaceholder(value)) {
    console.error(`  [UNSAFE]  ${varName} — still contains placeholder value`);
    errors += 1;
  } else {
    console.log(`  [OK]      ${varName} — set (value hidden)`);
  }
}

// Check optional variables
console.log('\nOptional variables:');
for (const varName of OPTIONAL_VARS) {
  const value = process.env[varName];
  if (!value) {
    console.log(`  [INFO]    ${varName} — not set (optional)`);
    warnings += 1;
  } else if (isPlaceholder(value)) {
    console.warn(`  [WARN]    ${varName} — still contains placeholder value`);
    warnings += 1;
  } else {
    console.log(`  [OK]      ${varName} — set (value hidden)`);
  }
}

console.log('\n=== Summary ===');
console.log(`Errors:   ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.error('\n❌ Environment validation FAILED — fix errors before deployment');
  process.exit(1);
} else {
  console.log('\n✅ Environment validation PASSED');
  if (warnings > 0) {
    console.warn(`   (${warnings} optional warning(s) — review before production)`);
  }
  process.exit(0);
}
