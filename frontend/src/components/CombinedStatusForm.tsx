import { useState, useEffect } from 'react';
import { ArrivalInfo } from '../types/types';
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
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const CombinedStatusForm = () => {
    const [busStop, setBusStop] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState<Dayjs | null>(dayjs());
    const [crowdStatus, setCrowdStatus] = useState<string | null>(null);
    const [arrivalTimes, setArrivalTimes] = useState<ArrivalInfo[] | null>(null);
    const [stops, setStops] = useState<any[]>([]);
    
    const [selectedStop, setSelectedStop] = useState<any>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number } | null>(null);

    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    const mapOptions = {
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
    };

    useEffect(() => {
        const fetchStops = async () => {
            const response = await fetch('data/stops.geojson');
            if (!response.ok) {
                console.error('Failed to fetch stops:', response.statusText);
                return;
            }
    
            const data = await response.json();
            console.log('Fetched stops:', data);
            const uniqueStops: any[] = [];
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
    
    useEffect(() => {
        if (busStop) {
            const lat = busStop.geometry.coordinates[1];
            const lng = busStop.geometry.coordinates[0];
            setMapCenter({ lat, lng });
            setSelectedStop(busStop);
        }
    }, [busStop]);

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
        <Paper 
            elevation={3} 
            sx={{ 
                p: 4,
                maxWidth: 800,
                mx: 'auto',
                borderRadius: 2,
                bgcolor: '#fafafa'
            }}
        >
            <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                    mb: 4,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textAlign: 'center'
                }}
            >
                Real-Time Bus Stop Status
            </Typography>

            <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3,
                    mb: 4
                }}
            >
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
                            variant="filled"
                        />
                    )}
                />
                
                <TimePicker
                    label="Select time (optional)"
                    value={currentTime}
                    onChange={(newValue) => setCurrentTime(newValue)}
                    sx={{ bgcolor: 'white' }}
                />

                <Button 
                    variant="contained" 
                    type="submit"
                    size="large"
                    sx={{ 
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                    }}
                >
                    Check Status{currentTime && ' & Arrivals'}
                </Button>
            </Box>
            
            {crowdStatus && (
                <Alert 
                    severity={getStatusSeverity(crowdStatus)}
                    sx={{ 
                        mt: 2,
                        mb: 4,
                        py: 2,
                        fontSize: '1.1rem'
                    }}
                >
                    Current Status: <strong>{crowdStatus}</strong>
                </Alert>
            )}
            
            {currentTime && arrivalTimes && (
                <Box 
                    sx={{ 
                        mt: 4,
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 1
                    }}
                >
                    <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mb: 2
                        }}
                    >
                        Upcoming Arrivals
                    </Typography>
                    <List>
                        {arrivalTimes.map((arrival) => (
                            <ListItem 
                                key={arrival.vehicleId}
                                sx={{ 
                                    bgcolor: '#f5f5f5',
                                    mb: 1.5,
                                    borderRadius: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        bgcolor: '#f0f0f0'
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary={
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {arrival.vehicleId}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            Arrives in {arrival.minutes} minutes
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {mapCenter && (
                <Box 
                    sx={{ 
                        mt: 4,
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 1
                    }}
                >
                    <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mb: 2
                        }}
                    >
                        Bus Stop Location
                    </Typography>
                    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                        <GoogleMap
                            mapContainerStyle={{
                                ...containerStyle,
                                borderRadius: '8px',
                            }}
                            center={mapCenter}
                            zoom={15}
                            options={mapOptions}
                        >
                            <Marker position={mapCenter} />
                            {selectedStop && (
                                <InfoWindow position={mapCenter}>
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedStop.properties.stop_name}
                                        </Typography>
                                    </Box>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>
                </Box>
            )}
        </Paper>
    );
};

export default CombinedStatusForm;
