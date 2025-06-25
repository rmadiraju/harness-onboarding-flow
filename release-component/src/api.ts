import { Build } from './types';

const BUILDS_API_URL = 'https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/build.json';

export async function fetchBuilds(): Promise<Build[]> {
  try {
    const response = await fetch(BUILDS_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch builds: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching builds:', error);
    // Fallback sample data
    return [
      {
        id: 'build-123',
        label: 'Build 1.2.4 (2024-06-15)',
        validations: {
          vulnerabilities: true,
          componentTests: true,
          liveDependency: true,
          performance: true,
          changeFreeze: true,
        },
      },
      {
        id: 'build-122',
        label: 'Build 1.2.3 (2024-06-10)',
        validations: {
          vulnerabilities: false,
          componentTests: true,
          liveDependency: true,
          performance: true,
          changeFreeze: true,
        },
      },
      {
        id: 'build-121',
        label: 'Build 1.2.2 (2024-05-15)',
        validations: {
          vulnerabilities: true,
          componentTests: false,
          liveDependency: true,
          performance: false,
          changeFreeze: true,
        },
      },
    ];
  }
} 