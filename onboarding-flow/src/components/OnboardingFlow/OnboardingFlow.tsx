import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Container,
} from '@mui/material';
import { OnboardingData } from '../../types';
import { BusinessApplicationList } from './BusinessApplicationList';
import { BusinessApplicationDetails } from './BusinessApplicationDetails';
import { SystemSelection } from './SystemSelection';
import { ComponentCreation } from './ComponentCreation';
import { ReviewAndSubmit } from './ReviewAndSubmit';

// const steps: OnboardingStep[] = [
//   {
//     id: 'ba-list',
//     title: 'Select Business Application',
//     description: 'Choose a business application from the list',
//     completed: false,
//   },
//   {
//     id: 'ba-details',
//     title: 'Business Application Details',
//     description: 'Review BA details and create system',
//     completed: false,
//   },
//   {
//     id: 'system-selection',
//     title: 'System Selection',
//     description: 'Select or create a system',
//     completed: false,
//   },
//   {
//     id: 'component-creation',
//     title: 'Component Creation',
//     description: 'Create a new component',
//     completed: false,
//   },
//   {
//     id: 'review',
//     title: 'Review & Submit',
//     description: 'Review all information and submit',
//     completed: false,
//   },
// ];

const stepLabels = [
  'Business Application Info',
  'System Details',
  'Component Details',
  'DB & S3',
  'Summary',
];

export const OnboardingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedSteps(prev => new Set([...prev, activeStep]));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (stepIndex: number) => {
    if (completedSteps.has(stepIndex) || stepIndex <= activeStep) {
      setActiveStep(stepIndex);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <BusinessApplicationList
            onSelectBA={(ba: any) => {
              updateOnboardingData({ selectedBA: ba });
              handleNext();
            }}
          />
        );
      case 1:
        return (
          <BusinessApplicationDetails
            businessApplication={onboardingData.selectedBA!}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <SystemSelection
            onSelectSystem={(system: any) => {
              updateOnboardingData({ selectedSystem: system });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ComponentCreation
            onComponentCreated={(component: any) => {
              updateOnboardingData({ component });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReviewAndSubmit
            onboardingData={onboardingData}
            onBack={handleBack}
            onSubmit={() => {
              console.log('Onboarding submitted:', onboardingData);
              // Handle submission logic here
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Onboard Business Application
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {stepLabels.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => handleStepClick(index)}
                sx={{ cursor: 'pointer' }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 6 }}>
          {renderStepContent(activeStep)}
        </Box>
      </Paper>
    </Container>
  );
}; 