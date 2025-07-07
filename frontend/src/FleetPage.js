// frontend/src/FleetPage.js
import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button
} from '@mui/material';

// replace these with your real images in src/images/
import boat15 from './images/boat15.jpg';
import boat20 from './images/boat20.jpg';
import boat25 from './images/boat25.jpg';
import jetski from './images/jetski.jpeg';

const VEHICLES = [
  {
    title: '15-Person Yacht',
    img: boat15,
    description: 'Spacious yacht for up to 15 guests, perfect for small groups.',
    rate: 400
  },
  {
    title: '20-Person Yacht',
    img: boat20,
    description: 'Elegant 20-passenger yacht with full amenities.',
    rate: 400
  },
  {
    title: '25-Person Yacht',
    img: boat25,
    description: 'Luxury yacht hosting up to 25 people, ideal for events.',
    rate: 400
  },
  {
    title: 'Jet Ski',
    img: jetski,
    description: 'High-performance jet ski for solo thrill seekers.',
    rate: 150
  }
];

export default function FleetPage() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Our Fleet
      </Typography>

      <Grid container spacing={4}>
        {VEHICLES.map((v, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={v.img}
                alt={v.title}
                sx={{ height: 180 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {v.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  ${v.rate}/hr
                </Typography>
                <Button size="small" variant="contained" href="/booking">
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
