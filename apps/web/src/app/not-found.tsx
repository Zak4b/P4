"use client";

import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 100, 
              color: 'text.secondary',
              mb: 2 
            }} 
          />

          <Typography variant="h1" color="primary" sx={{
            fontWeight: "bold"
          }}>
            404
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom>
            Oups ! Cette page est introuvable.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: '600px'
            }}>
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
            Vérifiez l'URL ou retournez à la page d'accueil.
          </Typography>

          {/* Bouton de retour */}
          <Button
            component={Link} // Intégration importante pour Next.js
            href="/"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Container>
    </Box>
  );
}