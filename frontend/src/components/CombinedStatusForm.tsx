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
    ListItemText
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';

const CombinedStatusForm = () => {
    const [busStop, setBusStop] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState<Dayjs | null>(dayjs());
    const [crowdStatus, setCrowdStatus] = useState<string | null>(null);
    const [arrivalTimes, setArrivalTimes] = useState<ArrivalInfo[] | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!busStop) return;

        // TODO: Replace with actual API calls
        // setCrowdStatus(...);
        // setArrivalTimes(...);
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
                    options={[]} // Will be populated from API
                    getOptionLabel={(option: any) => option.name}
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
