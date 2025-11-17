# IDP Onboarding – Dynamic Workflow & Event Model

This document describes the **dynamic onboarding workflow** for the IDP Platform and the associated **events / commands**. It is written for engineers designing or implementing the Onboarding Service, Event Bridge, and Harness integration.

---

## 1. High-Level Architecture

**Actors**

- **IDP UI**
  - Allows users to initiate onboarding for an application / service.
- **BFF**
  - API layer between UI and Onboarding Service.
- **Onboarding Service**
  - Workflow orchestrator. Decides which pipelines to run and when.
- **Event Bridge Service**
  - Normalizes and routes messages between services and Harness.
- **IDP Platform (Harness)**
  - Executes pipelines, emits lifecycle events.
- **Downstream Consumers**
  - e.g., Account Vending, Digital Care, etc. Consume onboarding events.

**Pattern**

- Onboarding Service implements a **Process Manager / Saga**.
- Workflows are **data-driven DAGs** persisted as JSON.
- Pipelines are triggered using **commands**.
- Progress is driven by **events** from pipelines and other services.

---

## 2. Dynamic Workflow Model

### 2.1 Workflow Definition

A Workflow Definition describes **what steps to execute** and **their dependencies**.

#### 2.1.1 Fields

- `workflowId` (string, required)  
  Unique identifier (e.g., `"application-onboarding-v1"`).

- `name` (string, required)  
  Human-readable name.

- `version` (integer, required)  
  Increment on breaking changes or major logic changes.

- `triggers` (object, optional)  
  Conditions that select this workflow (e.g., onboarding type, environment).

- `steps` (array of `WorkflowStep`, required)  
  Ordered list of step definitions (DAG, not necessarily sequential).

#### 2.1.2 Sample

