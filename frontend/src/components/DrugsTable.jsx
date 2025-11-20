import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

export default function DrugsTable({ backendUrl = 'http://localhost:4000' }) {
  const [config, setConfig] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyFilter, setCompanyFilter] = useState('');

  useEffect(() => {
    async function load() {
      const [cfgRes, companiesRes, dataRes] = await Promise.all([
        axios.get(`${backendUrl}/api/config`),
        axios.get(`${backendUrl}/api/companies`),
        axios.get(`${backendUrl}/api/drugs`)
      ]);
      setConfig(cfgRes.data);
      setCompanies(companiesRes.data);
      setDrugs(dataRes.data);
    }
    load();
  }, [backendUrl]);

  useEffect(() => {
    async function fetchFiltered() {
      const url = companyFilter ? `${backendUrl}/api/drugs?company=${encodeURIComponent(companyFilter)}` : `${backendUrl}/api/drugs`;
      const res = await axios.get(url);
      setDrugs(res.data);
    }
    fetchFiltered();
  }, [companyFilter, backendUrl]);

  if (!config) return <div>Loading...</div>;

  //  Helper function to render a cell depending on the column key
  function renderCell(key, row, rowIndex) {
    switch (key) {
      case 'id':
        return rowIndex + 1;
      case 'code':
        return row.code ?? '';
      case 'name':
        if (row.genericName && row.brandName) return `${row.genericName} (${row.brandName})`;
        return row.genericName ?? row.brandName ?? '';
      case 'company':
        // company should be clickable to apply filter
        return (
          <button
            onClick={() => setCompanyFilter(row.company)}
            style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0, textAlign: 'left' }}
            data-testid={`company-btn-${row.id}`}
          >
            {row.company}
          </button>
        );
      case 'launchDate':
        // format according to user locale
        return row.launchDate ? new Date(row.launchDate).toLocaleDateString() : '';
      default:
        return row[key] ?? '';
    }
  }

  return (
    <div>
      <FormControl variant="outlined" style={{ minWidth: 260, marginBottom: 12 }}>
        <InputLabel id="company-filter-label">Company</InputLabel>
        <Select
          labelId="company-filter-label"
          value={companyFilter}
          label="Company"
          onChange={(e) => setCompanyFilter(e.target.value)}
          data-testid="company-select"
        >
          <MenuItem value=""><em>All</em></MenuItem>
          {companies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {config.columns.map(col => <TableCell key={col.key}>{col.label}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {drugs.map((d, idx) => (
              <TableRow key={d.id ?? idx} hover>
                {config.columns.map(col => (
                  <TableCell key={col.key}>
                    {renderCell(col.key, d, idx)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
