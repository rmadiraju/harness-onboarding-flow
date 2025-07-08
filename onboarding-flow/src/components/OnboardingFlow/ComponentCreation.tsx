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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Component } from '../../types';

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      minWidth: 200,
    },
  },
};

interface ComponentCreationProps {
  onComponentCreated: (component: Component) => void;
  onBack: () => void;
}

interface ValidationErrors {
  name?: string;
  type?: string;
  language?: string;
  jiraStoryLink?: string;
}

export const ComponentCreation: React.FC<ComponentCreationProps> = ({
  onComponentCreated,
  onBack,
}) => {
  const [component, setComponent] = useState<Component>({
    name: 'UI',
    type: 'ui',
    language: 'java',
    generateCode: false,
    jiraStoryLink: '',
  });

  const componentTypeMap: Record<string, string> = {
    'Web Application': 'ui',
    'API': 'microservice',
    'Database': 'database',
    'Stream': 'stream',
  };

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!component.name) {
      newErrors.name = 'Component name is required';
    }

    if (!component.type) {
      newErrors.type = 'Component type is required';
    }

    if (!component.language) {
      newErrors.language = 'Language is required';
    }

    if (component.generateCode && !component.jiraStoryLink?.trim()) {
      newErrors.jiraStoryLink = 'JIRA Story Link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComponentCreated(component);
    }
  };

  const handleInputChange = (field: keyof Component, value: any) => {
    if (field === 'name') {
      setComponent(prev => ({
        ...prev,
        name: value as 'UI' | 'API' | 'Database' | 'Stream',
        type: componentTypeMap[value] as 'microservice' | 'stream' | 'ui' | 'database',
      }));
      if (errors['name']) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
      if (errors['type']) {
        setErrors(prev => ({ ...prev, type: undefined }));
      }
    } else {
      setComponent(prev => ({ ...prev, [field]: value }));
      if (errors[field as keyof ValidationErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.name}>
                <InputLabel>Component Name</InputLabel>
                <Select
                  value={component.name}
                  label="Component Name"
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  MenuProps={selectMenuProps}
                  sx={{ minWidth: 200 }}
                >
                  {['Web Application', 'API', 'Database', 'Stream'].map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
                {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.type} disabled>
                <InputLabel>Component Type</InputLabel>
                <Select
                  value={component.type}
                  label="Component Type"
                  disabled
                >
                  <MenuItem value="microservice">Microservice</MenuItem>
                  <MenuItem value="stream">Stream</MenuItem>
                  <MenuItem value="ui">UI</MenuItem>
                  <MenuItem value="database">Database</MenuItem>
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

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!component.generateCode}
                    onChange={e => handleInputChange('generateCode', e.target.checked)}
                  />
                }
                label="Generate Code"
              />
            </Grid>

            {component.generateCode && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="JIRA Story Link"
                  value={component.jiraStoryLink || ''}
                  onChange={e => handleInputChange('jiraStoryLink', e.target.value)}
                  error={!!errors.jiraStoryLink}
                  helperText={errors.jiraStoryLink}
                  placeholder="Enter JIRA story link"
                  required
                />
              </Grid>
            )}
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
          disabled={!component.name || !component.type || !component.language || (component.generateCode && !component.jiraStoryLink?.trim())}
        >
          Review Component
        </Button>
      </Box>
    </Box>
  );
}; 