export interface BusinessApplication {
  id: string;
  name: string;
  description: string;
  email: string;
}

export interface System {
  id: string;
  name: string;
  description: string;
  owner: string;
  type: string;
}

export interface Component {
  name: string;
  type: 'microservice' | 'stream' | 'ui';
  language: 'java' | 'go' | 'js';
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