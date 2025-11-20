CREATE TABLE IF NOT EXISTS drugs (
id SERIAL PRIMARY KEY,
code TEXT NOT NULL,
generic_name TEXT,
brand_name TEXT,
company TEXT,
launch_date TIMESTAMP WITH TIME ZONE
);


CREATE INDEX IF NOT EXISTS idx_drugs_launch_date ON drugs (launch_date DESC);
CREATE INDEX IF NOT EXISTS idx_drugs_company ON drugs (company);
