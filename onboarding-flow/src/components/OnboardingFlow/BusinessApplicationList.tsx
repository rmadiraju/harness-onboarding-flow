import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { BusinessApplication } from '../../types';
import { OnboardingApi } from '../../api/onboardingApi';

interface BusinessApplicationListProps {
  onSelectBA: (ba: BusinessApplication) => void;
}

export const BusinessApplicationList: React.FC<BusinessApplicationListProps> = ({ onSelectBA }) => {
  const [businessApplications, setBusinessApplications] = useState<BusinessApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBAs = async () => {
      try {
        setLoading(true);
        const data = await OnboardingApi.fetchBusinessApplications();
        setBusinessApplications(data);
      } catch (err) {
        setError('Failed to fetch business applications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBAs();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Business Application
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a business application to begin the onboarding process
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {businessApplications.map((ba) => (
              <TableRow key={ba.id} hover>
                <TableCell>
                  <Typography variant="subtitle1">{ba.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {ba.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSelectBA(ba)}
                    size="small"
                  >
                    Onboard
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {businessApplications.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No business applications found
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 