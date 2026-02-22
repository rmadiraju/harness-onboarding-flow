# End-to-End Testing Strategy: Developer Platform

## 1. Executive Summary

This document outlines the comprehensive End-to-End (E2E) testing strategy for our Developer Platform — covering UI onboarding, API interactions, Git repository provisioning, Harness pipeline execution, AWS resource vending, and full deployment lifecycle validation. The E2E suite is orchestrated as a **Harness Pipeline** with discrete stages, enabling repeatable, observable, and debuggable test runs.

---

## 2. System Under Test — Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPER PLATFORM                                │
│                                                                          │
│  ┌────────────┐    ┌──────────────┐    ┌──────────────────────────────┐  │
│  │  UI App    │───▶│  Platform    │───▶│  Provisioning Engine         │  │
│  │ (Onboard)  │    │  APIs        │    │  ┌─────────┐  ┌───────────┐ │  │
│  │            │    │              │    │  │ Git Repo│  │ AWS Accts │ │  │
│  │ - View Pg  │    │ - Onboard   │    │  │ + Hello │  │ + RDS     │ │  │
│  │ - Onboard  │    │ - Resources │    │  │   World │  │ + S3      │ │  │
│  │   Page     │    │ - Status    │    │  │         │  │ + Dynamo  │ │  │
│  └────────────┘    └──────────────┘    │  └─────────┘  │ + μSvc   │ │  │
│                                        │               └───────────┘ │  │
│                                        └──────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │  Harness Pipelines (Auto-generated per customer)                  │   │
│  │  ┌────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐  ┌────────┐ │   │
│  │  │PR Build│  │ Feature  │  │  Main  │  │ Release  │  │Release │ │   │
│  │  │Trigger │  │ Branch   │  │ Build  │  │ to STG   │  │to PROD │ │   │
│  │  └────────┘  └──────────┘  └────────┘  └──────────┘  └────────┘ │   │
│  └───────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

### What Gets Created During Onboarding

| Asset | Description |
|-------|-------------|
| **Git Repository** | Pre-populated with hello-world sample app, Dockerfile, build configs |
| **Harness Pipelines** | PR trigger, feature branch trigger, main branch build, release-to-STG, release-to-PROD |
| **AWS Accounts** | Dev, Test, Staging, Production (or subset based on request) |
| **AWS Resources** | Any combination of: Microservice infra, RDS, S3, DynamoDB |

---

## 3. E2E Testing Philosophy

### 3.1 Core Principles

1. **Test the real thing** — Use the actual UI, real APIs, real Git repos, and real AWS resources. No mocks at the E2E level.
2. **Idempotent & Repeatable** — Every run starts with cleanup. Same test data, same test user, deterministic outcomes.
3. **Observable** — Every stage produces logs, screenshots, API responses, and status artifacts. Failures are diagnosable without re-running.
4. **Stage-gated** — Each stage validates a layer of the system. A failure in Stage 2 means we don't waste time on Stage 5.
5. **Parallelism where safe** — Independent validations (e.g., checking S3 and DynamoDB) run in parallel; sequential operations (e.g., deploy-to-dev then deploy-to-stg) remain serial.

### 3.2 Scope Matrix

| Layer | What We Test | Tool/Approach |
|-------|-------------|---------------|
| **UI** | Onboarding form submission, page navigation, error states | Playwright / Selenium |
| **API** | Onboarding API, status polling, resource provisioning APIs | REST client (curl / Python requests / Postman/Newman) |
| **Git** | Repo creation, branch structure, file content, commit/push triggers | Git CLI / GitHub/GitLab API |
| **Harness Pipelines** | Pipeline existence, trigger validation, execution success | Harness API |
| **AWS Resources** | Account existence, resource creation (RDS, S3, DynamoDB, ECS/EKS) | AWS SDK (boto3) / AWS CLI |
| **Deployment** | Hello-world deploys to dev/test/stg/prod successfully | HTTP health checks + Harness API |
| **Pipeline Triggers** | File change triggers correct pipeline | Git push + Harness API polling |

---

## 4. Test Data Strategy

### 4.1 Dedicated Test Identity

```yaml
test_user:
  name: "e2e-test-platform-user"
  email: "e2e-test@internal.company.com"
  team: "platform-e2e"

test_project:
  name: "e2e-test-project-001"
  resources:
    - microservice
    - rds
    - s3
    - dynamodb
```

### 4.2 Data Isolation Rules

- Test user and project use a **dedicated namespace/prefix** (`e2e-test-*`) so cleanup is safe and targeted.
- AWS resources are tagged with `Environment: e2e-test` and `ManagedBy: e2e-pipeline`.
- Git repos are created under a dedicated org/group or with a naming convention like `e2e-test-project-*`.
- **Never share test data with manual/exploratory testing.**

### 4.3 Cleanup-First Pattern

Every E2E run begins by tearing down any artifacts from the previous run. This ensures:
- No stale state pollutes results.
- Same test data can be reused across runs.
- Partial failures from previous runs don't block the next run.

---

## 5. Harness Pipeline — E2E Test Orchestration

