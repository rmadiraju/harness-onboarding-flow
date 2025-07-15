import { ReleaseApproval, ApprovalResponse } from '../types';

const validationLabels = [
  { key: 'vulnerabilities', label: 'Validate Build Vulnerabilities' },
  { key: 'componentTests', label: 'Validate Component Tests' },
  { key: 'liveDependency', label: 'Validate Live-Dependency Tests' },
  { key: 'performance', label: 'Validate Performance Tests' },
  { key: 'changeFreeze', label: 'Change Freeze Validation' },
];

const mockReleaseApprovals: ReleaseApproval[] = [
  {
    release_id: 'REL-2001',
    component: 'Lease Processor',
    system: 'Lease End System',
    ba: 'Lease End BA',
    submitted_by: 'alice',
    date_submitted: '2024-06-16',
    validations: {
      vulnerabilities: true,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: true,
    },
    has_exception: false,
    release_notes: 'This release includes bug fixes and performance improvements for Lease Processor.',
  },
  {
    release_id: 'REL-2002',
    component: 'Analytics Engine',
    system: 'Lease End Analytics',
    ba: 'Lease End BA',
    submitted_by: 'bob',
    date_submitted: '2024-06-15',
    validations: {
      vulnerabilities: true,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: true,
    },
    has_exception: false,
    release_notes: 'Adds new analytics dashboard and improves data pipeline reliability.',
  },
];

const mockExceptionApprovals: ReleaseApproval[] = [
  {
    release_id: 'REL-2003',
    component: 'Lending Core Service',
    system: 'Lending Core',
    ba: 'Lending BA',
    submitted_by: 'carol',
    date_submitted: '2024-06-14',
    validations: {
      vulnerabilities: false,
      componentTests: true,
      liveDependency: true,
      performance: false,
      changeFreeze: false,
    },
    has_exception: true,
    release_notes: 'Critical patch for Lending Core Service. Some tests failed but urgent deployment required.',
  },
  {
    release_id: 'REL-2004',
    component: 'Payment Gateway',
    system: 'Payment System',
    ba: 'Payment BA',
    submitted_by: 'david',
    date_submitted: '2024-06-13',
    validations: {
      vulnerabilities: true,
      componentTests: false,
      liveDependency: false,
      performance: true,
      changeFreeze: false,
    },
    has_exception: true,
    release_notes: 'Security update for Payment Gateway. Performance tests passed but component tests failed.',
  },
];

export const getReleaseApprovals = async (): Promise<ReleaseApproval[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockReleaseApprovals;
};

export const getExceptionApprovals = async (): Promise<ReleaseApproval[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockExceptionApprovals;
};

export const approveRelease = async (releaseId: string, response: ApprovalResponse): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Release ${releaseId} ${response.approved ? 'approved' : 'rejected'} with comments: ${response.comments}`);
};

export { validationLabels }; 