import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DrugsTable from '../components/DrugsTable';
import axios from 'axios';

jest.mock('axios');

const mockConfig = { columns: [
  { key: 'id', label: 'Id' },
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'launchDate', label: 'Launch Date' }
]};

const allDrugs = [
  { id: 1, code: '0001', genericName: 'a', brandName: 'A', company: 'X Corp', launchDate: '2005-01-01T00:00:00Z' },
  { id: 2, code: '0002', genericName: 'b', brandName: 'B', company: 'Y Inc', launchDate: '2010-01-01T00:00:00Z' }
];

test('filters by company when selecting dropdown and when clicking company cell', async () => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/api/config')) return Promise.resolve({ data: mockConfig });
    if (url.endsWith('/api/companies')) return Promise.resolve({ data: ['X Corp', 'Y Inc'] });
    if (url.includes('/api/drugs?company=X%20Corp')) return Promise.resolve({ data: [allDrugs[0]] });
    if (url.includes('/api/drugs?company=Y%20Inc')) return Promise.resolve({ data: [allDrugs[1]] });
    if (url.endsWith('/api/drugs')) return Promise.resolve({ data: allDrugs });
    return Promise.resolve({ data: [] });
  });

  render(<DrugsTable backendUrl="http://test" />);

  // wait for initial load
  await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://test/api/drugs'));

  // ensure both rows present initially
  expect(screen.getByText('0001')).toBeInTheDocument();
  expect(screen.getByText('0002')).toBeInTheDocument();

  // select company X Corp from dropdown
  const select = screen.getByLabelText('Company');
  fireEvent.mouseDown(select);
  const option = await screen.findByText('X Corp');
  fireEvent.click(option);

  await waitFor(() => {
    expect(screen.getByText('0001')).toBeInTheDocument();
    expect(screen.queryByText('0002')).toBeNull();
  });

  // click company cell to filter to Y Inc
  fireEvent.click(screen.getByText('Y Inc'));

  await waitFor(() => {
    expect(screen.getByText('0002')).toBeInTheDocument();
  });
});
