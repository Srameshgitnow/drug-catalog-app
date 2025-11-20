import DrugsTable from './components/DrugsTable';

export default function App() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Drug Catalog</h1>
            <DrugsTable backendUrl={import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'} />
        </div>
    );
}
