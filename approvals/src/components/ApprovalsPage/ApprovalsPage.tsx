import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ReleaseApproval } from '../../types';
import { getReleaseApprovals, getExceptionApprovals, approveRelease, validationLabels } from '../../api/approvalsApi';

const ApprovalsPage: React.FC = () => {
  const [releaseApprovals, setReleaseApprovals] = useState<ReleaseApproval[]>([]);
  const [exceptionApprovals, setExceptionApprovals] = useState<ReleaseApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<ReleaseApproval | null>(null);
  const [comments, setComments] = useState('');
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        const [releases, exceptions] = await Promise.all([
          getReleaseApprovals(),
          getExceptionApprovals()
        ]);
        setReleaseApprovals(releases);
        setExceptionApprovals(exceptions);
      } catch (err) {
        setError('Failed to fetch approvals');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const handleOpenModal = (release: ReleaseApproval) => {
    setSelectedRelease(release);
    setModalOpen(true);
    setComments('');
  };

  const handleApprove = async () => {
    if (!selectedRelease) return;
    
    try {
      setApproving(true);
      await approveRelease(selectedRelease.release_id, { approved: true, comments });
      setModalOpen(false);
      setComments('');
      // Refresh the lists
      const [releases, exceptions] = await Promise.all([
        getReleaseApprovals(),
        getExceptionApprovals()
      ]);
      setReleaseApprovals(releases);
      setExceptionApprovals(exceptions);
    } catch (err) {
      setError('Failed to approve release');
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRelease) return;
    
    try {
      setApproving(true);
      await approveRelease(selectedRelease.release_id, { approved: false, comments });
      setModalOpen(false);
      setComments('');
      // Refresh the lists
      const [releases, exceptions] = await Promise.all([
        getReleaseApprovals(),
        getExceptionApprovals()
      ]);
      setReleaseApprovals(releases);
      setExceptionApprovals(exceptions);
    } catch (err) {
      setError('Failed to reject release');
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Approvals</Typography>
      
      {/* Section 1: Release Approval Requests */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Release Approval Requests ({releaseApprovals.length})
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Release ID</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>System</TableCell>
                <TableCell>BA</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {releaseApprovals.map(release => (
                <TableRow 
                  key={release.release_id} 
                  hover 
                  sx={{ cursor: 'pointer' }} 
                  onClick={() => handleOpenModal(release)}
                >
                  <TableCell sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                    {release.release_id}
                  </TableCell>
                  <TableCell>{release.component}</TableCell>
                  <TableCell>{release.system}</TableCell>
                  <TableCell>{release.ba}</TableCell>
                  <TableCell>{release.submitted_by}</TableCell>
                  <TableCell>{release.date_submitted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {releaseApprovals.length === 0 && (
          <Typography variant="body2" sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
            No release approval requests found
          </Typography>
        )}
      </Paper>

      {/* Section 2: Exception Approvals */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Exception Approvals ({exceptionApprovals.length})
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Release ID</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>System</TableCell>
                <TableCell>BA</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exceptionApprovals.map(release => (
                <TableRow 
                  key={release.release_id} 
                  hover 
                  sx={{ cursor: 'pointer' }} 
                  onClick={() => handleOpenModal(release)}
                >
                  <TableCell sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                    {release.release_id}
                  </TableCell>
                  <TableCell>{release.component}</TableCell>
                  <TableCell>{release.system}</TableCell>
                  <TableCell>{release.ba}</TableCell>
                  <TableCell>{release.submitted_by}</TableCell>
                  <TableCell>{release.date_submitted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {exceptionApprovals.length === 0 && (
          <Typography variant="body2" sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
            No exception approvals found
          </Typography>
        )}
      </Paper>

      {/* Modal for release details */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Release Details</DialogTitle>
        <DialogContent>
          {selectedRelease && (
            <Box>
              <Typography><b>Release ID:</b> {selectedRelease.release_id}</Typography>
              <Typography><b>Component:</b> {selectedRelease.component}</Typography>
              <Typography><b>System:</b> {selectedRelease.system}</Typography>
              <Typography><b>BA:</b> {selectedRelease.ba}</Typography>
              <Typography><b>Submitted By:</b> {selectedRelease.submitted_by}</Typography>
              <Typography><b>Date Submitted:</b> {selectedRelease.date_submitted}</Typography>
              <Typography><b>Has Exception:</b> {selectedRelease.has_exception ? 'Yes' : 'No'}</Typography>
              
              <TextField
                label="Release Notes"
                multiline
                minRows={2}
                fullWidth
                value={selectedRelease.release_notes || ''}
                InputProps={{ readOnly: true }}
                sx={{ mt: 3 }}
              />
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Validation Results</Typography>
                {validationLabels.map(validation => (
                  <Box key={validation.key} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <Typography sx={{ minWidth: 220 }}>{validation.label}</Typography>
                    {selectedRelease.validations[validation.key as keyof typeof selectedRelease.validations] === true ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </Box>
                ))}
              </Box>
              
              <TextField
                label="Comments (optional)"
                multiline
                minRows={2}
                fullWidth
                value={comments}
                onChange={e => setComments(e.target.value)}
                sx={{ mt: 3 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleApprove} 
            color="success" 
            variant="contained"
            disabled={approving}
          >
            {approving ? <CircularProgress size={20} /> : 'Approve'}
          </Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={approving}
          >
            {approving ? <CircularProgress size={20} /> : 'Reject'}
          </Button>
          <Button onClick={() => setModalOpen(false)} variant="outlined" disabled={approving}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalsPage; 