import React from 'react';
import Hero from './Hero';
import WaveDivider from './WaveDivider';
import HighlightsSection from './HighlightsSection';
import HelpSection from './HelpSection';
import { Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';




export default function Home() {
  return (
    <>
      <Hero />
      <HighlightsSection />
      <WaveDivider />
      <HelpSection />
      <Container sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Why Choose SphinxYachts
          </Typography>
        </motion.div>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            { title: 'Expert Crew', desc: 'Our captains know the Red Sea inside and out.' },
            { title: 'Luxury Vessels', desc: 'State-of-the-art yachts for up to 25 guests.' },
            { title: 'Flexible Scheduling', desc: 'Book by the hour, day, or sunset cruise.' }
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

