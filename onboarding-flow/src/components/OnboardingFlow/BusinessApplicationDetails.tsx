import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
  Grid,
} from '@mui/material';
import { BusinessApplication } from '../../types';

interface BusinessApplicationDetailsProps {
  businessApplication: BusinessApplication;
  onNext: () => void;
  onBack: () => void;
}

export const BusinessApplicationDetails: React.FC<BusinessApplicationDetailsProps> = ({
  businessApplication,
  onNext,
  onBack,
}) => {
  const [createSystem, setCreateSystem] = useState(false);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Application Details
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="h6" gutterBottom>
                {businessApplication.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {businessApplication.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1" gutterBottom>
                {businessApplication.description}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose whether to create a new system or select an existing one
        </Typography>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={createSystem}
              onChange={(e) => setCreateSystem(e.target.checked)}
              color="primary"
            />
          }
          label="Create a new system for this onboarding"
        />
      </Box>

      <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onNext}
          disabled={!createSystem}
        >
          {createSystem ? 'Continue to System Selection' : 'Select System Option'}
        </Button>
      </Box>
    </Box>
  );
}; 