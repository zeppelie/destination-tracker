import { useState, useEffect } from 'react';
import { useDestinations } from '../context/DestinationContext';
import { Check, X, MapPin, Plus, StickyNote, Save, Trash2, Map } from 'lucide-react';

export default function DestinationCard({ destination }) {
    const { toggleStatus, removeDestination, updateNotes } = useDestinations();
    const [showNotes, setShowNotes] = useState(false);
    const [noteText, setNoteText] = useState(destination.notes || '');

    // Reset local state if prop changes (e.g. if updated from outside)
    useEffect(() => {
        setNoteText(destination.notes || '');
    }, [destination.notes]);

    const handleSaveNotes = () => {
        updateNotes(destination.id, noteText);
        setShowNotes(false);
    };

    const hasNotes = destination.notes && destination.notes.trim().length > 0;

    return (
        <div style={{
            background: 'var(--color-bg-card)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            transition: 'var(--transition-fast)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative accent */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: destination.status === 'visited'
                    ? 'var(--color-visited)'
                    : 'var(--color-never-visited)'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    maxWidth: '80%'
                }}>
                    <MapPin size={18} color={destination.status === 'visited' ? 'var(--color-visited)' : 'var(--color-accent-primary)'} />
                    <span style={{ wordBreak: 'break-word' }}>{destination.name}</span>
                </h3>

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        style={{
                            color: hasNotes ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                            opacity: hasNotes || showNotes ? 1 : 0.5,
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            background: showNotes ? 'rgba(255,255,255,0.1)' : 'transparent',
                            transition: 'var(--transition-fast)'
                        }}
                        title={hasNotes ? "View/Edit Notes" : "Add Note"}
                    >
                        <StickyNote size={18} />
                    </button>

                    {destination.mapsLink && (
                        <a
                            href={destination.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--color-text-secondary)',
                                opacity: 0.8,
                                padding: '6px',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'var(--transition-fast)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Open in Google Maps"
                        >
                            <Map size={18} />
                        </a>
                    )}

                    {(hasNotes || showNotes) && (
                        <button
                            onClick={() => {
                                updateNotes(destination.id, '');
                                // Also close the notes view if it was open
                                setShowNotes(false);
                            }}
                            disabled={!hasNotes}
                            style={{
                                color: '#ef4444', // Red 500
                                opacity: hasNotes ? 1 : 0.3,
                                padding: '6px',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'var(--transition-fast)',
                                cursor: hasNotes ? 'pointer' : 'default'
                            }}
                            title="Delete Note"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    <button
                        onClick={() => removeDestination(destination.id)}
                        style={{
                            color: 'var(--color-text-secondary)',
                            opacity: 0.5,
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'var(--transition-fast)'
                        }}
                        aria-label="Remove destination"
                        title="Remove"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Stats/Action Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                    onClick={() => toggleStatus(destination.id, 'visited')}
                    style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: destination.status === 'visited'
                            ? 'rgba(74, 222, 128, 0.2)'
                            : 'rgba(255, 255, 255, 0.05)',
                        color: destination.status === 'visited'
                            ? 'var(--color-visited)'
                            : 'var(--color-text-secondary)',
                        border: destination.status === 'visited'
                            ? '1px solid var(--color-visited)'
                            : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 500,
                        transition: 'var(--transition-fast)'
                    }}
                >
                    <Check size={16} />
                    Visited
                </button>

                <button
                    onClick={() => toggleStatus(destination.id, 'never-visited')}
                    style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: destination.status === 'never-visited'
                            ? 'rgba(244, 114, 182, 0.2)'
                            : 'rgba(255, 255, 255, 0.05)',
                        color: destination.status === 'never-visited'
                            ? 'var(--color-never-visited)'
                            : 'var(--color-text-secondary)',
                        border: destination.status === 'never-visited'
                            ? '1px solid var(--color-never-visited)'
                            : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 500,
                        transition: 'var(--transition-fast)'
                    }}
                >
                    <X size={16} />
                    Not Yet
                </button>
            </div>

            {/* Notes Section */}
            {(showNotes || hasNotes) && (
                <div style={{
                    marginTop: '0.5rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: showNotes ? 'block' : 'none' // Only show when editing/expanded
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Trip Notes
                    </label>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Best time to visit? Places to eat?..."
                        rows={3}
                        style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-text-primary)',
                            padding: '0.5rem',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                            onClick={() => setShowNotes(false)}
                            style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.85rem',
                                color: 'var(--color-text-secondary)'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveNotes}
                            style={{
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.85rem',
                                background: 'var(--color-accent-primary)',
                                color: '#000',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontWeight: 500
                            }}
                        >
                            <Save size={14} />
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* Read-only notes preview when collapsed */}
            {!showNotes && hasNotes && (
                <div
                    onClick={() => setShowNotes(true)}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        borderLeft: '2px solid var(--color-accent-primary)'
                    }}
                >
                    <p style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        margin: 0
                    }}>
                        {destination.notes}
                    </p>
                </div>
            )}
        </div>
    );
}
