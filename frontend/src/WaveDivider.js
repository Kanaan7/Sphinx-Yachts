import React from 'react';
import { Box } from '@mui/material';

export default function WaveDivider() {
  return (
    <Box sx={{ lineHeight: 0, mt: '-1px' }}>
      <svg
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 150 }}
      >
        {/* Gold wave */}
        <path
          d="M0,80 C360,120 1080,40 1440,80 L1440,150 L0,150 Z"
          fill="#C49B66"
        />
        {/* Navy wave atop */}
        <path
          d="M0,100 C360,60 1080,140 1440,100 L1440,150 L0,150 Z"
          fill="#0A1F44"
        />
      </svg>
    </Box>
  );
}
