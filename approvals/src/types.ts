export interface ValidationResult {
  vulnerabilities: boolean;
  componentTests: boolean;
  liveDependency: boolean;
  performance: boolean;
  changeFreeze: boolean;
}

export interface ReleaseApproval {
  release_id: string;
  component: string;
  system: string;
  ba: string;
  submitted_by: string;
  date_submitted: string;
  validations: ValidationResult;
  has_exception: boolean;
  release_notes: string;
}

export interface ApprovalResponse {
  approved: boolean;
  comments?: string;
} 