The E2E test suite is itself a Harness pipeline with the following stages:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    E2E TEST ORCHESTRATION PIPELINE                          │
│                                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │ Stage 1  │──▶│ Stage 2  │──▶│ Stage 3  │──▶│ Stage 4  │──▶│ Stage 5  │ │
│  │ Cleanup  │   │ UI       │   │ Provision │   │ Resource │   │ Pipeline │ │
│  │ & Reset  │   │ Onboard  │   │ Verify   │   │ Verify   │   │ & Deploy │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│                                                                             │
│       ┌──────────┐   ┌──────────┐   ┌──────────┐                           │
│  ────▶│ Stage 6  │──▶│ Stage 7  │──▶│ Stage 8  │                           │
│       │ Trigger  │   │ Multi-Env│   │ Report & │                           │
│       │ Validate │   │ Deploy   │   │ Cleanup  │                           │
│       └──────────┘   └──────────┘   └──────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Stage 1: Cleanup & Reset

**Purpose:** Destroy all artifacts from previous E2E runs to guarantee a clean slate.

**Steps:**

| Step | Action | How |
|------|--------|-----|
| 1.1 | Delete test Git repo if exists | Git provider API (GitHub/GitLab) — `DELETE /repos/{owner}/{e2e-test-repo}` |
| 1.2 | Delete Harness pipelines for test project | Harness API — delete pipelines matching `e2e-test-*` |
| 1.3 | Tear down AWS resources | AWS SDK — delete RDS instances, S3 buckets (empty first), DynamoDB tables, ECS services tagged `e2e-test` |
| 1.4 | Clean up AWS accounts / org units | AWS Organizations API or custom cleanup script |
| 1.5 | Remove test user/project from platform DB | Platform Admin API — `DELETE /admin/projects/{e2e-test-project-001}` |
| 1.6 | Wait for async cleanup to complete | Poll status endpoints / CloudFormation stack deletion |

**Validation:** All cleanup operations return success or "not found" (idempotent). No dangling resources exist.

**Error Handling:** If cleanup fails, the stage should **retry once**, then **fail the entire pipeline** with detailed logs. Never proceed with stale state.

```yaml
# Pseudo Harness Stage Definition
stage:
  name: "Cleanup & Reset"
  type: Custom
  spec:
    execution:
      steps:
        - step:
            name: "Delete Git Repo"
            type: ShellScript
            spec:
              shell: Bash
              source:
                type: Inline
                spec:
                  script: |
                    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
                      -X DELETE \
                      -H "Authorization: token ${GIT_TOKEN}" \
                      "https://api.github.com/repos/${ORG}/${E2E_REPO_NAME}")
                    if [[ "$RESPONSE" == "204" || "$RESPONSE" == "404" ]]; then
                      echo "Git repo cleanup: OK"
                    else
                      echo "Git repo cleanup failed: HTTP $RESPONSE"
                      exit 1
                    fi
        - step:
            name: "Teardown AWS Resources"
            type: ShellScript
            spec:
              shell: Bash
              source:
                type: Inline
                spec:
                  script: |
                    python3 scripts/e2e_aws_cleanup.py \
                      --tag-key "Environment" \
                      --tag-value "e2e-test" \
                      --region us-east-1
        - step:
            name: "Remove Platform Project"
            type: ShellScript
            spec:
              shell: Bash
              source:
                type: Inline
                spec:
                  script: |
                    curl -X DELETE \
                      -H "Authorization: Bearer ${PLATFORM_ADMIN_TOKEN}" \
                      "${PLATFORM_API}/admin/projects/${E2E_PROJECT_ID}" \
                      --fail || echo "Project not found, continuing"
```

---

### Stage 2: UI Onboarding

**Purpose:** Simulate a developer onboarding through the actual UI.

**Steps:**

| Step | Action | How |
|------|--------|-----|
| 2.1 | Navigate to platform View page | Playwright: `page.goto(PLATFORM_URL)` |
| 2.2 | Validate View page loads correctly | Assert page title, key elements visible |
| 2.3 | Navigate to Onboard page | Click onboard CTA / navigate directly |
| 2.4 | Fill onboarding form | Playwright: fill project name, team, resource selections (microservice + RDS + S3 + DynamoDB) |
| 2.5 | Submit onboarding request | Click submit, wait for confirmation |
| 2.6 | Capture confirmation / request ID | Extract request ID from UI response |
| 2.7 | Screenshot at each step | Playwright screenshots saved as pipeline artifacts |

**Validation:**
- Onboarding form accepts all inputs without error.
- Submission returns a success status and a trackable request ID.
- No console errors in the browser.

**Tool: Playwright Test Script (TypeScript)**

```typescript
// e2e/tests/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('Developer onboarding - full flow', async ({ page }) => {
  // Step 2.1 — View Page
  await page.goto(process.env.PLATFORM_URL!);
  await expect(page).toHaveTitle(/Developer Platform/);
  await page.screenshot({ path: 'artifacts/01-view-page.png' });

  // Step 2.3 — Navigate to Onboard
  await page.click('[data-testid="onboard-cta"]');
  await expect(page.locator('h1')).toContainText('Onboard');
  await page.screenshot({ path: 'artifacts/02-onboard-page.png' });

  // Step 2.4 — Fill form
  await page.fill('[data-testid="project-name"]', 'e2e-test-project-001');
  await page.fill('[data-testid="team-name"]', 'platform-e2e');
  await page.check('[data-testid="resource-microservice"]');
  await page.check('[data-testid="resource-rds"]');
  await page.check('[data-testid="resource-s3"]');
  await page.check('[data-testid="resource-dynamodb"]');
  await page.screenshot({ path: 'artifacts/03-form-filled.png' });

  // Step 2.5 — Submit
  await page.click('[data-testid="submit-onboard"]');
  
  // Step 2.6 — Capture confirmation
  const confirmation = page.locator('[data-testid="request-id"]');
  await expect(confirmation).toBeVisible({ timeout: 30000 });
  const requestId = await confirmation.textContent();
  console.log(`::set-output name=REQUEST_ID::${requestId}`);
  await page.screenshot({ path: 'artifacts/04-confirmation.png' });
});
```

