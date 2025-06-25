import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Grid,
  Dialog,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchBuilds } from '../api';
import { Build } from '../types';
import { ReleaseSubmitDialog } from './ReleaseSubmitDialog';

const validationLabels: Record<keyof Build['validations'], string> = {
  vulnerabilities: 'Validate Build Vulnerabilities',
  componentTests: 'Validate Component Tests',
  liveDependency: 'Validate Live-Dependency Tests',
  performance: 'Validate Performance Tests',
  changeFreeze: 'Change Freeze Validation',
};

export const BuildSelectorScreen: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [selectedBuildId, setSelectedBuildId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    fetchBuilds().then(data => {
      setBuilds(data);
      setLoading(false);
    });
  }, []);

  // When selectedBuildId changes, show spinner for 1s, then show results
  // @ts-ignore
  useEffect(() => {
    if (selectedBuildId) {
      setValidating(true);
      setShowValidation(false);
      const timer = setTimeout(() => {
        setValidating(false);
        setShowValidation(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowValidation(false);
      setValidating(false);
    }
  }, [selectedBuildId]);

  const selectedBuild = builds.find(b => b.id === selectedBuildId);
  const failedValidations = selectedBuild && showValidation
    ? (Object.entries(selectedBuild.validations) as [keyof Build['validations'], boolean][]) 
        .filter(([_, passed]) => !passed)
        .map(([key]) => validationLabels[key])
    : [];

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, background: '#fdeaea', minWidth: 500 }}>
        <Typography variant="h5" gutterBottom>Start New Release</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="build-select-label" sx={{ color: 'red' }}>Select Build</InputLabel>
              <Select
                labelId="build-select-label"
                value={selectedBuildId}
                label="Select Build"
                onChange={e => setSelectedBuildId(e.target.value)}
                sx={{ border: '2px solid red', borderRadius: 2, background: '#fff' }}
              >
                <MenuItem value="">
                  <em>Select Build</em>
                </MenuItem>
                {builds.map(build => (
                  <MenuItem key={build.id} value={build.id}>{build.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box mt={3} mb={2}>
              {selectedBuild && (
                <Grid container spacing={1}>
                  {Object.entries(selectedBuild.validations).map(([key, passed]) => (
                    <Grid item xs={12} key={key} display="flex" alignItems="center">
                      <Typography sx={{ flex: 1 }}>{validationLabels[key as keyof Build['validations']]}</Typography>
                      {validating ? (
                        <CircularProgress size={22} />
                      ) : showValidation ? (
                        passed ? (
                          <CheckCircleIcon sx={{ color: 'green' }} />
                        ) : (
                          <CancelIcon sx={{ color: 'red' }} />
                        )
                      ) : null}
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
            <Box display="flex" gap={2}>
              <Button variant="outlined" color="error" disabled={!selectedBuild || validating}>Cancel</Button>
              <Button variant="contained" color="primary" disabled={!selectedBuild || validating}>
                Submit Release
              </Button>
              <Button
                variant="contained"
                sx={{ background: '#f57c00', color: '#fff', '&:hover': { background: '#ef6c00' } }}
                disabled={!selectedBuild || validating || (showValidation && failedValidations.length === 0)}
                onClick={() => setDialogOpen(true)}
              >
                Submit Release With Exception
              </Button>
            </Box>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
              <ReleaseSubmitDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                build={selectedBuild}
                failedValidations={failedValidations}
              />
            </Dialog>
          </>
        )}
      </Paper>
    </Box>
  );
}; 