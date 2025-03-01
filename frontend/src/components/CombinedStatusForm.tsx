import { useState, useEffect, SetStateAction } from 'react';
import { CrowdStatus, ArrivalInfo } from '../types/types';
import { 
    Paper, 
    Typography, 
    Autocomplete, 
    TextField, 
    Button, 
    Box,
    Alert,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';

const CombinedStatusForm = () => {
    const [busStop, setBusStop] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState<Dayjs | null>(dayjs());
    const [crowdStatus, setCrowdStatus] = useState<string | null>(null);
    const [arrivalTimes, setArrivalTimes] = useState<ArrivalInfo[] | null>(null);
    const [stops, setStops] = useState<any[]>([]);


    useEffect(() => {
        const fetchStops = async () => {
            const response = await fetch('data/stops.geojson');
            if (!response.ok) {
                console.error('Failed to fetch stops:', response.statusText);
                return;
            }
    
            const data = await response.json();
            console.log('Fetched stops:', data);
            const uniqueStops: SetStateAction<any[]> = [];
            const stopNames = new Set();
    
            data.features.forEach((stop: any) => {
                const stopName = stop.properties.stop_name;
                if (!stopNames.has(stopName)) {
                    stopNames.add(stopName);
                    uniqueStops.push(stop);
                }
            });
    
            setStops(uniqueStops);
        };
    
        fetchStops();
    }, []);
    
    
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!busStop) return;
    
        const stopName = busStop.properties.stop_name;
    
        try {
            const crowdStatusResponse = await fetch(`http://127.0.0.1:8000/api/crowd-status/${stopName}/`);
            console.log('Response status:', crowdStatusResponse.status);
        
            if (!crowdStatusResponse.ok) {
                throw new Error(`Failed to fetch crowd status: ${crowdStatusResponse.statusText}`);
            }
            
            const crowdData = await crowdStatusResponse.json();
            console.log('Parsed crowd data:', crowdData);
    
            setCrowdStatus(crowdData.crowd_status.status); 
            console.log('Crowd status:', crowdData.status);

            if (currentTime) {
                setArrivalTimes([
                    { vehicleId: 'Bus 123', minutes: 5 },
                    { vehicleId: 'Bus 456', minutes: 12 },
                    { vehicleId: 'Express Train A1', minutes: 8 }
                ]);
            }
    
        } catch (error) {
            console.error(error);
        }
    };
    

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'Overcrowded': return 'error';
            case 'Moderate': return 'warning';
            case 'no crowd': return 'success';
            default: return 'info';
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Bus Stop Status
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Autocomplete
                    options={stops}
                    getOptionLabel={(option: any) => option.properties.stop_name}
                    value={busStop}
                    onChange={(_, newValue) => setBusStop(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search bus stop"
                            required
                        />
                    )}
                />
                
                <TimePicker
                    label="Select time (optional)"
                    value={currentTime}
                    onChange={(newValue) => setCurrentTime(newValue)}
                />

                <Button 
                    variant="contained" 
                    type="submit"
                    sx={{ mt: 2 }}
                >
                    Check Status{currentTime && ' & Arrivals'}
                </Button>
            </Box>
            
            {crowdStatus && (
                <Alert 
                    severity={getStatusSeverity(crowdStatus)}
                    sx={{ mt: 2 }}
                >
                    Current Status: {crowdStatus}
                </Alert>
            )}
            
            {currentTime && arrivalTimes && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Upcoming Arrivals
                    </Typography>
                    <List>
                        {arrivalTimes.map((arrival) => (
                            <ListItem 
                                key={arrival.vehicleId}
                                sx={{ 
                                    bgcolor: 'background.paper',
                                    mb: 1,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <ListItemText 
                                    primary={arrival.vehicleId}
                                    secondary={`Arrives in ${arrival.minutes} minutes`}
                                />
                            </ListItem>
                        ))}
                    </List>

                </Box>
            )}
        </Paper>
    );
};

export default CombinedStatusForm;