**Alternative — API-Only Onboarding (Headless):**

For faster, more reliable runs, Stage 2 can optionally be replaced with a direct API call. Run UI tests separately on a different cadence (e.g., nightly) and use API onboarding for the critical-path E2E pipeline.

```bash
REQUEST_ID=$(curl -s -X POST "${PLATFORM_API}/onboard" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "e2e-test-project-001",
    "team": "platform-e2e",
    "resources": ["microservice", "rds", "s3", "dynamodb"]
  }' | jq -r '.requestId')

echo "Request ID: $REQUEST_ID"
```

---

### Stage 3: Provisioning Wait & Verify

**Purpose:** Wait for the asynchronous provisioning to complete and verify all expected assets exist.

**Steps:**

| Step | Action | How |
|------|--------|-----|
| 3.1 | Poll provisioning status API | Loop with backoff until status = `COMPLETED` or timeout (15 min) |
| 3.2 | Verify Git repo exists | Git API: `GET /repos/{org}/{e2e-test-project-001}` |
| 3.3 | Verify repo has hello-world content | Git API: check file tree for expected files (Dockerfile, src/, etc.) |
| 3.4 | Verify Harness pipelines created | Harness API: list pipelines for project |
| 3.5 | Store provisioning outputs | Capture AWS account IDs, repo URL, pipeline IDs as pipeline variables |

**Polling Script:**

```python
#!/usr/bin/env python3
# scripts/poll_provisioning.py
import time, requests, sys, os

API = os.environ["PLATFORM_API"]
TOKEN = os.environ["PLATFORM_TOKEN"]
REQUEST_ID = os.environ["REQUEST_ID"]
TIMEOUT = 900  # 15 minutes
INTERVAL = 30  # poll every 30 seconds

start = time.time()
while time.time() - start < TIMEOUT:
    resp = requests.get(
        f"{API}/onboard/status/{REQUEST_ID}",
        headers={"Authorization": f"Bearer {TOKEN}"}
    )
    data = resp.json()
    status = data.get("status")
    print(f"[{int(time.time()-start)}s] Status: {status}")
    
    if status == "COMPLETED":
        print("Provisioning complete!")
        # Output provisioned asset details
        print(f"GIT_REPO_URL={data['gitRepoUrl']}")
        print(f"AWS_ACCOUNT_DEV={data['awsAccounts']['dev']}")
        print(f"AWS_ACCOUNT_STG={data['awsAccounts']['stg']}")
        print(f"AWS_ACCOUNT_PROD={data['awsAccounts']['prod']}")
        sys.exit(0)
    elif status == "FAILED":
        print(f"Provisioning FAILED: {data.get('error')}")
        sys.exit(1)
    
    time.sleep(INTERVAL)

print("TIMEOUT: Provisioning did not complete in time")
sys.exit(1)
```

---

### Stage 4: Resource Verification

**Purpose:** Validate every provisioned resource actually exists and is correctly configured.

**Parallel step groups** — these can run concurrently since they are independent.

#### 4A: Git Repo Validation

| Check | Expected |
|-------|----------|
| Repo exists at expected URL | 200 OK |
| Default branch is `main` | Branch = `main` |
| Contains `Dockerfile` | File exists at root |
| Contains sample app source | `src/` directory with hello-world code |
| Contains Harness pipeline configs | `.harness/` directory or equivalent |
| Branch protection rules set | `main` branch protected |

```bash
# Git repo structure validation
REPO_URL="https://api.github.com/repos/${ORG}/${E2E_REPO_NAME}"
FILES=$(curl -s -H "Authorization: token ${GIT_TOKEN}" \
  "${REPO_URL}/git/trees/main?recursive=1" | jq -r '.tree[].path')

for EXPECTED in "Dockerfile" "src/" ".harness/"; do
  echo "$FILES" | grep -q "$EXPECTED" && echo "✅ $EXPECTED found" || \
    { echo "❌ $EXPECTED MISSING"; exit 1; }
done
```

#### 4B: Harness Pipeline Validation

