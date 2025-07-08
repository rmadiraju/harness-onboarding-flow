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
  onViewBADetails?: (ba: BusinessApplication) => void;
}

export const BusinessApplicationList: React.FC<BusinessApplicationListProps> = ({ onSelectBA, onViewBADetails }) => {
  const [businessApplications, setBusinessApplications] = useState<BusinessApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBAs = async () => {
      try {
        setLoading(true);
        const data = await OnboardingApi.fetchBusinessApplications();
        // Add sample onboarded BAs for demo
        const sampleOnboarded = [
          {
            id: 'ba-demo-1',
            name: 'HR Management',
            description: 'HR and payroll management application',
            email: 'hr@company.com',
            onboarded: true
          },
          {
            id: 'ba-demo-2',
            name: 'DevOps Portal',
            description: 'Internal developer and operations portal',
            email: 'devops@company.com',
            onboarded: true
          }
        ];
        setBusinessApplications([...data, ...sampleOnboarded]);
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

  const onboarded = businessApplications.filter(ba => ba.onboarded);
  const notOnboarded = businessApplications.filter(ba => !ba.onboarded);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Onboarded Business Applications
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {onboarded.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No onboarded business applications found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {onboarded.map((ba) => (
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
                    variant="outlined"
                    color="primary"
                    onClick={() => onViewBADetails?.(ba)}
                    size="small"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>
        Not Onboarded Business Applications
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
            {notOnboarded.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No business applications to onboard
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {notOnboarded.map((ba) => (
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
    </Box>
  );
}; 