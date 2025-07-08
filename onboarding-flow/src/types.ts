export interface BusinessApplication {
  id: string;
  name: string;
  description: string;
  email: string;
  onboarded?: boolean;
}

export interface System {
  id: string;
  name: string;
  description: string;
  owner: string;
  type: string;
  businessApplicationId: string;
}

export interface Component {
  name: 'UI' | 'Microservice/API' | 'Database' | 'Stream';
  type: 'microservice' | 'stream' | 'ui' | 'database';
  language: 'java' | 'go' | 'js';
  generateCode?: boolean;
  jiraStoryLink?: string;
  systemId: string;
}

export interface OnboardingData {
  selectedBA?: BusinessApplication;
  selectedSystem?: System;
  component?: Component;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
} 