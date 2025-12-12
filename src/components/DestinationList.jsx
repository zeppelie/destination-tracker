import DestinationCard from './DestinationCard';

export default function DestinationList({ destinations, filter }) {
    const filtered = destinations.filter(dest => {
        if (filter === 'all') return true;
        return dest.status === filter;
    });

    if (filtered.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-lg)'
            }}>
                {filter === 'all'
                    ? "No destinations yet. Add one above!"
                    : "No destinations found directly matching this filter."}
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
        }}>
            {filtered.map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
            ))}
        </div>
    );
}
