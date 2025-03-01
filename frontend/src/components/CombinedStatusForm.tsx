import { useState } from 'react';
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
    ListItemText,
    Stack
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs'; // Add this import

const CombinedStatusForm = () => {
    const mockBusStops = [
        { id: '984', name: 'Central Station (#984)', label: 'Central Station (#984)' },
        { id: '123', name: 'Downtown Plaza (#123)', label: 'Downtown Plaza (#123)' },
        { id: '456', name: 'University Campus (#456)', label: 'University Campus (#456)' },
        { id: '789', name: 'Shopping Mall (#789)', label: 'Shopping Mall (#789)' },
        { id: '321', name: 'Sports Complex (#321)', label: 'Sports Complex (#321)' }
    ];

    const [busStop, setBusStop] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState<Dayjs | null>(dayjs()); // Change type to Dayjs
    const [crowdStatus, setCrowdStatus] = useState<string | null>(null);
    const [arrivalTimes, setArrivalTimes] = useState<ArrivalInfo[] | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!busStop) return;

        setCrowdStatus('Overcrowded');

        if (currentTime) {
            setArrivalTimes([
                { vehicleId: 'Bus 123', minutes: 5 },
                { vehicleId: 'Bus 456', minutes: 12 },
                { vehicleId: 'Express Train A1', minutes: 8 }
            ]);
        }
    };

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'Overcrowded': return 'error';
            case 'Moderately Crowded': return 'warning';
            case 'Low Crowd': return 'success';
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
                    options={mockBusStops}
                    getOptionLabel={(option) => option.name}
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
                        {arrivalTimes.map((arrival, index) => (
                            <ListItem 
                                key={index}
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
