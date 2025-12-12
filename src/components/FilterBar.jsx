import { Filter } from 'lucide-react';

export default function FilterBar({ filter, setFilter }) {
    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            alignItems: 'center',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                <Filter size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Filter:</span>
            </div>

            <div style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '0.25rem'
            }}>
                <button
                    onClick={() => setFilter('all')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: filter === 'all' ? 'var(--color-bg-secondary)' : 'transparent',
                        color: filter === 'all' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'var(--transition-fast)'
                    }}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('never-visited')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: filter === 'never-visited' ? 'var(--color-bg-secondary)' : 'transparent',
                        color: filter === 'never-visited' ? 'var(--color-never-visited)' : 'var(--color-text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'var(--transition-fast)'
                    }}
                >
                    Never Visited
                </button>
            </div>
        </div>
    );
}
