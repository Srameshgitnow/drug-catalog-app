# Drug-catalog-app

Drug-catalog-app is a minimal full-stack demo that shows a table of drug records (from a seeded dataset) with backend-driven table configuration and client-side filtering by company.

It’s built with:
* Backend: Node.js (Express) + PostgreSQL
* Frontend: React (Vite) + Material UI
* Tests: Jest + React Testing Library

Key behaviours:
* Table columns are configurable by the backend (frontend reads /api/config).
* Data is ordered by launch date descending.
* Company filter available via dropdown and by clicking a company cell in the table.
* Launch dates are formatted by the user’s locale.

--------------

Quick prerequisites

* Node.js (v16.20+ or v18+ recommended)
* npm
* PostgreSQL (local or Docker)
* Optional: pgAdmin / TablePlus / DBeaver to view the DB

-------------

## Backend - Setup & run

1. Configure environment

    Copy the example env and edit if needed:
    cd backend

    cp .env.example .env


    backend/.env contains:
    DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>

    PORT=4000

2. Create database and schema

    Use psql or pgAdmin to create the database drugsdb (or your chosen name matching DATABASE_URL). Then run schema:

    psql -d drugsdb -f backend/schema.sql

    schema.sql creates the drugs table and indexes.

3. Install dependencies & seed data

    cd backend  

    npm install

    /* ensure backend/drugs.json contains your data file */

    npm run seed

    Seeding reads backend/drugs.json and inserts rows.

4. Start backend

    npm start
    
        or

    node src/index.js

    Default server: http://localhost:4000 (or PORT from .env).

------------

Backend - API Endpoints

* GET /api/config

Returns table configuration (columns + labels). Example:

{
  "columns": [
    { "key": "id", "label": "Id" },
    { "key": "code", "label": "Code" },
    { "key": "name", "label": "Name" },
    { "key": "company", "label": "Company" },
    { "key": "launchDate", "label": "Launch Date" }
  ]
}


Frontend uses this to render headers and which row cells to display.


* GET /api/companies

Returns an array of distinct company names:

["Merck Sharp & Dohme Corp.", "Pfizer Inc.", ...]

* GET /api/drugs

Returns drug rows ordered by launch_date descending. Optional query:

?company=Company%20Name, filters results by company.

Example:

GET /api/drugs?company=Merck%20Sharp%20%26%20Dohme%20Corp.


Response row fields (example):

{
  "id": 1,
  "code": "0006-0568",
  "genericName": "vorinostat",
  "brandName": "ZOLINZA",
  "company": "Merck Sharp & Dohme Corp.",
  "launchDate": "2004-02-14T23:01:10Z"
}

----------------

## Frontend - Setup & run
1. Install deps

    cd frontend

    npm install

2. Start dev server

    Ensure backend is running (see above), then:

    npm run dev


Open the Vite URL (e.g. http://localhost:5173) in your browser.

3. App behaviour (user actions)

* Table headers are rendered from the backend /api/config.

* Initial load fetches /api/drugs and /api/companies.

* Filter by dropdown: select a company from the Company dropdown - frontend requests /api/drugs?company=... and updates the table.

* Filter by clicking company cell: click a company name in any row - same filter is applied programmatically.

* Date formatting: new Date(launchDate).toLocaleDateString() is used, so the display format depends on browser/system locale.

* Ordering: data shown is ordered descending by launch date (server-side).

----------

## Tests

Unit tests for the frontend are set up with Jest + React Testing Library.

Run tests

From frontend/:

    npm test


What is tested


* The example test DrugsTable.test.jsx mocks API calls and asserts:

    * Initial data load displays rows.

    * Dropdown filtering shows only matching rows.

    * Clicking a company cell filters the rows.