```json
{
  "workflowId": "application-onboarding-v1",
  "name": "Application Onboarding",
  "version": 1,
  "triggers": {
    "onboardingType": ["APP"],
    "environment": ["prod", "non-prod"]
  },
  "steps": [
    {
      "id": "create-accounts",
      "type": "PIPELINE",
      "pipelineKey": "harness.account.v1",
      "dependsOn": [],
      "runInParallelGroup": "infra",
      "condition": "env in ['prod', 'non-prod']",
      "inputMapping": {
        "appId": "$.onboarding.appId",
        "ownerId": "$.onboarding.ownerId"
      }
    },
    {
      "id": "setup-ci",
      "type": "PIPELINE",
      "pipelineKey": "harness.ci.v2",
      "dependsOn": ["create-accounts"],
      "runInParallelGroup": "ci-cd"
    },
    {
      "id": "setup-cd",
      "type": "PIPELINE",
      "pipelineKey": "harness.cd.v3",
      "dependsOn": ["create-accounts"],
      "runInParallelGroup": "ci-cd"
    },
    {
      "id": "register-metrics",
      "type": "SERVICE_CALL",
      "service": "metrics-registry",
      "dependsOn": ["setup-ci", "setup-cd"]
    }
  ]
}

2.2 Workflow Step

Represents a node in the workflow DAG.

2.2.1 Fields
	•	id (string, required)
Step identifier, unique within the workflow.
	•	type (string, required)
One of:
	•	"PIPELINE" – external pipeline (Harness/IDP).
	•	"SERVICE_CALL" – synchronous call to internal service.
	•	"SUB_WORKFLOW" – (optional) nested workflow.
	•	pipelineKey (string, required for PIPELINE)
Logical key that maps to a Harness pipeline.
	•	service (string, required for SERVICE_CALL)
Logical service name.
	•	dependsOn (array of string, optional, default: [])
List of step IDs that must complete successfully before this step can start.
	•	runInParallelGroup (string, optional)
Tag to group steps that can run in parallel (for debugging/metrics).
	•	condition (string, optional)
Expression over onboarding context determining if step should run.
	•	inputMapping (object, optional)
Mapping from onboarding context to pipeline/service inputs (e.g., JsonPath).
	•	retryPolicy (object, optional)
Simple structure, e.g., {"maxAttempts": 3, "backoffSeconds": 60}.
	•	timeoutSeconds (integer, optional)
Max allowed runtime before marking as timed-out.

### 2.2.2 Sample Step
```json
{
  "id": "setup-ci",
  "type": "PIPELINE",
  "pipelineKey": "harness.ci.v2",
  "dependsOn": ["create-accounts"],
  "runInParallelGroup": "ci-cd",
  "retryPolicy": {
    "maxAttempts": 3,
    "backoffSeconds": 120
  }
}
```

## 3. Workflow Execution State

3.1 OnboardingInstance

Represents one onboarding run.

3.1.1 Fields
	•	id (string, required)
Unique ID; also used as correlationId in events.
	•	workflowId (string, required)
Reference to WorkflowDefinition.workflowId.
	•	workflowVersion (integer, required)
	•	status (string, required)
One of: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED.
	•	createdAt / updatedAt (timestamps, required)
	•	context (object, required)
Onboarding input and shared data (app metadata, env, user selections).

3.1.2 Sample
```json
{
  "id": "onb-12345",
  "workflowId": "application-onboarding-v1",
  "workflowVersion": 1,
  "status": "RUNNING",
  "createdAt": "2025-11-16T01:00:00Z",
  "updatedAt": "2025-11-16T01:10:10Z",
  "context": {
    "onboardingType": "APP",
    "environment": "prod",
    "appId": "app-789",
    "ownerId": "user-456"
  }
}
```

3.2 StepInstance

Represents one execution of a workflow step.

3.2.1 Fields
	•	id (string, required)
Step instance ID.
	•	onboardingId (string, required)
	•	stepId (string, required)
Reference to WorkflowStep.id.
	•	status (string, required)
One of: PENDING, READY, RUNNING,
COMPLETED, FAILED, SKIPPED, CANCELLED, TIMED_OUT.
	•	externalExecutionId (string, optional)
Harness execution ID or similar.
	•	attempt (integer, required)
Current retry attempt count.
	•	startedAt / completedAt (timestamps, optional)
	•	input (object, optional)
Effective input passed to the pipeline/service.
	•	result (object, optional)
Output payload on success.
	•	error (object, optional)
Contains error code / message / details.

3.2.2 Sample

```json
{
  "id": "step-setup-ci",
  "onboardingId": "onb-12345",
  "stepId": "setup-ci",
  "status": "COMPLETED",
  "externalExecutionId": "harn-exec-001",
  "attempt": 1,
  "startedAt": "2025-11-16T01:02:00Z",
  "completedAt": "2025-11-16T01:05:30Z",
  "input": {
    "appId": "app-789",
    "ownerId": "user-456"
  },
  "result": {
    "artifactRepoUrl": "https://repo/org/app-789",
    "k8sNamespace": "app-789-prod"
  }
}
```

## 4. Message Envelope (All Events & Commands)

All messages use a common envelope to support tracing, auditing, and schema evolution.

4.1 Envelope Fields
	•	meta (object, required)
	•	messageId (string, required) – unique ID (UUID).
	•	type (string, required) – event or command type (e.g., idp.pipeline.completed).
	•	version (integer, required) – schema version of this message type.
	•	timestamp (string, required, ISO-8601) – creation time.
	•	source (string, required) – logical producer ("onboarding-service", "idp-platform.harness").
	•	tenantId (string, optional) – multi-tenant support.
	•	correlationId (string, optional) – groups related messages (onboardingId).
	•	causationId (string, optional) – message that triggered this one.
	•	data (object, required)
Payload defined per command/event type.

4.2 Envelope Example

```json
{
  "meta": {
    "messageId": "7acb1a9f-1e4e-4b9a-a1d6-6ce0a7e67058",
    "type": "idp.pipeline.completed",
    "version": 1,
    "timestamp": "2025-11-16T01:05:30Z",
    "source": "idp-platform.harness",
    "tenantId": "toyota-fs",
    "correlationId": "onb-12345",
    "causationId": "6d8bb7d0-44c6-4c78-a9b8-866c42b7fde0"
  },
  "data": {
    "...": "message specific payload"
  }
}
```

## 5. Commands (Onboarding → Pipelines)

All commands are published to a topic such as idp.commands.pipeline.

5.1 StartPipelineCommand

Meta.type: idp.pipeline.start

Fields (data object)
	•	command (string, required) – constant "START_PIPELINE".
	•	pipelineKey (string, required) – logical pipeline identifier.
	•	onboardingId (string, required).
	•	stepInstanceId (string, required).
	•	input (object, optional) – parameters for the pipeline.

Example

```json
{
  "meta": {
    "messageId": "e4af3df8-5c0f-4be1-9de7-c59a4170d86d",
    "type": "idp.pipeline.start",
    "version": 1,
    "timestamp": "2025-11-16T01:02:00Z",
    "source": "onboarding-service",
    "correlationId": "onb-12345"
  },
  "data": {
    "command": "START_PIPELINE",
    "pipelineKey": "harness.ci.v2",
    "onboardingId": "onb-12345",
    "stepInstanceId": "step-setup-ci",
    "input": {
      "appId": "app-789",
      "ownerId": "user-456"
    }
  }
}
```

5.2 CancelPipelineCommand

Meta.type: idp.pipeline.cancel

Fields (data object)
	•	command (string, required) – constant "CANCEL_PIPELINE".
	•	pipelineKey (string, required).
	•	onboardingId (string, required).
	•	stepInstanceId (string, required).
	•	externalExecutionId (string, optional) – if already started.

Example

```json
{
  "meta": {
    "messageId": "a11f4f9d-50b8-46ed-9fdf-b1af3d1a945a",
    "type": "idp.pipeline.cancel",
    "version": 1,
    "timestamp": "2025-11-16T01:06:00Z",
    "source": "onboarding-service",
    "correlationId": "onb-12345"
  },
  "data": {
    "command": "CANCEL_PIPELINE",
    "pipelineKey": "harness.ci.v2",
    "onboardingId": "onb-12345",
    "stepInstanceId": "step-setup-ci",
    "externalExecutionId": "harn-exec-001"
  }
}
```

## 6. Pipeline Events (Pipelines → Onboarding)

All emitted on a topic such as idp.events.pipeline.

6.1 PipelineStartedEvent

Meta.type: idp.pipeline.started

Fields (data object)
	•	pipelineKey (string, required).
	•	executionId (string, required).
	•	onboardingId (string, optional but recommended).
	•	stepInstanceId (string, optional but recommended).
	•	status (string, required) – usually "RUNNING".
	•	additionalInfo (object, optional).

Example

```json
{
  "meta": {
    "messageId": "1cc6e996-01a4-4af8-bcc2-844347918f1d",
    "type": "idp.pipeline.started",
    "version": 1,
    "timestamp": "2025-11-16T01:02:05Z",
    "source": "idp-platform.harness",
    "correlationId": "onb-12345"
  },
  "data": {
    "pipelineKey": "harness.ci.v2",
    "executionId": "harn-exec-001",
    "onboardingId": "onb-12345",
    "stepInstanceId": "step-setup-ci",
    "status": "RUNNING"
  }
}
```

6.2 PipelineCompletedEvent

Meta.type: idp.pipeline.completed

Fields (data object)
	•	pipelineKey (string, required).
	•	executionId (string, required).
	•	onboardingId (string, optional).
	•	stepInstanceId (string, optional).
	•	status (string, required) – "SUCCEEDED" or "FAILED" (but usually success here).
	•	outputs (object, optional) – result payload.

Example

```json
{
  "meta": {
    "messageId": "f933a9f1-53a7-4a3a-9743-96d21a3b3669",
    "type": "idp.pipeline.completed",
    "version": 1,
    "timestamp": "2025-11-16T01:05:30Z",
    "source": "idp-platform.harness",
    "correlationId": "onb-12345"
  },
  "data": {
    "pipelineKey": "harness.ci.v2",
    "executionId": "harn-exec-001",
    "onboardingId": "onb-12345",
    "stepInstanceId": "step-setup-ci",
    "status": "SUCCEEDED",
    "outputs": {
      "artifactRepoUrl": "https://repo/org/app-789",
      "k8sNamespace": "app-789-prod"
    }
  }
}
```

## 7. Onboarding Lifecycle Events (Onboarding → Other Services)

Published on a topic like idp.events.onboarding. These are consumable by Account Vending, Digital Care, reporting services, etc.

Common Fields (data)
	•	onboardingId (string, required).
	•	workflowId (string, required).
	•	workflowVersion (integer, required).
	•	status (string, optional depending on event).
	•	stepId / stepInstanceId (strings, for step-level events).
	•	context (object, optional) – subset of onboarding context.
	•	timestamp (string, ISO-8601, required).

⸻

7.1 OnboardingStartedEvent

Meta.type: idp.onboarding.started

```json
{
  "meta": {
    "messageId": "bfb5d85a-b47a-4713-86fe-7a5ee4c0f120",
    "type": "idp.onboarding.started",
    "version": 1,
    "timestamp": "2025-11-16T01:00:00Z",
    "source": "onboarding-service",
    "correlationId": "onb-12345"
  },
  "data": {
    "onboardingId": "onb-12345",
    "workflowId": "application-onboarding-v1",
    "workflowVersion": 1,
    "timestamp": "2025-11-16T01:00:00Z",
    "context": {
      "onboardingType": "APP",
      "environment": "prod",
      "appId": "app-789"
    }
  }
}
```

7.2 OnboardingStepStartedEvent

Meta.type: idp.onboarding.step.started

```json
{
  "meta": {
    "messageId": "e3b9d154-4ad7-4aa4-b2b7-9e5b6d4c5a5d",
    "type": "idp.onboarding.step.started",
    "version": 1,
    "timestamp": "2025-11-16T01:02:00Z",
    "source": "onboarding-service",
    "correlationId": "onb-12345"
  },
  "data": {
    "onboardingId": "onb-12345",
    "workflowId": "application-onboarding-v1",
    "workflowVersion": 1,
    "stepId": "setup-ci",
    "stepInstanceId": "step-setup-ci",
    "timestamp": "2025-11-16T01:02:00Z"
  }
}
```

7.3 OnboardingStepCompletedEvent

Meta.type: idp.onboarding.step.completed

```json
{
  "meta": {
    "messageId": "baa07f91-ec87-4f10-8957-9d2ad80d4030",
    "type": "idp.onboarding.step.completed",
    "version": 1,
    "timestamp": "2025-11-16T01:05:30Z",
    "source": "onboarding-service",
    "correlationId": "onb-12345"
  },
  "data": {
    "onboardingId": "onb-12345",
    "workflowId": "application-onboarding-v1",
    "workflowVersion": 1,
    "stepId": "setup-ci",
    "stepInstanceId": "step-setup-ci",
    "status": "COMPLETED",
    "timestamp": "2025-11-16T01:05:30Z",
    "result": {
      "artifactRepoUrl": "https://repo/org/app-789"
    }
  }
}
```

7.4 OnboardingCompletedEvent

Meta.type: idp.onboarding.completed

```json
{
  "meta": {
    "messageId": "f8e7a35a-2db6-4f11-91b5-2d78c515b9a7",
    "type": "idp.onboarding.completed",
    "version": 1,
    "timestamp": "2025-11-16T01:10:00Z",
    "source": "onboarding-service",
    "correlationId": "onb-12345"
  },
  "data": {
    "onboardingId": "onb-12345",
    "workflowId": "application-onboarding-v1",
    "workflowVersion": 1,
    "status": "COMPLETED",
    "timestamp": "2025-11-16T01:10:00Z",
    "context": {
      "onboardingType": "APP",
      "environment": "prod",
      "appId": "app-789"
    }
  }
}
```

7.5 OnboardingFailedEvent

Meta.type: idp.onboarding.failed

```json
{
  "meta": {
    "messageId": "9ab43c32-020f-4c50-9c3b-6cba9a7a0f25",
    "type": "idp.onboarding.failed",
    "version": 1,
    "timestamp": "2025-11-16T01:08:00Z",
    "source": "onboarding-service",
    "correlationId": "onb-12345"
  },
  "data": {
    "onboardingId": "onb-12345",
    "workflowId": "application-onboarding-v1",
    "workflowVersion": 1,
    "status": "FAILED",
    "timestamp": "2025-11-16T01:08:00Z",
    "failedStepId": "setup-ci",
    "failedStepInstanceId": "step-setup-ci",
    "errorCode": "PIPELINE_FAILED",
    "errorMessage": "CI pipeline failed with VALIDATION_ERROR"
  }
}
```

