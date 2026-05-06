import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const ADMIN_SECRET_KEY = 'dev-admin-key-change-me';
const WORKER_URL = 'http://localhost:3000/api/admin/pipeline/trigger';

async function main() {
  console.log('🚀 Initiating Live Database Transition...\n');

  // 1. Wipe local D1 data instead of deleting the locked file
  console.log('🧹 1. Clearing fake data from tables...');
  try {
    const wipeCommand = `npx wrangler d1 execute grievanceiq-production --local --command="DELETE FROM ministry_stats; DELETE FROM state_grievance_stats; DELETE FROM trending_issues; DELETE FROM social_signals;"`;
    execSync(wipeCommand, { cwd: rootDir, stdio: 'inherit' });
    // Also try to delete monthly_history if it exists
    try {
      execSync(`npx wrangler d1 execute grievanceiq-production --local --command="DELETE FROM monthly_history;"`, { cwd: rootDir, stdio: 'ignore' });
    } catch(e) {}
    console.log('✅ Fake data cleared.');
  } catch (err) {
    console.error('❌ Failed to clear tables:', err.message);
  }

  // 2. Re-apply schema and seed (just in case they missed any migrations or complaints)
  console.log('\n🏗️ 2. Applying schema migrations and seed data...');
  try {
    execSync('npm run db:migrate:local', { cwd: rootDir, stdio: 'inherit' });
    execSync('npm run db:seed', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Schema and seed applied successfully.');
  } catch (err) {
    console.error('❌ Failed to apply migrations/seed.', err.message);
  }

  // 3. Trigger Live Pipelines
  console.log('\n📡 3. Triggering Live Data Fetchers...');
  const jobs = ['darpg', 'rss', 'datagov', 'aggregator'];

  for (const job of jobs) {
    console.log(`⏳ Triggering pipeline job: [${job}]...`);
    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ job })
      });

      const result = await response.json();
      if (result.success) {
        console.log(`✅ Job [${job}] completed successfully! Status: ${result.data?.status}`);
      } else {
        console.error(`❌ Job [${job}] failed:`, result.error || result);
      }
    } catch (err) {
      console.error(`❌ Network error while triggering job [${job}]. Make sure your local dev server (npm run preview) is running on port 3000! Error:`, err.message);
    }
  }

  console.log('\n🎉 Transition to Live Production State completed!');
}

main();