| Check | Expected |
|-------|----------|
| PR trigger pipeline exists | Pipeline with PR webhook trigger |
| Feature branch pipeline exists | Pipeline with feature/* branch trigger |
| Main branch pipeline exists | Pipeline triggered on main merge |
| Release-to-STG pipeline exists | Pipeline with STG deployment stage |
| Release-to-PROD pipeline exists | Pipeline with PROD deployment + approval |

```bash
# Harness pipeline validation
PIPELINES=$(curl -s -H "x-api-key: ${HARNESS_API_KEY}" \
  "${HARNESS_API}/pipelines?projectIdentifier=${E2E_PROJECT_ID}" \
  | jq -r '.data.content[].pipeline.name')

for EXPECTED in "pr-build" "feature-build" "main-build" "release-stg" "release-prod"; do
  echo "$PIPELINES" | grep -qi "$EXPECTED" && echo "✅ Pipeline $EXPECTED found" || \
    { echo "❌ Pipeline $EXPECTED MISSING"; exit 1; }
done
```

#### 4C: AWS Resource Validation

| Resource | Validation |
|----------|-----------|
| **AWS Accounts** | Account exists, assume-role works |
| **Microservice** | ECS service or EKS deployment exists in dev account |
| **RDS** | DB instance exists, status = `available` |
| **S3** | Bucket exists, correct tags and encryption |
| **DynamoDB** | Table exists, correct key schema |

```python
#!/usr/bin/env python3
# scripts/verify_aws_resources.py
import boto3

def verify_s3(session, bucket_name):
    s3 = session.client('s3')
    try:
        s3.head_bucket(Bucket=bucket_name)
        # Check encryption
        enc = s3.get_bucket_encryption(Bucket=bucket_name)
        assert enc['ServerSideEncryptionConfiguration'], "No encryption!"
        print(f"✅ S3 bucket {bucket_name} exists with encryption")
    except Exception as e:
        print(f"❌ S3 bucket {bucket_name} failed: {e}")
        raise

def verify_rds(session, db_identifier):
    rds = session.client('rds')
    resp = rds.describe_db_instances(DBInstanceIdentifier=db_identifier)
    status = resp['DBInstances'][0]['DBInstanceStatus']
    assert status == 'available', f"RDS status: {status}"
    print(f"✅ RDS {db_identifier} is available")

def verify_dynamodb(session, table_name):
    dynamodb = session.client('dynamodb')
    resp = dynamodb.describe_table(TableName=table_name)
    status = resp['Table']['TableStatus']
    assert status == 'ACTIVE', f"DynamoDB status: {status}"
    print(f"✅ DynamoDB {table_name} is ACTIVE")

def verify_ecs_service(session, cluster, service_name):
    ecs = session.client('ecs')
    resp = ecs.describe_services(cluster=cluster, services=[service_name])
    assert len(resp['services']) > 0, "ECS service not found"
    status = resp['services'][0]['status']
    assert status == 'ACTIVE', f"ECS service status: {status}"
    print(f"✅ ECS service {service_name} is ACTIVE")
```

---

### Stage 5: Initial Pipeline Execution & Hello-World Deployment

**Purpose:** Trigger the main-branch pipeline and validate hello-world deploys to the dev environment.

**Steps:**

| Step | Action | How |
|------|--------|-----|
| 5.1 | Trigger main-branch pipeline via Harness API | `POST /pipeline/execute` |
| 5.2 | Poll pipeline execution status | Loop until `SUCCESS` or `FAILED` |
| 5.3 | Validate deployment to dev | HTTP GET to hello-world endpoint, expect 200 + expected body |
| 5.4 | Check application logs | CloudWatch/logging to confirm clean startup |

```bash
# Trigger main branch pipeline
EXECUTION_ID=$(curl -s -X POST \
  -H "x-api-key: ${HARNESS_API_KEY}" \
  -H "Content-Type: application/json" \
  "${HARNESS_API}/pipeline/execute/${MAIN_PIPELINE_ID}" \
  -d '{"inputSetReferences": []}' \
  | jq -r '.data.planExecution.uuid')

# Poll for completion
scripts/poll_pipeline.sh "$EXECUTION_ID" 600  # 10 min timeout

# Validate hello-world deployment
HTTP_CODE=$(curl -s -o response.txt -w "%{http_code}" \
  "https://e2e-test-project-001.dev.internal.company.com/health")

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Hello-world deployed to DEV successfully"
  cat response.txt
else
  echo "❌ Hello-world deployment failed: HTTP $HTTP_CODE"
  exit 1
fi
```

---

### Stage 6: Pipeline Trigger Validation

**Purpose:** Verify that Git events (push, PR) correctly trigger the associated Harness pipelines.

This is a critical test — it proves the webhook/trigger integration works end-to-end.

**Steps:**

| Step | Action | How |
|------|--------|-----|
| 6.1 | Clone the provisioned repo | `git clone` |
| 6.2 | Create a feature branch | `git checkout -b feature/e2e-trigger-test` |
| 6.3 | Modify a file (e.g., README.md) | Append a timestamp line |
| 6.4 | Push the feature branch | `git push origin feature/e2e-trigger-test` |
| 6.5 | Verify feature pipeline triggered | Harness API: check for new execution on feature pipeline |
| 6.6 | Create a PR to main | Git API: create pull request |
| 6.7 | Verify PR pipeline triggered | Harness API: check for new execution on PR pipeline |
| 6.8 | Merge PR | Git API: merge PR |
| 6.9 | Verify main pipeline triggered | Harness API: check for new execution on main pipeline |

```bash
#!/bin/bash
# scripts/trigger_validation.sh

REPO_DIR=$(mktemp -d)
git clone "https://${GIT_TOKEN}@github.com/${ORG}/${E2E_REPO_NAME}.git" "$REPO_DIR"
cd "$REPO_DIR"

# --- Feature Branch Push ---
git checkout -b feature/e2e-trigger-test
echo "# E2E trigger test - $(date -u +%Y%m%dT%H%M%SZ)" >> README.md
git add README.md
git commit -m "e2e: trigger validation test"
git push origin feature/e2e-trigger-test

echo "Waiting 60s for feature pipeline trigger..."
sleep 60

FEATURE_EXEC=$(curl -s -H "x-api-key: ${HARNESS_API_KEY}" \
  "${HARNESS_API}/pipeline/executions?pipelineId=${FEATURE_PIPELINE_ID}&status=Running" \
  | jq -r '.data.content[0].planExecution.uuid // empty')

if [[ -n "$FEATURE_EXEC" ]]; then
  echo "✅ Feature branch push triggered pipeline: $FEATURE_EXEC"
else
  echo "❌ Feature branch push did NOT trigger pipeline"
  exit 1
fi

# --- PR Creation ---
PR_URL=$(curl -s -X POST \
  -H "Authorization: token ${GIT_TOKEN}" \
  "https://api.github.com/repos/${ORG}/${E2E_REPO_NAME}/pulls" \
  -d '{
    "title": "e2e: trigger validation",
    "head": "feature/e2e-trigger-test",
    "base": "main"
  }' | jq -r '.url')

echo "Waiting 60s for PR pipeline trigger..."
sleep 60

PR_EXEC=$(curl -s -H "x-api-key: ${HARNESS_API_KEY}" \
  "${HARNESS_API}/pipeline/executions?pipelineId=${PR_PIPELINE_ID}&status=Running" \
  | jq -r '.data.content[0].planExecution.uuid // empty')

if [[ -n "$PR_EXEC" ]]; then
  echo "✅ PR creation triggered pipeline: $PR_EXEC"
else
  echo "❌ PR creation did NOT trigger pipeline"
  exit 1
fi

# --- Merge PR ---
PR_NUMBER=$(echo "$PR_URL" | grep -oP '\d+$')
curl -s -X PUT \
  -H "Authorization: token ${GIT_TOKEN}" \
  "https://api.github.com/repos/${ORG}/${E2E_REPO_NAME}/pulls/${PR_NUMBER}/merge" \
  -d '{"merge_method": "squash"}'

echo "Waiting 60s for main pipeline trigger..."
sleep 60

MAIN_EXEC=$(curl -s -H "x-api-key: ${HARNESS_API_KEY}" \
  "${HARNESS_API}/pipeline/executions?pipelineId=${MAIN_PIPELINE_ID}&status=Running" \
  | jq -r '.data.content[0].planExecution.uuid // empty')

if [[ -n "$MAIN_EXEC" ]]; then
  echo "✅ PR merge triggered main pipeline: $MAIN_EXEC"
else
  echo "❌ PR merge did NOT trigger main pipeline"
  exit 1
fi
```

---

### Stage 7: Multi-Environment Deployment Validation

**Purpose:** Validate the hello-world app can be promoted through all environments: dev → test → stg → prod.

**Steps:**

| Step | Action | Validation |
|------|--------|-----------|
| 7.1 | Deploy to Dev (already done in Stage 5) | Health check 200 |
| 7.2 | Trigger deploy to Test | Harness API trigger, health check |
| 7.3 | Trigger deploy to STG | Harness API trigger (release-stg pipeline), health check |
| 7.4 | Auto-approve STG (if approval gate) | Harness API approval |
| 7.5 | Trigger deploy to PROD | Harness API trigger (release-prod pipeline), health check |
| 7.6 | Auto-approve PROD (if approval gate) | Harness API approval |
| 7.7 | Validate all environments healthy | Parallel health checks on all 4 environments |

```python
#!/usr/bin/env python3
# scripts/validate_deployments.py
import requests, os, time

ENVIRONMENTS = {
    "dev":  f"https://e2e-test-project-001.dev.internal.company.com/health",
    "test": f"https://e2e-test-project-001.test.internal.company.com/health",
    "stg":  f"https://e2e-test-project-001.stg.internal.company.com/health",
    "prod": f"https://e2e-test-project-001.prod.internal.company.com/health",
}

EXPECTED_BODY = {"status": "healthy", "app": "hello-world"}

results = {}
for env, url in ENVIRONMENTS.items():
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200 and resp.json().get("status") == "healthy":
            results[env] = "✅ PASS"
        else:
            results[env] = f"❌ FAIL (HTTP {resp.status_code})"
    except Exception as e:
        results[env] = f"❌ FAIL ({e})"

for env, result in results.items():
    print(f"  {env:>5}: {result}")

if any("FAIL" in r for r in results.values()):
    exit(1)
```

---

### Stage 8: Reporting & Final Cleanup

**Purpose:** Generate a test report and optionally clean up (or leave resources for debugging).

**Steps:**

| Step | Action |
|------|--------|
| 8.1 | Aggregate results from all stages |
| 8.2 | Generate HTML/Markdown test report |
| 8.3 | Upload screenshots and logs as artifacts |
| 8.4 | Send notification (Slack/email) with pass/fail summary |
| 8.5 | Conditional cleanup — on SUCCESS: full cleanup; on FAILURE: leave resources for debugging |

```yaml
stage:
  name: "Report & Cleanup"
  type: Custom
  when:
    condition: Always  # Run even if previous stages fail
  spec:
    execution:
      steps:
        - step:
            name: "Generate Report"
            type: ShellScript
            spec:
              script: |
                python3 scripts/generate_report.py \
                  --stages-json "${STAGE_RESULTS}" \
                  --output artifacts/e2e-report.html
        - step:
            name: "Notify"
            type: ShellScript
            spec:
              script: |
                curl -X POST "${SLACK_WEBHOOK}" \
                  -H "Content-Type: application/json" \
                  -d "{
                    \"text\": \"E2E Test Run: ${PIPELINE_STATUS}\\nDuration: ${DURATION}\\nDetails: ${PIPELINE_URL}\"
                  }"
        - step:
            name: "Conditional Cleanup"
            type: ShellScript
            spec:
              script: |
                if [[ "${PIPELINE_STATUS}" == "SUCCESS" ]]; then
                  echo "Full cleanup after successful run"
                  python3 scripts/e2e_aws_cleanup.py --tag-value "e2e-test"
                else
                  echo "Skipping cleanup — resources preserved for debugging"
                  echo "Run manual cleanup when done: make e2e-cleanup"
                fi
```

---

## 6. Environment & Secret Management

| Secret | Storage | Usage |
|--------|---------|-------|
| `GIT_TOKEN` | Harness Secrets Manager | Git API operations |
| `PLATFORM_ADMIN_TOKEN` | Harness Secrets Manager | Platform API cleanup/admin |
| `HARNESS_API_KEY` | Harness Secrets Manager | Pipeline trigger & status |
| `AWS_ROLE_ARN` | Harness Secrets Manager | Assume-role for resource verification |
| `SLACK_WEBHOOK` | Harness Secrets Manager | Notification |

**Harness delegates** should be configured in the E2E environment with network access to:
- Platform UI and API endpoints
- Git provider (GitHub/GitLab)
- AWS accounts (dev, test, stg, prod)
- All application endpoints for health checks

---

## 7. Pipeline Schedule & Triggers

| Trigger | When | Purpose |
|---------|------|---------|
| **Nightly (cron)** | Every night 2:00 AM UTC | Full regression — catches environment drift |
| **On platform release** | When platform code merges to main | Validate no regressions in onboarding |
| **Manual** | On-demand | Developer debugging, pre-release validation |
| **Weekly full-scope** | Sunday 6:00 AM UTC | Extended run including edge cases and all resource combinations |

```yaml
triggers:
  - name: "Nightly E2E"
    type: Cron
    spec:
      expression: "0 2 * * *"
  
  - name: "On Platform Release"
    type: Webhook
    spec:
      type: Github
      spec:
        event: push
        repoName: "platform-core"
        branchName: main
```

---

## 8. Failure Handling & Debugging

### 8.1 Failure Categories

| Category | Example | Response |
|----------|---------|----------|
| **Infra flake** | Timeout waiting for AWS provisioning | Auto-retry stage (max 1 retry) |
| **True regression** | Onboarding API returns 500 | Fail pipeline, alert team |
| **Test bug** | Selector changed in UI | Fail, fix test, re-run |
| **Env issue** | Harness delegate down | Fail, alert infra team |

### 8.2 Debugging Aids

Every stage produces:
- **Screenshots** (UI stages) — saved to Harness artifacts
- **API response bodies** — logged and saved
- **Pipeline execution IDs** — linkable to Harness UI
- **AWS resource ARNs** — for direct console inspection
- **Git commit SHAs** — for precise reproduction
- **Timestamps** — for correlating with platform logs

### 8.3 Retry Strategy

```yaml
# Stage-level retry config
failureStrategies:
  - onFailure:
      errors:
        - Timeout
        - Unknown
      action:
        type: Retry
        spec:
          retryCount: 1
          retryIntervals:
            - 30s
          onRetryFailure:
            action:
              type: MarkAsFailure
```

---

## 9. Test Coverage Matrix

| Scenario | Stage | Priority |
|----------|-------|----------|
| Happy path onboarding via UI | 2 | P0 |
| All requested resources created | 4 | P0 |
| Git repo has correct structure | 4 | P0 |
| All Harness pipelines exist | 4 | P0 |
| Hello-world deploys to dev | 5 | P0 |
| Feature branch push triggers pipeline | 6 | P0 |
| PR triggers PR pipeline | 6 | P0 |
| PR merge triggers main pipeline | 6 | P0 |
| Deploy to all environments | 7 | P0 |
| Cleanup is idempotent | 1 | P1 |
| Onboarding with single resource (S3 only) | 2 | P1 |
| Onboarding with all resources | 2 | P1 |
| Pipeline has correct approval gates | 4 | P1 |
| RDS connectivity from app | 7 | P1 |
| S3 read/write from app | 7 | P1 |
| DynamoDB read/write from app | 7 | P1 |
| UI error states (duplicate project name) | 2 | P2 |
| Partial provisioning failure recovery | 3 | P2 |
| Rollback on failed deployment | 7 | P2 |

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| **E2E pass rate** | > 95% on nightly runs |
| **Mean execution time** | < 30 minutes for full pipeline |
| **Mean time to detect regression** | < 24 hours (via nightly runs) |
| **Flake rate** | < 5% (flakes tracked and eliminated) |
| **Coverage of onboarding paths** | 100% of P0 scenarios |

---

## 11. Tooling Summary

| Tool | Purpose |
|------|---------|
| **Harness** | Test pipeline orchestration, pipeline-under-test verification |
| **Playwright** | UI automation and screenshots |
| **Python (requests/boto3)** | API validation, AWS resource checks |
| **Git CLI + GitHub/GitLab API** | Repo validation, trigger testing |
| **AWS CLI/SDK** | Resource verification, cleanup |
| **Slack/Email** | Notifications |
| **Harness Artifacts** | Screenshot, log, report storage |

---

## 12. Implementation Roadmap

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| **Phase 1: Foundation** | Week 1-2 | Cleanup stage, API onboarding, basic provisioning wait |
| **Phase 2: Resource Verification** | Week 3-4 | AWS verification scripts, Git repo validation, pipeline existence checks |
| **Phase 3: Deployment Validation** | Week 5-6 | Hello-world deployment, health checks across environments |
| **Phase 4: Trigger Testing** | Week 7-8 | Git push/PR/merge trigger validation |
| **Phase 5: UI Automation** | Week 9-10 | Playwright onboarding flow, screenshot capture |
| **Phase 6: Reporting & Hardening** | Week 11-12 | HTML reports, Slack notifications, retry logic, flake elimination |

---

## Appendix A: Pipeline Variable Reference

---

## 7. Day-2 Operations: Additional Services & CI/CD Validation

After the initial provisioning and hello-world deployment, the E2E suite must also validate **Day-2 workflows** — the operations a developer performs after their first onboarding: adding new services, pushing code changes, and verifying the full CI/CD loop end-to-end.

> **Why This Matters:** Initial onboarding proves the platform can *create* things. Day-2 testing proves the platform works as a living, usable development environment — which is what developers actually care about.

### Extended Pipeline: Stages 9–12

```
[Stages 1–8: Initial E2E] → [Stage 9: Add Services] → [Stage 10: Code Change] → [Stage 11: CI/CD Loop] → [Stage 12: Validate Live]
```

### Stage 9: Additional Service Onboarding

| Step | Action | Tool | Validation |
|------|--------|------|-----------|
| 9.1 | Navigate to project dashboard | Playwright | Existing project shows with correct resources |
| 9.2 | Click "Add Service" | Playwright | Add-service form loads |
| 9.3 | Select additional resource (e.g., ElastiCache, SQS) | Playwright | Form accepts selection |
| 9.4 | Submit request | Playwright | Request ID returned |
| 9.5 | Poll provisioning status | Python (requests) | Status → COMPLETED |
| 9.6 | Verify new AWS resource exists | Python (boto3) | Resource exists, tagged correctly |
| 9.7 | Verify existing resources unaffected | Python (boto3) | RDS, S3, original DynamoDB still healthy |
| 9.8 | Verify pipelines updated if applicable | Python (requests) | Pipeline configs include new resource |

### Stage 10: Code Change — Push a Real Application Update

Simulate a developer making a meaningful code change — modifying application code to use the newly provisioned service, then pushing it through CI/CD.

| Step | Action | Tool |
|------|--------|------|
| 10.1 | Clone the project repo | Python (subprocess/git) |
| 10.2 | Create feature branch | Python (subprocess/git) |
| 10.3 | Modify application code (add /orders endpoint) | Python (file I/O) |
| 10.4 | Update config for new DynamoDB table | Python (file I/O) |
| 10.5 | Commit and push | Python (subprocess/git) |
| 10.6 | Create PR via GitHub API | Python (requests) |
| 10.7 | Wait for PR pipeline to succeed | Python (requests) |
| 10.8 | Merge PR | Python (requests) |

### Stage 11: Full CI/CD Loop Validation

| Step | What to Validate | Tool |
|------|-----------------|------|
| 11.1 | Main pipeline triggered by merge | Python — Harness API |
| 11.2 | Build stage succeeds | Python — Harness execution status |
| 11.3 | Unit tests pass within pipeline | Python — Harness stage logs |
| 11.4 | Deploy to dev succeeds | Python — health check HTTP 200 |
| 11.5 | Promote to test/stg/prod | Python — Harness API + health checks |
| 11.6 | Deployed version matches merged commit | Python — /version endpoint |

### Stage 12: Live Application Validation

| Step | Action | Validation |
|------|--------|-----------|
| 12.1 | Seed test data into new DynamoDB table | PutItem succeeds |
| 12.2 | Hit new /orders endpoint | Returns 200 with seeded data |
| 12.3 | Hit original /health endpoint | Still returns 200 (no regression) |
| 12.4 | Validate S3 read/write from app | Upload via app, verify in S3 |
| 12.5 | Validate RDS connectivity | App queries DB, returns results |
| 12.6 | Check CloudWatch logs for errors | No ERROR-level entries post-deploy |

---

## 8. Language Strategy: Playwright + Python Hybrid

### Decision Summary

**Recommended: Playwright (TypeScript) for UI + Python for everything else.** This is a deliberate split, not a compromise. Each tool handles what it's best at.

### Can You Do Everything in Playwright?

Technically, yes. Practically, **no**. Here's why:

| Task | Playwright (TS/JS) | Python | Verdict |
|------|-------------------|--------|---------|
| **UI Interactions** | ✅ Excellent — its entire purpose | Possible via Python bindings | → Playwright |
| **Git Operations** | Awkward — `child_process.exec('git clone ...')` | ✅ Natural — `subprocess.run()`, GitPython | → Python |
| **File Modification** | Verbose for JSON/YAML | ✅ Natural — `json.load/dump`, pathlib | → Python |
| **REST API Calls** | Good with fetch/axios | ✅ Excellent — `requests` library | → Python |
| **AWS Validation** | Possible via AWS JS SDK | ✅ Excellent — boto3 is the gold standard | → Python |
| **Polling & Waiting** | Timeouts interfere | ✅ Simple — `time.sleep()` + loops | → Python |

### Why Not All-Playwright? The Real Problems

1. **Test Timeout Hell** — Playwright tests have default timeouts (30s per action). When you're polling AWS provisioning for 15 minutes, you're fighting the framework.
2. **Error Context** — boto3 gives you clear `ClientError` with AWS error codes. `child_process.exec('aws ...')` gives you stderr strings to parse.
3. **Dependency Bloat** — Your Playwright image needs Node.js + browsers. Adding AWS JS SDK, git tools, and infra libraries makes it huge and fragile.

### Recommended Architecture

```
HARNESS E2E PIPELINE
├── PLAYWRIGHT (TypeScript)          ├── PYTHON (pytest + boto3 + requests)
│   ✓ Onboarding form fill          │   ✓ Provisioning status polling
│   ✓ Add-service UI flow           │   ✓ AWS resource verification (boto3)
│   ✓ Dashboard validation          │   ✓ Git clone/branch/modify/push
│   ✓ Error state testing           │   ✓ GitHub API (PR create, merge)
│   ✓ Screenshots capture           │   ✓ Harness API (trigger, poll, status)
│                                    │   ✓ Health check HTTP calls
│   → Output: request IDs,          │   ✓ DynamoDB/S3/RDS connectivity tests
│     screenshots                    │
└── Handoff via pipeline vars ──────▶└── Output: pass/fail, ARNs, exec IDs
```

**Communication:** Playwright stages and Python stages are separate Harness steps. Data flows via **Harness pipeline output variables**.

### What About Playwright Python Bindings?

- If your team has strong TypeScript skills → **Playwright TS + Python** (recommended)
- If your team is Python-only → **Playwright Python + Python** (viable, single language)
- If you insist on all-Playwright-TS → Expect pain on git ops, AWS, and polling. **Not recommended.**

---

## 9. Docker Containerization: Analysis & Recommendation

### Verdict: Yes, Use Docker. But Smartly.

Dockerizing your E2E tests is the right call for Harness pipelines, but use **two purpose-built images**, not one monolithic container.

### Why Docker Is the Right Choice

| Benefit | Why It Matters |
|---------|---------------|
| **Reproducibility** | Playwright needs specific browser binaries. Python needs specific boto3 versions. Docker guarantees the same environment every run. |
| **Isolation** | Clean filesystem per run. No leftover git credentials or stale AWS token caches. |
| **Harness Compatibility** | Harness CI `Run` steps natively support Docker images. Just reference `image: your-registry/e2e-tests:latest`. |
| **Portability** | Same images run locally, in Harness CI, in GitHub Actions. No vendor lock-in. |
| **Version Pinning** | Pin Playwright version, browser version, Python packages. No surprises. |

### Why Not Run Directly on the Harness Delegate?

| Approach | Problem |
|----------|---------|
| Shell scripts on delegate | May not have Python 3.11, boto3, Playwright. Installing at runtime = 2-5 min wasted. |
| Pre-configured delegate | Couples tests to delegate version. Upgrades can break tests. |
| Harness Cloud (hosted) | Less control over installed tools. Heavy deps like Playwright+Chromium may not exist. |

### Recommended: Two Docker Images

```
┌──────────────────────────────┐  ┌──────────────────────────────────┐
│  e2e-playwright:latest        │  │  e2e-python:latest               │
│  ───────────────────────────  │  │  ──────────────────────────────  │
│  Base: mcr.microsoft.com/     │  │  Base: python:3.11-slim          │
│    playwright:v1.40.0         │  │  Packages: boto3, requests,      │
│  Includes: Node.js 20,       │  │    pytest, GitPython, pyyaml     │
│    Chromium, test specs       │  │  System: git, curl, jq, AWS CLI  │
│  Size: ~1.2 GB               │  │  Size: ~450 MB                   │
│  Used by: UI stages           │  │  Used by: all non-UI stages      │
└──────────────────────────────┘  └──────────────────────────────────┘
```

**Do NOT create one giant image with both — it would be ~2GB and slow to pull.**

### When Docker Is NOT Required

| Scenario | Alternative |
|----------|------------|
| Simple API-only tests (no UI, no AWS SDK) | Harness `ShellScript` step with `curl` + `jq` |
| One-off debugging / manual runs | Run scripts locally |
| Harness Cloud with pre-installed tools | Docker optional (but still recommended) |

### CI for the CI: Building Test Images

| Trigger | Action |
|---------|--------|
| PR to `e2e-tests` repo | Build images, run smoke test |
| Merge to main | Build + push `:latest` and `:<sha>` tags |
| Weekly | Rebuild to pick up OS security patches |

---

## Appendix A: Pipeline Variable Reference

```yaml
variables:
  - name: E2E_PROJECT_ID
    value: "e2e-test-project-001"
  - name: E2E_REPO_NAME
    value: "e2e-test-project-001"
  - name: ORG
    value: "your-github-org"
  - name: PLATFORM_URL
    value: "https://platform.internal.company.com"
  - name: PLATFORM_API
    value: "https://api.platform.internal.company.com"
  - name: HARNESS_API
    value: "https://app.harness.io/gateway/pipeline/api"
```

## Appendix B: Quick Reference — Stage Dependencies

```
Stage 1 (Cleanup)
  └──▶ Stage 2 (UI Onboard)
        └──▶ Stage 3 (Provisioning Wait)
              └──▶ Stage 4 (Resource Verify) [4A, 4B, 4C in parallel]
                    └──▶ Stage 5 (Initial Deploy)
                          └──▶ Stage 6 (Trigger Validation)
                                └──▶ Stage 7 (Multi-Env Deploy)
                                      └──▶ Stage 8 (Report & Cleanup) [always runs]
```
