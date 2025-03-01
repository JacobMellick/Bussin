import { useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Container, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CombinedStatusForm from './components/CombinedStatusForm';
import './App.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
    },
    secondary: {
      main: '#4338ca',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{
              background: 'linear-gradient(45deg, #4f46e5 30%, #4338ca 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4
            }}
          >
            BetterBus Service
          </Typography>
          <CombinedStatusForm />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
