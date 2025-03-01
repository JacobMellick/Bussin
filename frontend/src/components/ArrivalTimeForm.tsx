import { useState, useRef, useEffect } from 'react';
import { ArrivalInfo } from '../types/types';

const ArrivalTimeForm = () => {
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
    const [currentTime, setCurrentTime] = useState('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Replace with actual API endpoint
        setArrivalTimes([
            { vehicleId: 'Bus 123', minutes: 5 },
            { vehicleId: 'Bus 456', minutes: 12 },
            { vehicleId: 'Express Train A1', minutes: 8 }
        ]);
    };

    return (
        <div className="form-container">
            <h2>Check Arrival Times</h2>
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
                <input
                    type="time"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    required
                />
                <button type="submit">Check Arrival Times</button>
            </form>
            {arrivalTimes && (
                <div className="arrival-times-container">
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

export default ArrivalTimeForm;
