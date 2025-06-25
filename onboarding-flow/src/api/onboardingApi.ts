import { BusinessApplication, System } from '../types';

const BA_API_URL = 'https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/ba.json';
const SYSTEM_API_URL = 'https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/system.json';

export class OnboardingApi {
  static async fetchBusinessApplications(): Promise<BusinessApplication[]> {
    try {
      const response = await fetch(BA_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch business applications: ${response.statusText}`);
      }
      const data = await response.json();
      return data.businessApplications || [];
    } catch (error) {
      console.error('Error fetching business applications:', error);
      // Return sample data for development
      return [
        {
          id: 'ba-1',
          name: 'E-commerce Platform',
          description: 'Main e-commerce application for online retail',
          email: 'ecommerce@company.com'
        },
        {
          id: 'ba-2',
          name: 'Payment Gateway',
          description: 'Secure payment processing application',
          email: 'payments@company.com'
        },
        {
          id: 'ba-3',
          name: 'Customer Portal',
          description: 'Customer self-service portal application',
          email: 'customer@company.com'
        }
      ];
    }
  }

  static async fetchSystems(): Promise<System[]> {
    try {
      const response = await fetch(SYSTEM_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch systems: ${response.statusText}`);
      }
      const data = await response.json();
      // Handle both formats: direct array or wrapped in systems property
      return Array.isArray(data) ? data : (data.systems || []);
    } catch (error) {
      console.error('Error fetching systems:', error);
      // Return sample data for development
      return [
        {
          id: 'sys-1',
          name: 'E-commerce Platform',
          description: 'Main e-commerce system for online retail operations with product catalog, shopping cart, and order management',
          owner: 'E-commerce Team',
          type: 'Web Application'
        },
        {
          id: 'sys-2',
          name: 'Payment Gateway',
          description: 'Secure payment processing system supporting multiple payment methods including credit cards, digital wallets, and bank transfers',
          owner: 'Payment Team',
          type: 'API Service'
        },
        {
          id: 'sys-3',
          name: 'Customer Portal',
          description: 'Customer self-service portal for account management, order tracking, and support ticket creation',
          owner: 'Customer Success Team',
          type: 'Web Application'
        },
        {
          id: 'sys-4',
          name: 'Inventory Management',
          description: 'Real-time inventory tracking and management system with automated reorder notifications and supplier integration',
          owner: 'Operations Team',
          type: 'Backend Service'
        },
        {
          id: 'sys-5',
          name: 'Analytics Dashboard',
          description: 'Business intelligence and analytics platform providing real-time insights and reporting capabilities',
          owner: 'Data Team',
          type: 'Dashboard'
        },
        {
          id: 'sys-6',
          name: 'Order Processing',
          description: 'Order fulfillment and processing system handling order validation, payment confirmation, and shipping coordination',
          owner: 'Operations Team',
          type: 'Microservice'
        },
        {
          id: 'sys-7',
          name: 'User Authentication',
          description: 'Centralized authentication and authorization system with multi-factor authentication and SSO support',
          owner: 'Security Team',
          type: 'API Service'
        },
        {
          id: 'sys-8',
          name: 'Notification Service',
          description: 'Multi-channel notification system supporting email, SMS, push notifications, and in-app messaging',
          owner: 'Platform Team',
          type: 'Microservice'
        },
        {
          id: 'sys-9',
          name: 'Content Management',
          description: 'Content management system for managing product descriptions, marketing content, and digital assets',
          owner: 'Marketing Team',
          type: 'Web Application'
        },
        {
          id: 'sys-10',
          name: 'Shipping Integration',
          description: 'Shipping and logistics integration system connecting with multiple carriers and providing real-time tracking',
          owner: 'Logistics Team',
          type: 'API Service'
        },
        {
          id: 'sys-11',
          name: 'Recommendation Engine',
          description: 'AI-powered recommendation system providing personalized product suggestions and content recommendations',
          owner: 'Data Science Team',
          type: 'Machine Learning Service'
        },
        {
          id: 'sys-12',
          name: 'Fraud Detection',
          description: 'Real-time fraud detection system using machine learning to identify and prevent fraudulent transactions',
          owner: 'Security Team',
          type: 'AI Service'
        },
        {
          id: 'sys-13',
          name: 'Customer Support',
          description: 'Customer support ticketing system with knowledge base, live chat, and escalation management',
          owner: 'Support Team',
          type: 'Web Application'
        },
        {
          id: 'sys-14',
          name: 'Reporting Engine',
          description: 'Advanced reporting and data visualization system with customizable dashboards and automated report generation',
          owner: 'Business Intelligence Team',
          type: 'Dashboard'
        },
        {
          id: 'sys-15',
          name: 'API Gateway',
          description: 'Centralized API gateway providing rate limiting, authentication, monitoring, and request routing',
          owner: 'Platform Team',
          type: 'API Gateway'
        }
      ];
    }
  }
} 