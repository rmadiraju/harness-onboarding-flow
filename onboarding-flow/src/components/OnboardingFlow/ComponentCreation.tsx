import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  FormHelperText,
} from '@mui/material';
import { Component } from '../../types';

interface ComponentCreationProps {
  onComponentCreated: (component: Component) => void;
  onBack: () => void;
}

interface ValidationErrors {
  name?: string;
  type?: string;
  language?: string;
}

export const ComponentCreation: React.FC<ComponentCreationProps> = ({
  onComponentCreated,
  onBack,
}) => {
  const [component, setComponent] = useState<Component>({
    name: '',
    type: 'microservice',
    language: 'java',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!component.name.trim()) {
      newErrors.name = 'Component name is required';
    }

    if (!component.type) {
      newErrors.type = 'Component type is required';
    }

    if (!component.language) {
      newErrors.language = 'Language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComponentCreated(component);
    }
  };

  const handleInputChange = (field: keyof Component, value: string) => {
    setComponent(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Component Creation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create a new component for your system
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Component Name"
                value={component.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Enter component name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Component Type</InputLabel>
                <Select
                  value={component.type}
                  label="Component Type"
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value="microservice">Microservice</MenuItem>
                  <MenuItem value="stream">Stream</MenuItem>
                  <MenuItem value="ui">UI</MenuItem>
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.language}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={component.language}
                  label="Language"
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="go">Go</MenuItem>
                  <MenuItem value="js">JavaScript</MenuItem>
                </Select>
                {errors.language && <FormHelperText>{errors.language}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!component.name.trim()}
        >
          Review Component
        </Button>
      </Box>
    </Box>
  );
}; 