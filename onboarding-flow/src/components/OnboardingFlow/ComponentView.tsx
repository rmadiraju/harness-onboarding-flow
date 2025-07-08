import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Component } from '../../types';

interface ComponentViewProps {
  component: Component;
  onBack: () => void;
}

export const ComponentView: React.FC<ComponentViewProps> = ({ component, onBack }) => {
  const [open, setOpen] = useState(false);
  const [jiraLink, setJiraLink] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleGenerate = () => {
    // Implement code generation logic here
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Component Details
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
          <Typography variant="h6" gutterBottom>{component.name}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Type</Typography>
          <Typography variant="body1" gutterBottom>{component.type}</Typography>
          <Typography variant="subtitle2" color="text.secondary">Language</Typography>
          <Typography variant="body1" gutterBottom>{component.language}</Typography>
        </CardContent>
      </Card>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Generate Code
      </Button>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Generate Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="JIRA Story Link"
            type="url"
            fullWidth
            value={jiraLink}
            onChange={e => setJiraLink(e.target.value)}
            placeholder="Enter JIRA story link"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleGenerate} variant="contained" color="primary" disabled={!jiraLink.trim()}>
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 