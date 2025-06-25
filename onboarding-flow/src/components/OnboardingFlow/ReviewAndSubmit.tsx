import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { OnboardingData } from '../../types';

interface ReviewAndSubmitProps {
  onboardingData: OnboardingData;
  onBack: () => void;
  onSubmit: () => void;
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  onboardingData,
  onBack,
  onSubmit,
}) => {
  const { selectedBA, selectedSystem, component } = onboardingData;

  const isComplete = selectedBA && selectedSystem && component;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review & Submit
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review all the information before submitting your onboarding request
      </Typography>

      {!isComplete && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please complete all previous steps before submitting
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Business Application Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Application
              </Typography>
              {selectedBA ? (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {selectedBA.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedBA.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedBA.email}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No business application selected
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System
              </Typography>
              {selectedSystem ? (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {selectedSystem.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedSystem.description}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Owner:</strong> {selectedSystem.owner}
                  </Typography>
                  <Chip label={selectedSystem.type} size="small" color="primary" />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No system selected
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Component Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Component
              </Typography>
              {component ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong>
                    </Typography>
                    <Typography variant="subtitle1">
                      {component.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Type:</strong>
                    </Typography>
                    <Chip label={component.type} size="small" color="secondary" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Language:</strong>
                    </Typography>
                    <Chip label={component.language} size="small" color="info" />
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No component created
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={!isComplete}
        >
          Submit Onboarding Request
        </Button>
      </Box>
    </Box>
  );
}; 