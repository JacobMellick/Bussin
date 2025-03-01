import { useState, useRef, useEffect } from 'react';
import { CrowdStatus, ArrivalInfo } from '../types/types';

const CombinedStatusForm = () => {
    const getCurrentTime = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

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
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [crowdStatus, setCrowdStatus] = useState<string | null>(null);
    const [arrivalTimes, setArrivalTimes] = useState<ArrivalInfo[] | null>(null);
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
        if (!busStop) return;

        // Mock API calls
        setCrowdStatus('Overcrowded');

        if (currentTime) {
            setArrivalTimes([
                { vehicleId: 'Bus 123', minutes: 5 },
                { vehicleId: 'Bus 456', minutes: 12 },
                { vehicleId: 'Express Train A1', minutes: 8 }
            ]);
        }
    };

    return (
        <div className="form-container">
            <h2>Bus Stop Status</h2>
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
                        required
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
                <input
                    type="time"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    placeholder="Select time (optional)"
                />
                <button type="submit">Check Status{currentTime && ' & Arrivals'}</button>
            </form>
            
            {crowdStatus && (
                <div className={getStatusClassName(crowdStatus)}>
                    Current Status: {crowdStatus}
                </div>
            )}
            
            {currentTime && arrivalTimes && (
                <div className="arrival-times-container">
                    <h3>Upcoming Arrivals</h3>
                    {arrivalTimes.map((arrival, index) => (
                        <div key={index} className="time-display">
                            {arrival.vehicleId} arrives in {arrival.minutes} minutes
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CombinedStatusForm;
