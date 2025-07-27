// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  CssBaseline
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import Home             from './Home';
import FleetPage        from './FleetPage';
import AvailabilityPage from './AvailabilityPage';
import BookingForm      from './components/BookingForm';
import ContactPage      from './components/ContactPage';
import MyBookings       from './pages/MyBookings';

function NavTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(false);

  useEffect(() => {
    switch (location.pathname) {
      case '/':             setValue(0); break;
      case '/fleet':        setValue(1); break;
      case '/availability': setValue(2); break;
      case '/booking':      setValue(3); break;
      case '/my-bookings':  setValue(4); break;
      case '/contact':      setValue(5); break;
      default:              setValue(false);
    }
  }, [location.pathname]);

  const handleChange = (_e, newValue) => {
    setValue(newValue);
    const paths = [
      '/', 
      '/fleet', 
      '/availability', 
      '/booking', 
      '/my-bookings', 
      '/contact'
    ];
    navigate(paths[newValue] || '/');
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="inherit"
      indicatorColor="secondary"
      sx={{
        flexGrow: 1,
        '& .MuiTab-root': { fontWeight: 600 },
        '& .MuiTabs-indicator': { backgroundColor: '#C49B66' }
      }}
    >
      <Tab label="Home" />
      <Tab label="Fleet" />
      <Tab label="Availability" />
      <Tab label="Book Now" />
      <Tab label="My Bookings" />
      <Tab label="Contact" />
    </Tabs>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: '#0A1F44',
            color: '#C49B66',
            boxShadow: 'none',
            borderBottom: '2px solid #C49B66'
          }}
        >
          <Toolbar>
            <NavTabs />
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/fleet"        element={<FleetPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/booking"      element={<BookingForm />} />
          <Route path="/my-bookings"  element={<MyBookings />} />
          <Route path="/contact"      element={<ContactPage />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
