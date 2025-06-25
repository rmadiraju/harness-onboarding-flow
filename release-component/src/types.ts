// Types for Release Component Plugin

export interface BuildValidations {
  vulnerabilities: boolean;
  componentTests: boolean;
  liveDependency: boolean;
  performance: boolean;
  changeFreeze: boolean;
}

export interface Build {
  id: string;
  label: string;
  validations: BuildValidations;
}

export interface ReleaseSubmission {
  buildId: string;
  releaseNotes: string;
  exceptionJustification?: string;
} 