require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:superuser@localhost:5432/drugsdb'
});

async function main() {
  const file = path.join(__dirname, '..', 'drugs.json');
  if (!fs.existsSync(file)) {
    console.error('drugs.json not found in backend/ - please add your data file.');
    process.exit(1);
  }

  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  console.log(`Seeding ${data.length} rows...`);

  for (const row of data) {
    const { code, genericName, brandName, company, launchDate } = row;
    await pool.query(
      `INSERT INTO drugs (code, generic_name, brand_name, company, launch_date)
       VALUES ($1,$2,$3,$4,$5)`,
      [code, genericName, brandName, company, launchDate]
    );
  }

  console.log('Seed complete');
  await pool.end();
}

main().catch(err => {
  console.error('Seeding failed', err);
  process.exit(1);
});
