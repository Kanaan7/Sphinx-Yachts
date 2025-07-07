// frontend/src/HelpSection.js
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';

export default function HelpSection() {
  return (
    <Box
      component="section"
      sx={{
        background: 'linear-gradient(135deg, #0A1F44 0%, #13355B 100%)',
        color: '#FFFFFF',
        py: { xs: 6, md: 10 },
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, textDecoration: 'underline' }}
          >
            Not sure which Yacht is right for you? We Can Help
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#F9D342',
              color: '#F9D342',
              '&:hover': {
                backgroundColor: 'rgba(249,211,66,0.1)'
              }
            }}
            component={motion.a}
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us!
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
}
