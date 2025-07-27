// frontend/src/components/ContactPage.jsx

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack(s => ({ ...s, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Submission failed');
      setSnack({ open: true, severity: 'success', message: 'Message sent!' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setSnack({ open: true, severity: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600, mx: 'auto', mt: 4, p: 3,
          display: 'flex', flexDirection: 'column', gap: 2,
          bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3
        }}
      >
        <Typography variant="h4" align="center">Contact Us</Typography>

        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Message"
          name="message"
          multiline
          rows={4}
          value={form.message}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? 'Sending…' : 'Send Message'}
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactPage;
