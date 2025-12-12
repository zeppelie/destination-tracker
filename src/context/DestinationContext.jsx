import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DestinationContext = createContext();

export function DestinationProvider({ children }) {
    const [destinations, setDestinations] = useState(() => {
        const saved = localStorage.getItem('destinations');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('destinations', JSON.stringify(destinations));
    }, [destinations]);

    const checkPlaceExists = async (name) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                return { valid: true };
            }
            return { valid: false };
        } catch (error) {
            console.error("Error verifying place:", error);
            // Fallback to valid if API fails to avoid blocking the user due to network issues
            return { valid: true };
        }
    };

    const addDestination = async (name) => {
        const exists = destinations.some(d => d.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            return { success: false, message: `"${name}" is already in your list.` };
        }

        const validCheck = await checkPlaceExists(name);
        if (!validCheck.valid) {
            return { success: false, message: `"${name}" could not be found on Google Maps.` };
        }

        const newDest = {
            id: uuidv4(),
            name,
            notes: '',
            status: 'never-visited',
            createdAt: new Date().toISOString(),
            mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
        };
        setDestinations(prev => [newDest, ...prev]);
        return { success: true };
    };

    const bulkAddDestinations = (names) => {
        const existingNames = new Set(destinations.map(d => d.name.toLowerCase()));
        const processedInputNames = new Set();
        const duplicatesFound = [];
        const newDests = [];

        for (const name of names) {
            const cleanName = name.trim();
            const lowerName = cleanName.toLowerCase();

            if (cleanName.length > 0) {
                if (existingNames.has(lowerName)) {
                    duplicatesFound.push(cleanName);
                } else if (!processedInputNames.has(lowerName)) {
                    newDests.push({
                        id: uuidv4(),
                        name: cleanName,
                        notes: '',
                        status: 'never-visited',
                        createdAt: new Date().toISOString()
                    });
                    processedInputNames.add(lowerName);
                }
            }
        }

        if (newDests.length > 0) {
            setDestinations(prev => [...newDests, ...prev]);
        }

        return { added: newDests.length, duplicates: duplicatesFound };
    };

    const toggleStatus = (id, newStatus) => {
        setDestinations(prev => prev.map(dest =>
            dest.id === id ? { ...dest, status: newStatus } : dest
        ));
    };

    const removeDestination = (id) => {
        setDestinations(prev => prev.filter(dest => dest.id !== id));
    };

    const updateNotes = (id, notes) => {
        setDestinations(prev => prev.map(dest =>
            dest.id === id ? { ...dest, notes } : dest
        ));
    };

    const importData = (jsonData) => {
        try {
            const parsed = JSON.parse(jsonData);
            if (Array.isArray(parsed)) {
                // Check for duplicates before importing
                const currentNames = new Set(destinations.map(d => d.name.toLowerCase()));
                const duplicates = parsed.filter(d => currentNames.has(d.name.toLowerCase()));

                if (duplicates.length > 0) {
                    return {
                        success: false,
                        message: `Cannot start import. The following cities are already in your list: ${duplicates.map(d => d.name).slice(0, 3).join(', ')}${duplicates.length > 3 ? '...' : ''}`
                    };
                }

                setDestinations(parsed);
                return { success: true };
            }
        } catch (e) {
            console.error("Invalid JSON", e);
            return { success: false, message: "Invalid JSON format." };
        }
        return { success: false, message: "Invalid data format." };
    };

    return (
        <DestinationContext.Provider value={{
            destinations,
            addDestination,
            bulkAddDestinations,
            toggleStatus,
            removeDestination,
            updateNotes,
            importData
        }}>
            {children}
        </DestinationContext.Provider>
    );
}

export function useDestinations() {
    return useContext(DestinationContext);
}
