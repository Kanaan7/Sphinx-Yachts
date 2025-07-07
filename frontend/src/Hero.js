// frontend/src/Hero.js

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImg from './images/hero.jpg'; // make sure you have this file

const MotionButton = motion(Link);

export default function Hero() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        height: '100vh',
        backgroundImage: `url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(70, 79, 95, 0.3)', // lighter navy overlay
        },
      }}
    >
      <Box
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          position: 'relative',
          textAlign: 'center',
          color: '#FFFFFF',                       // pure white text
          textShadow: '0 2px 8px rgba(0,0,0,0.7)', // crisp separation
          px: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: ['2.5rem', '4rem'],
            mb: 2,
            color: 'rgb(241, 241, 241)',

            lineHeight: 1.1,
          }}
        >
          SphinxYachts Toronto
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: 'rgb(241, 241, 241)',
          }}
        >
          Toronto’s Premier Luxury Yacht & Jet Ski Rentals
        </Typography>

        <MotionButton
          to="/booking"
          component={Link}
          style={{
            display: 'inline-block',
            backgroundColor: '#C49B66',
            color: '#0A1F44',
            padding: '12px 36px',
            borderRadius: 4,
            fontWeight: 600,
            textDecoration: 'none',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Your Experience
        </MotionButton>
      </Box>
    </Box>
  );
}
