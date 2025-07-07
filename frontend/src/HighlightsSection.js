// frontend/src/HighlightsSection.js

import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import WavesIcon from '@mui/icons-material/Waves';
import GroupIcon from '@mui/icons-material/Group';

export default function HighlightsSection() {
  const items = [
    {
      icon: <DirectionsBoatIcon sx={{ fontSize: 48 }} />,
      title: 'Luxury Yachts',
      desc: '15–25 passenger yachts with top-of-the-line amenities and seating.'
    },
    {
      icon: <WavesIcon sx={{ fontSize: 48 }} />,
      title: 'High-Performance Jet Skis',
      desc: 'Powerful, easy to ride, and perfect for thrill-seekers on the water.'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 48 }} />,
      title: 'Expert Crew',
      desc: 'Our captains and staff know Lake Ontario inside and out.'
    }
  ];

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 700, color: '#0A1F44', mb: 4 }}
          >
            Our Highlights
          </Typography>
        </motion.div>

        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
        >
          {items.map((item, idx) => (
            <Grid 
              item 
              key={idx}
              xs={12} sm={6} md={4}      // three columns at md+, centered
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    px: 2,
                    py: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    height: '100%'
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      bgcolor: '#0A1F44',
                      color: '#F9D342',
                      borderRadius: '50%',
                      p: 2,
                      mb: 2
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
