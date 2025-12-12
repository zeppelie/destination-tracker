import { useState } from 'react';
import { useDestinations } from '../context/DestinationContext';
import { Plus } from 'lucide-react';

export default function AddDestination() {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addDestination, bulkAddDestinations } = useDestinations();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed || isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Check for separators: newline, comma, semicolon
            if (/[\n,;]/.test(trimmed)) {
                // Split by newlines, commas, or semicolons
                const names = trimmed.split(/[\n,;]/).map(s => s.trim()).filter(Boolean);
                if (names.length > 0) {
                    const result = await bulkAddDestinations(names);

                    let message = `Added ${result.added} destinations.`;
                    if (result.duplicates.length > 0) {
                        message += `\n\nIgnored ${result.duplicates.length} duplicates:\n${result.duplicates.join(', ')}`;
                    }
                    if (result.invalid && result.invalid.length > 0) {
                        message += `\n\nIgnored ${result.invalid.length} invalid places (not found):\n${result.invalid.join(', ')}`;
                    }

                    if (result.duplicates.length > 0 || (result.invalid && result.invalid.length > 0)) {
                        alert(message);
                    }
                }
            } else {
                const result = await addDestination(trimmed);
                if (!result.success) {
                    alert(result.message);
                    setIsSubmitting(false);
                    return; // Don't clear input if failed
                }
            }

            setName('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{
                display: 'flex',
                background: 'var(--color-bg-secondary)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                gap: '0.5rem'
            }}>
                <textarea
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add destination(s)... (Separated by comma, semi-colon or new line)"
                    rows={1}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        padding: '0.5rem 1rem',
                        outline: 'none',
                        fontSize: '1rem',
                        resize: 'vertical',
                        minHeight: '2.5rem',
                        maxHeight: '200px',
                        fontFamily: 'inherit',
                        lineHeight: '1.5'
                    }}
                />

                <button
                    type="submit"
                    disabled={!name.trim()}
                    style={{
                        background: 'var(--color-accent-primary)',
                        color: '#000',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: name.trim() ? 1 : 0.5,
                        transition: 'var(--transition-fast)',
                        width: '40px'
                    }}
                    title="Add"
                >
                    <Plus size={24} />
                </button>
            </div>
        </form>
    );
}
