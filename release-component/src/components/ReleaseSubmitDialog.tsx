import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Build } from '../types';

interface ReleaseSubmitDialogProps {
  open: boolean;
  onClose: () => void;
  build?: Build;
  failedValidations: string[];
}

export const ReleaseSubmitDialog: React.FC<ReleaseSubmitDialogProps> = ({
  onClose,
  failedValidations,
}) => {
  const [releaseNotes, setReleaseNotes] = useState('');
  const [exceptionJustification, setExceptionJustification] = useState('');

  const canSubmit =
    releaseNotes.trim().length > 0 &&
    (failedValidations.length === 0 || exceptionJustification.trim().length > 0);

  return (
    <>
      <DialogTitle>Submit Release</DialogTitle>
      <DialogContent>
        <TextField
          label="Release Notes*"
          fullWidth
          multiline
          minRows={3}
          margin="normal"
          value={releaseNotes}
          onChange={e => setReleaseNotes(e.target.value)}
        />
        {failedValidations.length > 0 && (
          <Box mt={2} mb={2}>
            <Typography color="error" fontWeight={600} gutterBottom>
              Failed Validations
            </Typography>
            <List dense>
              {failedValidations.map(val => (
                <ListItem key={val} sx={{ color: 'red' }}>
                  <ListItemText primary={val} />
                </ListItem>
              ))}
            </List>
            <TextField
              label="Exception Justification*"
              fullWidth
              multiline
              minRows={2}
              margin="normal"
              value={exceptionJustification}
              onChange={e => setExceptionJustification(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary" disabled={!canSubmit}>
          Submit
        </Button>
      </DialogActions>
    </>
  );
}; 