import { useRef } from 'react';
import { useDestinations } from '../context/DestinationContext';
import { Download, Upload } from 'lucide-react';

export default function DataControls() {
    const { destinations, importData } = useDestinations();
    const fileInputRef = useRef(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(destinations, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'destinations.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = importData(event.target.result);
            if (result.success) {
                alert('Data imported successfully!');
            } else {
                alert(result.message || 'Failed to import data. Invalid format.');
            }
            e.target.value = null; // Reset input
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
            <button
                onClick={handleExport}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'var(--transition-fast)'
                }}
            >
                <Download size={14} />
                Export
            </button>

            <button
                onClick={handleImportClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'var(--transition-fast)'
                }}
            >
                <Upload size={14} />
                Import
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".json"
            />
        </div>
    );
}
