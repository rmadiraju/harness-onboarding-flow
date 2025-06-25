import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Card, CardContent, Grid, Divider, FormControlLabel, Checkbox, Chip, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Container, Stepper, Step, StepLabel } from '@mui/material';

const BA_API_URL = "https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/ba.json";
const SYSTEM_API_URL = "https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/system.json";
class OnboardingApi {
  static async fetchBusinessApplications() {
    try {
      const response = await fetch(BA_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch business applications: ${response.statusText}`);
      }
      const data = await response.json();
      return data.businessApplications || [];
    } catch (error) {
      console.error("Error fetching business applications:", error);
      return [
        {
          id: "ba-1",
          name: "E-commerce Platform",
          description: "Main e-commerce application for online retail",
          email: "ecommerce@company.com"
        },
        {
          id: "ba-2",
          name: "Payment Gateway",
          description: "Secure payment processing application",
          email: "payments@company.com"
        },
        {
          id: "ba-3",
          name: "Customer Portal",
          description: "Customer self-service portal application",
          email: "customer@company.com"
        }
      ];
    }
  }
  static async fetchSystems() {
    try {
      const response = await fetch(SYSTEM_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch systems: ${response.statusText}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.systems || [];
    } catch (error) {
      console.error("Error fetching systems:", error);
      return [
        {
          id: "sys-1",
          name: "E-commerce Platform",
          description: "Main e-commerce system for online retail operations with product catalog, shopping cart, and order management",
          owner: "E-commerce Team",
          type: "Web Application"
        },
        {
          id: "sys-2",
          name: "Payment Gateway",
          description: "Secure payment processing system supporting multiple payment methods including credit cards, digital wallets, and bank transfers",
          owner: "Payment Team",
          type: "API Service"
        },
        {
          id: "sys-3",
          name: "Customer Portal",
          description: "Customer self-service portal for account management, order tracking, and support ticket creation",
          owner: "Customer Success Team",
          type: "Web Application"
        },
        {
          id: "sys-4",
          name: "Inventory Management",
          description: "Real-time inventory tracking and management system with automated reorder notifications and supplier integration",
          owner: "Operations Team",
          type: "Backend Service"
        },
        {
          id: "sys-5",
          name: "Analytics Dashboard",
          description: "Business intelligence and analytics platform providing real-time insights and reporting capabilities",
          owner: "Data Team",
          type: "Dashboard"
        },
        {
          id: "sys-6",
          name: "Order Processing",
          description: "Order fulfillment and processing system handling order validation, payment confirmation, and shipping coordination",
          owner: "Operations Team",
          type: "Microservice"
        },
        {
          id: "sys-7",
          name: "User Authentication",
          description: "Centralized authentication and authorization system with multi-factor authentication and SSO support",
          owner: "Security Team",
          type: "API Service"
        },
        {
          id: "sys-8",
          name: "Notification Service",
          description: "Multi-channel notification system supporting email, SMS, push notifications, and in-app messaging",
          owner: "Platform Team",
          type: "Microservice"
        },
        {
          id: "sys-9",
          name: "Content Management",
          description: "Content management system for managing product descriptions, marketing content, and digital assets",
          owner: "Marketing Team",
          type: "Web Application"
        },
        {
          id: "sys-10",
          name: "Shipping Integration",
          description: "Shipping and logistics integration system connecting with multiple carriers and providing real-time tracking",
          owner: "Logistics Team",
          type: "API Service"
        },
        {
          id: "sys-11",
          name: "Recommendation Engine",
          description: "AI-powered recommendation system providing personalized product suggestions and content recommendations",
          owner: "Data Science Team",
          type: "Machine Learning Service"
        },
        {
          id: "sys-12",
          name: "Fraud Detection",
          description: "Real-time fraud detection system using machine learning to identify and prevent fraudulent transactions",
          owner: "Security Team",
          type: "AI Service"
        },
        {
          id: "sys-13",
          name: "Customer Support",
          description: "Customer support ticketing system with knowledge base, live chat, and escalation management",
          owner: "Support Team",
          type: "Web Application"
        },
        {
          id: "sys-14",
          name: "Reporting Engine",
          description: "Advanced reporting and data visualization system with customizable dashboards and automated report generation",
          owner: "Business Intelligence Team",
          type: "Dashboard"
        },
        {
          id: "sys-15",
          name: "API Gateway",
          description: "Centralized API gateway providing rate limiting, authentication, monitoring, and request routing",
          owner: "Platform Team",
          type: "API Gateway"
        }
      ];
    }
  }
}

const BusinessApplicationList = ({ onSelectBA }) => {
  const [businessApplications, setBusinessApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBAs = async () => {
      try {
        setLoading(true);
        const data = await OnboardingApi.fetchBusinessApplications();
        setBusinessApplications(data);
      } catch (err) {
        setError("Failed to fetch business applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBAs();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }, /* @__PURE__ */ React.createElement(CircularProgress, null));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error", sx: { mb: 2 } }, error);
  }
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "Select a Business Application"), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 } }, "Choose a business application to begin the onboarding process"), /* @__PURE__ */ React.createElement(TableContainer, { component: Paper }, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("strong", null, "Name")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("strong", null, "Description")), /* @__PURE__ */ React.createElement(TableCell, { align: "center" }, /* @__PURE__ */ React.createElement("strong", null, "Action")))), /* @__PURE__ */ React.createElement(TableBody, null, businessApplications.map((ba) => /* @__PURE__ */ React.createElement(TableRow, { key: ba.id, hover: true }, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, ba.name)), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, ba.description)), /* @__PURE__ */ React.createElement(TableCell, { align: "center" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "contained",
      color: "primary",
      onClick: () => onSelectBA(ba),
      size: "small"
    },
    "Onboard"
  ))))))), businessApplications.length === 0 && /* @__PURE__ */ React.createElement(Box, { textAlign: "center", py: 4 }, /* @__PURE__ */ React.createElement(Typography, { variant: "body1", color: "text.secondary" }, "No business applications found")));
};

const BusinessApplicationDetails = ({
  businessApplication,
  onNext,
  onBack
}) => {
  const [createSystem, setCreateSystem] = useState(false);
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "Business Application Details"), /* @__PURE__ */ React.createElement(Card, { sx: { mb: 3 } }, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 2 }, /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 6 }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", color: "text.secondary" }, "Name"), /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, businessApplication.name)), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 6 }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", color: "text.secondary" }, "Email"), /* @__PURE__ */ React.createElement(Typography, { variant: "body1", gutterBottom: true }, businessApplication.email)), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12 }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", color: "text.secondary" }, "Description"), /* @__PURE__ */ React.createElement(Typography, { variant: "body1", gutterBottom: true }, businessApplication.description))))), /* @__PURE__ */ React.createElement(Divider, { sx: { my: 3 } }), /* @__PURE__ */ React.createElement(Box, { sx: { mb: 3 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "System Configuration"), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 } }, "Choose whether to create a new system or select an existing one"), /* @__PURE__ */ React.createElement(
    FormControlLabel,
    {
      control: /* @__PURE__ */ React.createElement(
        Checkbox,
        {
          checked: createSystem,
          onChange: (e) => setCreateSystem(e.target.checked),
          color: "primary"
        }
      ),
      label: "Create a new system for this onboarding"
    }
  )), /* @__PURE__ */ React.createElement(Box, { display: "flex", justifyContent: "space-between", sx: { mt: 4 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outlined", onClick: onBack }, "Back"), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "contained",
      color: "primary",
      onClick: onNext,
      disabled: !createSystem
    },
    createSystem ? "Continue to System Selection" : "Select System Option"
  )));
};

const SystemSelection = ({
  onSelectSystem,
  onBack
}) => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        setLoading(true);
        const data = await OnboardingApi.fetchSystems();
        setSystems(data);
      } catch (err) {
        setError("Failed to fetch systems");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSystems();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }, /* @__PURE__ */ React.createElement(CircularProgress, null));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error", sx: { mb: 2 } }, error);
  }
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "System Selection"), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 } }, "Select a system for your onboarding process"), /* @__PURE__ */ React.createElement(TableContainer, { component: Paper }, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("strong", null, "Name")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("strong", null, "Description")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("strong", null, "Owner")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("strong", null, "Type")), /* @__PURE__ */ React.createElement(TableCell, { align: "center" }, /* @__PURE__ */ React.createElement("strong", null, "Action")))), /* @__PURE__ */ React.createElement(TableBody, null, systems.map((system) => /* @__PURE__ */ React.createElement(TableRow, { key: system.id, hover: true }, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, system.name)), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, system.description)), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, { variant: "body2" }, system.owner)), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Chip, { label: system.type, size: "small", color: "primary", variant: "outlined" })), /* @__PURE__ */ React.createElement(TableCell, { align: "center" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "contained",
      color: "primary",
      onClick: () => onSelectSystem(system),
      size: "small"
    },
    "Select"
  ))))))), systems.length === 0 && /* @__PURE__ */ React.createElement(Box, { textAlign: "center", py: 4 }, /* @__PURE__ */ React.createElement(Typography, { variant: "body1", color: "text.secondary" }, "No systems found")), /* @__PURE__ */ React.createElement(Box, { display: "flex", justifyContent: "space-between", sx: { mt: 4 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outlined", onClick: onBack }, "Back")));
};

const ComponentCreation = ({
  onComponentCreated,
  onBack
}) => {
  const [component, setComponent] = useState({
    name: "",
    type: "microservice",
    language: "java"
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!component.name.trim()) {
      newErrors.name = "Component name is required";
    }
    if (!component.type) {
      newErrors.type = "Component type is required";
    }
    if (!component.language) {
      newErrors.language = "Language is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (validateForm()) {
      onComponentCreated(component);
    }
  };
  const handleInputChange = (field, value) => {
    setComponent((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  };
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "Component Creation"), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 } }, "Create a new component for your system"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 3 }, /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12 }, /* @__PURE__ */ React.createElement(
    TextField,
    {
      fullWidth: true,
      label: "Component Name",
      value: component.name,
      onChange: (e) => handleInputChange("name", e.target.value),
      error: !!errors.name,
      helperText: errors.name,
      placeholder: "Enter component name"
    }
  )), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 6 }, /* @__PURE__ */ React.createElement(FormControl, { fullWidth: true, error: !!errors.type }, /* @__PURE__ */ React.createElement(InputLabel, null, "Component Type"), /* @__PURE__ */ React.createElement(
    Select,
    {
      value: component.type,
      label: "Component Type",
      onChange: (e) => handleInputChange("type", e.target.value)
    },
    /* @__PURE__ */ React.createElement(MenuItem, { value: "microservice" }, "Microservice"),
    /* @__PURE__ */ React.createElement(MenuItem, { value: "stream" }, "Stream"),
    /* @__PURE__ */ React.createElement(MenuItem, { value: "ui" }, "UI")
  ), errors.type && /* @__PURE__ */ React.createElement(FormHelperText, null, errors.type))), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 6 }, /* @__PURE__ */ React.createElement(FormControl, { fullWidth: true, error: !!errors.language }, /* @__PURE__ */ React.createElement(InputLabel, null, "Language"), /* @__PURE__ */ React.createElement(
    Select,
    {
      value: component.language,
      label: "Language",
      onChange: (e) => handleInputChange("language", e.target.value)
    },
    /* @__PURE__ */ React.createElement(MenuItem, { value: "java" }, "Java"),
    /* @__PURE__ */ React.createElement(MenuItem, { value: "go" }, "Go"),
    /* @__PURE__ */ React.createElement(MenuItem, { value: "js" }, "JavaScript")
  ), errors.language && /* @__PURE__ */ React.createElement(FormHelperText, null, errors.language)))))), /* @__PURE__ */ React.createElement(Box, { display: "flex", justifyContent: "space-between", sx: { mt: 4 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outlined", onClick: onBack }, "Back"), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "contained",
      color: "primary",
      onClick: handleSubmit,
      disabled: !component.name.trim()
    },
    "Review Component"
  )));
};

const ReviewAndSubmit = ({
  onboardingData,
  onBack,
  onSubmit
}) => {
  const { selectedBA, selectedSystem, component } = onboardingData;
  const isComplete = selectedBA && selectedSystem && component;
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "Review & Submit"), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 } }, "Review all the information before submitting your onboarding request"), !isComplete && /* @__PURE__ */ React.createElement(Alert, { severity: "warning", sx: { mb: 3 } }, "Please complete all previous steps before submitting"), /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 3 }, /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 6 }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "Business Application"), selectedBA ? /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1", gutterBottom: true }, selectedBA.name), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true }, selectedBA.description), /* @__PURE__ */ React.createElement(Typography, { variant: "body2" }, /* @__PURE__ */ React.createElement("strong", null, "Email:"), " ", selectedBA.email)) : /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "No business application selected")))), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 6 }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "System"), selectedSystem ? /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1", gutterBottom: true }, selectedSystem.name), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true }, selectedSystem.description), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", gutterBottom: true }, /* @__PURE__ */ React.createElement("strong", null, "Owner:"), " ", selectedSystem.owner), /* @__PURE__ */ React.createElement(Chip, { label: selectedSystem.type, size: "small", color: "primary" })) : /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "No system selected")))), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12 }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", gutterBottom: true }, "Component"), component ? /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 2 }, /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 4 }, /* @__PURE__ */ React.createElement(Typography, { variant: "body2", gutterBottom: true }, /* @__PURE__ */ React.createElement("strong", null, "Name:")), /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, component.name)), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 4 }, /* @__PURE__ */ React.createElement(Typography, { variant: "body2", gutterBottom: true }, /* @__PURE__ */ React.createElement("strong", null, "Type:")), /* @__PURE__ */ React.createElement(Chip, { label: component.type, size: "small", color: "secondary" })), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, md: 4 }, /* @__PURE__ */ React.createElement(Typography, { variant: "body2", gutterBottom: true }, /* @__PURE__ */ React.createElement("strong", null, "Language:")), /* @__PURE__ */ React.createElement(Chip, { label: component.language, size: "small", color: "info" }))) : /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "No component created"))))), /* @__PURE__ */ React.createElement(Divider, { sx: { my: 4 } }), /* @__PURE__ */ React.createElement(Box, { display: "flex", justifyContent: "space-between", sx: { mt: 4 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outlined", onClick: onBack }, "Back"), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "contained",
      color: "primary",
      onClick: onSubmit,
      disabled: !isComplete
    },
    "Submit Onboarding Request"
  )));
};

const stepLabels = [
  "Business Application Info",
  "System Details",
  "Component Details",
  "DB & S3",
  "Summary"
];
const OnboardingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(/* @__PURE__ */ new Set());
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedSteps((prev) => /* @__PURE__ */ new Set([...prev, activeStep]));
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepClick = (stepIndex) => {
    if (completedSteps.has(stepIndex) || stepIndex <= activeStep) {
      setActiveStep(stepIndex);
    }
  };
  const updateOnboardingData = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return /* @__PURE__ */ React.createElement(
          BusinessApplicationList,
          {
            onSelectBA: (ba) => {
              updateOnboardingData({ selectedBA: ba });
              handleNext();
            }
          }
        );
      case 1:
        return /* @__PURE__ */ React.createElement(
          BusinessApplicationDetails,
          {
            businessApplication: onboardingData.selectedBA,
            onNext: handleNext,
            onBack: handleBack
          }
        );
      case 2:
        return /* @__PURE__ */ React.createElement(
          SystemSelection,
          {
            onSelectSystem: (system) => {
              updateOnboardingData({ selectedSystem: system });
              handleNext();
            },
            onBack: handleBack
          }
        );
      case 3:
        return /* @__PURE__ */ React.createElement(
          ComponentCreation,
          {
            onComponentCreated: (component) => {
              updateOnboardingData({ component });
              handleNext();
            },
            onBack: handleBack
          }
        );
      case 4:
        return /* @__PURE__ */ React.createElement(
          ReviewAndSubmit,
          {
            onboardingData,
            onBack: handleBack,
            onSubmit: () => {
              console.log("Onboarding submitted:", onboardingData);
            }
          }
        );
      default:
        return null;
    }
  };
  return /* @__PURE__ */ React.createElement(Container, { maxWidth: "lg" }, /* @__PURE__ */ React.createElement(Box, { sx: { mt: 4, mb: 4 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "h4", gutterBottom: true }, "Onboard Business Application")), /* @__PURE__ */ React.createElement(Paper, { sx: { p: 3 } }, /* @__PURE__ */ React.createElement(Stepper, { activeStep, alternativeLabel: true }, stepLabels.map((label, index) => /* @__PURE__ */ React.createElement(Step, { key: label }, /* @__PURE__ */ React.createElement(
    StepLabel,
    {
      onClick: () => handleStepClick(index),
      sx: { cursor: "pointer" }
    },
    label
  )))), /* @__PURE__ */ React.createElement(Box, { sx: { mt: 6 } }, renderStepContent(activeStep))));
};

export { OnboardingFlow };
//# sourceMappingURL=index-a22e6568.esm.js.map
