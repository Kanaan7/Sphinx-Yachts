// frontend/src/ContactPage.js
import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function ContactPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Get in Touch
      </Typography>
      <Box component="form" sx={{ mt: 4 }} noValidate>
        <TextField
          label="Your Name"
          name="name"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email Address"
          name="email"
          type="email"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Message"
          name="message"
          multiline
          rows={4}
          fullWidth
          required
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Send Message
        </Button>
      </Box>
    </Container>
  );
}
