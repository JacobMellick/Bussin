import { useState, useRef, useEffect } from 'react';
import { CrowdStatus } from '../types/types';

const CrowdStatusForm = () => {
    const mockBusStops = [
        { id: '984', name: 'Central Station (#984)' },
        { id: '123', name: 'Downtown Plaza (#123)' },
        { id: '456', name: 'University Campus (#456)' },
        { id: '789', name: 'Shopping Mall (#789)' },
        { id: '321', name: 'Sports Complex (#321)' }
    ];

    const [busStop, setBusStop] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredStops, setFilteredStops] = useState(mockBusStops);
    const [crowdStatus, setCrowdStatus] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const filtered = mockBusStops.filter(stop => 
            stop.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            stop.id.includes(inputValue)
        );
        setFilteredStops(filtered);
    }, [inputValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStopSelect = (stop: { id: string, name: string }) => {
        setBusStop(stop.id);
        setInputValue(stop.name);
        setIsOpen(false);
    };

    const getStatusClassName = (status: string) => {
        switch (status) {
            case 'Overcrowded':
                return 'status-display overcrowded';
            case 'Moderately Crowded':
                return 'status-display moderate';
            case 'Low Crowd':
                return 'status-display low';
            default:
                return 'status-display';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Replace with actual API endpoint
        // Mock response for now
        setCrowdStatus('Overcrowded');
    };

    return (
        <div className="form-container">
            <h2>Check Crowd Status</h2>
            <form onSubmit={handleSubmit}>
                <div className="combobox-container" ref={dropdownRef}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search bus stop (e.g., 984)"
                        className="bus-stop-input"
                    />
                    {isOpen && filteredStops.length > 0 && (
                        <div className="dropdown-list">
                            {filteredStops.map(stop => (
                                <div
                                    key={stop.id}
                                    className="dropdown-item"
                                    onClick={() => handleStopSelect(stop)}
                                >
                                    {stop.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit">Check Status</button>
            </form>
            {crowdStatus && (
                <div className={getStatusClassName(crowdStatus)}>
                    Current Status: {crowdStatus}
                </div>
            )}
        </div>
    );
};

export default CrowdStatusForm;
