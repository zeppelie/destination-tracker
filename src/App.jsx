import { useState } from 'react';
import { useDestinations } from './context/DestinationContext';
import AddDestination from './components/AddDestination';
import DestinationList from './components/DestinationList';
import FilterBar from './components/FilterBar';
import DataControls from './components/DataControls';
import { Map } from 'lucide-react';

function App() {
  const { destinations } = useDestinations();
  const [filter, setFilter] = useState('all');

  // Calculate stats
  const total = destinations.length;
  const visited = destinations.filter(d => d.status === 'visited').length;
  const percentage = total === 0 ? 0 : Math.round((visited / total) * 100);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 0 20px var(--color-accent-glow)'
          }}>
            <Map size={32} color="#fff" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            background: 'linear-gradient(to right, var(--color-text-primary), var(--color-accent-primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Destination Tracker
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Keep track of your adventures. {visited} of {total} visited ({percentage}%).
        </p>

        <DataControls />
      </header>

      <main>
        <AddDestination />
        <FilterBar filter={filter} setFilter={setFilter} />
        <DestinationList destinations={destinations} filter={filter} />
      </main>
    </div>
  );
}

export default App;
