import React from 'react';
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';
import { BusinessApplication, System } from '../../types';

interface BusinessApplicationViewProps {
  businessApplication: BusinessApplication;
  systems: System[];
  onSystemClick: (system: System) => void;
  onBack: () => void;
}

export const BusinessApplicationView: React.FC<BusinessApplicationViewProps> = ({ businessApplication, systems, onSystemClick, onBack }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Application Details
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
          <Typography variant="h6" gutterBottom>{businessApplication.name}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
          <Typography variant="body1" gutterBottom>{businessApplication.email}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Description</Typography>
          <Typography variant="body1" gutterBottom>{businessApplication.description}</Typography>
        </CardContent>
      </Card>
      <Typography variant="h6" gutterBottom>Systems</Typography>
      <Grid container spacing={2}>
        {systems.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">No systems found for this business application.</Typography>
          </Grid>
        )}
        {systems.map(system => (
          <Grid item xs={12} md={4} key={system.id}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => onSystemClick(system)}>
              <CardContent>
                <Typography variant="subtitle1">{system.name}</Typography>
                <Typography variant="body2" color="text.secondary">{system.description}</Typography>
                <Typography variant="body2" color="text.secondary">Owner: {system.owner}</Typography>
                <Typography variant="body2" color="text.secondary">Type: {system.type}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
      </Box>
    </Box>
  );
}; 