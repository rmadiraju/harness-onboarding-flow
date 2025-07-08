import { BusinessApplication, System, Component } from '../types';

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
    }
  }

  static async fetchSystems(): Promise<System[]> {
    // Always return local sample data for demo
    return [
      {
        id: 'sys-hr-1',
        name: 'HR Core',
        description: 'Core HR system for employee records',
        owner: 'HR Team',
        type: 'Web Application',
        businessApplicationId: 'ba-demo-1',
      },
      {
        id: 'sys-hr-2',
        name: 'Payroll Engine',
        description: 'Payroll processing and compliance',
        owner: 'HR Team',
        type: 'Backend Service',
        businessApplicationId: 'ba-demo-1',
      },
      {
        id: 'sys-devops-1',
        name: 'CI/CD Pipeline',
        description: 'Continuous integration and deployment',
        owner: 'DevOps Team',
        type: 'API Service',
        businessApplicationId: 'ba-demo-2',
      },
      {
        id: 'sys-devops-2',
        name: 'Monitoring Suite',
        description: 'System and application monitoring',
        owner: 'DevOps Team',
        type: 'Dashboard',
        businessApplicationId: 'ba-demo-2',
      },
    ];
  }

  static async fetchComponents(): Promise<Component[]> {
    // Return sample components for demo
    return [
      {
        name: 'UI',
        type: 'ui',
        language: 'js',
        systemId: 'sys-hr-1',
      },
      {
        name: 'Microservice/API',
        type: 'microservice',
        language: 'go',
        systemId: 'sys-hr-1',
      },
      {
        name: 'UI',
        type: 'ui',
        language: 'js',
        systemId: 'sys-hr-2',
      },
      {
        name: 'Microservice/API',
        type: 'microservice',
        language: 'java',
        systemId: 'sys-hr-2',
      },
      {
        name: 'UI',
        type: 'ui',
        language: 'js',
        systemId: 'sys-devops-1',
      },
      {
        name: 'Microservice/API',
        type: 'microservice',
        language: 'go',
        systemId: 'sys-devops-1',
      },
      {
        name: 'UI',
        type: 'ui',
        language: 'js',
        systemId: 'sys-devops-2',
      },
      {
        name: 'Microservice/API',
        type: 'microservice',
        language: 'go',
        systemId: 'sys-devops-2',
      },
    ];
  }
} 