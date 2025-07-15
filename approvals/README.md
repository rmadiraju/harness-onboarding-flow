# Approvals Plugin

This plugin provides a page to show lists of releases that were submitted and are waiting for user approval.

## Features

- **Release Approval Requests**: Shows releases that need approval from release approvers
- **Exception Approvals**: Shows releases that need approval from exception approvers
- **Detailed View**: Click on any release to see full details including validation results
- **Approve/Reject Actions**: Approve or reject releases with optional comments

## Usage

The plugin provides a page with two main sections:

1. **Release Approval Requests**: Lists releases submitted for approval by release approvers
2. **Exception Approvals**: Lists releases that require exception approval due to failed validations

Each release can be clicked to view detailed information including:
- Release ID, Component, System, BA
- Submitted by and date
- Release notes
- Validation results (pass/fail for each validation type)
- Option to add comments and approve/reject

## Installation

1. Add the plugin to your Backstage app
2. Import and register the plugin in your app
3. Add the route to your app's routing configuration

## API

The plugin includes mock API functions that can be replaced with real API calls:

- `getReleaseApprovals()`: Fetches releases pending approval
- `getExceptionApprovals()`: Fetches releases pending exception approval
- `approveRelease(releaseId, response)`: Approves or rejects a release

## Types

- `ReleaseApproval`: Interface for release approval data
- `ValidationResult`: Interface for validation results
- `ApprovalResponse`: Interface for approval/rejection response 