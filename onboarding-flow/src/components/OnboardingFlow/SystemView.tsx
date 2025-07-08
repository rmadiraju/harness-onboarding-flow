import React from 'react';
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';
import { System, Component } from '../../types';

interface SystemViewProps {
  system: System;
  components: Component[];
  onComponentClick: (component: Component) => void;
  onBack: () => void;
}

export const SystemView: React.FC<SystemViewProps> = ({ system, components, onComponentClick, onBack }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        System Details
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
          <Typography variant="h6" gutterBottom>{system.name}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Owner</Typography>
          <Typography variant="body1" gutterBottom>{system.owner}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Type</Typography>
          <Typography variant="body1" gutterBottom>{system.type}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Description</Typography>
          <Typography variant="body1" gutterBottom>{system.description}</Typography>
        </CardContent>
      </Card>
      <Typography variant="h6" gutterBottom>Components</Typography>
      <Grid container spacing={2}>
        {components.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">No components found for this system.</Typography>
          </Grid>
        )}
        {components.map(component => (
          <Grid item xs={12} md={4} key={component.name}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => onComponentClick(component)}>
              <CardContent>
                <Typography variant="subtitle1">{component.name}</Typography>
                <Typography variant="body2" color="text.secondary">Type: {component.type}</Typography>
                <Typography variant="body2" color="text.secondary">Language: {component.language}</Typography>
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