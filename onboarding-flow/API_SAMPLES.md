# API Sample JSON Structures

This document contains the expected JSON structures for the APIs used in the onboarding flow.

## Business Applications API (ba.json)

Expected structure for `https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/ba.json`:

```json
{
  "businessApplications": [
    {
      "id": "ba-1",
      "name": "E-commerce Platform",
      "description": "Main e-commerce application for online retail operations",
      "email": "ecommerce@company.com"
    },
    {
      "id": "ba-2",
      "name": "Payment Gateway",
      "description": "Secure payment processing application with multiple payment methods",
      "email": "payments@company.com"
    },
    {
      "id": "ba-3",
      "name": "Customer Portal",
      "description": "Customer self-service portal application for account management",
      "email": "customer@company.com"
    },
    {
      "id": "ba-4",
      "name": "Inventory Management",
      "description": "Real-time inventory tracking and management application",
      "email": "inventory@company.com"
    },
    {
      "id": "ba-5",
      "name": "Analytics Dashboard",
      "description": "Business intelligence and analytics application",
      "email": "analytics@company.com"
    }
  ]
}
```

## Systems API (system.json)

Expected structure for `https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/system.json`:

**Format 1: Direct Array (Currently Used)**
```json
[
  {
    "id": "sys-1",
    "name": "E-commerce Platform",
    "description": "Main e-commerce system for online retail operations with product catalog, shopping cart, and order management",
    "owner": "E-commerce Team",
    "type": "Web Application"
  },
  {
    "id": "sys-2",
    "name": "Payment Gateway",
    "description": "Secure payment processing system supporting multiple payment methods including credit cards, digital wallets, and bank transfers",
    "owner": "Payment Team",
    "type": "API Service"
  },
  {
    "id": "sys-3",
    "name": "Customer Portal",
    "description": "Customer self-service portal for account management, order tracking, and support ticket creation",
    "owner": "Customer Success Team",
    "type": "Web Application"
  }
]
```

**Format 2: Wrapped in Systems Property (Alternative)**
```json
{
  "systems": [
    {
      "id": "sys-1",
      "name": "E-commerce Platform",
      "description": "Main e-commerce system for online retail operations with product catalog, shopping cart, and order management",
      "owner": "E-commerce Team",
      "type": "Web Application"
    },
    {
      "id": "sys-2",
      "name": "Payment Gateway",
      "description": "Secure payment processing system supporting multiple payment methods including credit cards, digital wallets, and bank transfers",
      "owner": "Payment Team",
      "type": "API Service"
    },
    {
      "id": "sys-3",
      "name": "Customer Portal",
      "description": "Customer self-service portal for account management, order tracking, and support ticket creation",
      "owner": "Customer Success Team",
      "type": "Web Application"
    },
    {
      "id": "sys-4",
      "name": "Inventory Management",
      "description": "Real-time inventory tracking and management system with automated reorder notifications and supplier integration",
      "owner": "Operations Team",
      "type": "Backend Service"
    },
    {
      "id": "sys-5",
      "name": "Analytics Dashboard",
      "description": "Business intelligence and analytics platform providing real-time insights and reporting capabilities",
      "owner": "Data Team",
      "type": "Dashboard"
    },
    {
      "id": "sys-6",
      "name": "Order Processing",
      "description": "Order fulfillment and processing system handling order validation, payment confirmation, and shipping coordination",
      "owner": "Operations Team",
      "type": "Microservice"
    },
    {
      "id": "sys-7",
      "name": "User Authentication",
      "description": "Centralized authentication and authorization system with multi-factor authentication and SSO support",
      "owner": "Security Team",
      "type": "API Service"
    },
    {
      "id": "sys-8",
      "name": "Notification Service",
      "description": "Multi-channel notification system supporting email, SMS, push notifications, and in-app messaging",
      "owner": "Platform Team",
      "type": "Microservice"
    },
    {
      "id": "sys-9",
      "name": "Content Management",
      "description": "Content management system for managing product descriptions, marketing content, and digital assets",
      "owner": "Marketing Team",
      "type": "Web Application"
    },
    {
      "id": "sys-10",
      "name": "Shipping Integration",
      "description": "Shipping and logistics integration system connecting with multiple carriers and providing real-time tracking",
      "owner": "Logistics Team",
      "type": "API Service"
    },
    {
      "id": "sys-11",
      "name": "Recommendation Engine",
      "description": "AI-powered recommendation system providing personalized product suggestions and content recommendations",
      "owner": "Data Science Team",
      "type": "Machine Learning Service"
    },
    {
      "id": "sys-12",
      "name": "Fraud Detection",
      "description": "Real-time fraud detection system using machine learning to identify and prevent fraudulent transactions",
      "owner": "Security Team",
      "type": "AI Service"
    },
    {
      "id": "sys-13",
      "name": "Customer Support",
      "description": "Customer support ticketing system with knowledge base, live chat, and escalation management",
      "owner": "Support Team",
      "type": "Web Application"
    },
    {
      "id": "sys-14",
      "name": "Reporting Engine",
      "description": "Advanced reporting and data visualization system with customizable dashboards and automated report generation",
      "owner": "Business Intelligence Team",
      "type": "Dashboard"
    },
    {
      "id": "sys-15",
      "name": "API Gateway",
      "description": "Centralized API gateway providing rate limiting, authentication, monitoring, and request routing",
      "owner": "Platform Team",
      "type": "API Gateway"
    }
  ]
}
```

**Note**: The API is designed to handle both formats automatically. It first checks if the response is a direct array, and if not, it looks for a `systems` property.

## Usage Instructions

1. **For ba.json**: Replace the content at `https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/ba.json` with the business applications JSON structure above.

2. **For system.json**: Replace the content at `https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/system.json` with the systems JSON structure above.

3. **Customization**: You can modify the data in these JSON files to match your actual business applications and systems. The plugin will automatically fetch and display this data.

## Field Descriptions

### Business Application Fields:
- `id`: Unique identifier for the business application
- `name`: Name of the business application
- `description`: Brief description of the application's purpose
- `email`: Contact email for the application

### System Fields:
- `id`: Unique identifier for the system
- `name`: Name of the system
- `description`: Brief description of the system's purpose
- `owner`: Team or person responsible for the system
- `type`: Type of system (e.g., Web Application, API Service, Microservice, Dashboard, etc.)

## System Types Included

The sample systems cover various types of modern applications:

- **Web Applications**: User-facing web interfaces
- **API Services**: Backend services providing data and functionality
- **Microservices**: Small, focused services handling specific business logic
- **Dashboards**: Data visualization and reporting interfaces
- **Machine Learning Services**: AI-powered systems
- **API Gateways**: Centralized API management
- **Backend Services**: Core business logic services

## Fallback Data

If the APIs are not accessible or return empty data, the plugin includes fallback sample data to ensure the onboarding flow can be tested and demonstrated. 