# Checkpoint 3 — talk notes

Oral-ready summaries for the final demo. Source detail lives in the README; this page is what to say.

## AI-usage write-up

The brief says the app is not the assignment — the pipeline is. An AI coding assistant generated the first cut of both components from the fixed Kudos Board spec: an Express API (`GET /health`, `GET /kudos`, `POST /kudos` with validation) and a plain static frontend that lists cards and posts through a form. I reviewed that code until I could explain every endpoint and how the browser calls the API, then left the product alone. No features beyond the spec were added.

What I owned myself was the cloud engineering work:

- Containerising the API and proving it against a real DynamoDB table before Terraform.
- Writing Terraform for the VPC, ALB, ECS Fargate, ECR, private S3 + CloudFront (OAC), DynamoDB, SSM parameters, IAM, and CloudWatch alarms.
- Building the GitHub Actions pipeline (OIDC, no long-lived AWS keys) that builds/pushes the image, rolls ECS, syncs the site, and invalidates CloudFront.
- Fixing the GitHub OIDC trust to use the immutable `owner@id/repo@id` subject after the textbook `repo:owner/name` condition was rejected.
- Routing `/kudos*` and `/health` through the same CloudFront distribution as the static site so an HTTPS page never calls an HTTP-only ALB (mixed content).
- Demonstrating a deliberate bad deploy (hardcoded listen port), watching the ECS circuit breaker roll back while users kept getting `200` from `/health`, then recovering with a fix push.
- Shutting the stack down cleanly after Checkpoint 2 and restoring it for live demos.

Verification against the spec: unit tests cover the API contract, validation, CORS, and Scan pagination; the README manual checklist records live HTTPS, config injection, POST/GET persistence, invalid input `400`, CORS, ALB/S3 direct-access blocks, and a push-to-live update.

## Cost note

At always-on demo traffic in `eu-west-1`, the stack costs roughly **$40 per month**. The biggest drivers are the Application Load Balancer (~$18–20) plus three public IPv4 addresses on the ALB and the Fargate task (~$11). The single small Fargate task is about $9. CloudFront, S3, on-demand DynamoDB, SSM, SNS, ECR, and CloudWatch together stay under about $2 at this scale. In production the cost would grow mainly with more Fargate tasks and DynamoDB request volume, not with the static site. When the stack is destroyed (including the state bucket), ongoing project infrastructure cost is effectively zero; charges for prior usage can still appear later on the bill.

## Security summary

Every role is scoped to this project’s resources. The ECS execution role may pull only from the `kudos-api` ECR repo, write only to `/ecs/kudos-api` logs, and read only the two backend SSM parameters. The task role may only `PutItem` and `Scan` on the `kudos-kudos` table. The GitHub deploy role is assumable only from `main` of this repo via OIDC; it can push that image, update that ECS service, pass only the two task roles, write the site bucket, invalidate this distribution, and read `/kudos/api-url`. The site bucket is private; CloudFront reads it through Origin Access Control. The ALB accepts traffic only from CloudFront’s origin-facing IP ranges. Wildcards that remain are the ones AWS does not support at resource level (`ecr:GetAuthorizationToken`, `ecs:RegisterTaskDefinition`, `ecs:DescribeTaskDefinition`) plus task egress HTTPS to the public AWS APIs because there are no VPC endpoints or NAT.

## Retrospective

**Hardest.** Three surprises dominated: GitHub’s immutable OIDC subject breaking a “standard” trust policy; mixed content forcing same-distribution API routing; and a two-minute unhealthy-target alarm that never fired while the circuit breaker replaced failed tasks every couple of minutes. The failure demo also taught that unit tests on `createApp` will not catch a bad `server.js` listen port — which made it a fair, realistic break.

**What I’d change.** Tighten the unhealthy-target alarm earlier (one bad minute, already done in code). Add VPC endpoints or a cheaper ingress path if this ran longer than a class demo, because the ALB and public IPv4 addresses dominate cost. Capture green/red Actions and alarm-in-`ALARM` screenshots during the next live failure rehearsal instead of relying only on run URLs.

**What’s next (stretch, not core).** A staging environment on `develop`, VPC endpoints to drop public egress, and optionally Secrets Manager if any real secrets appear. Core Checkpoint 3 is the live walkthrough, pipeline proof, this write-up, cost, and security — not more product scope.
