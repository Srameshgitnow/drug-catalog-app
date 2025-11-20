require('dotenv').config(); // load .env
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/config', (req, res) => {
  res.json({
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'company', label: 'Company' },
      { key: 'launchDate', label: 'Launch Date' }
    ]
  });
});

app.get('/api/companies', async (req, res) => {
  const { rows } = await pool.query('SELECT DISTINCT company FROM drugs ORDER BY company');
  res.json(rows.map(r => r.company));
});

app.get('/api/drugs', async (req, res) => {
  const company = req.query.company;
  let q = 'SELECT id, code, generic_name, brand_name, company, launch_date FROM drugs';
  const params = [];
  if (company) {
    q += ' WHERE company = $1';
    params.push(company);
  }
  q += ' ORDER BY launch_date DESC';
  const { rows } = await pool.query(q, params);
  const mapped = rows.map(r => ({
    id: r.id,
    code: r.code,
    genericName: r.generic_name,
    brandName: r.brand_name,
    company: r.company,
    launchDate: r.launch_date
  }));
  res.json(mapped);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
