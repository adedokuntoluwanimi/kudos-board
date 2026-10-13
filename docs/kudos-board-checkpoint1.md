# Kudos Board — Checkpoint 1 architecture

Editable source: `kudos-board-checkpoint1.drawio`. The diagram shows deployed resources only.

## Request and data flow

1. The local static frontend calls the public ALB over HTTP.
2. The ALB sends requests to one healthy ECS Fargate task on port 3000. Its health check calls `GET /health`.
3. The API writes kudos with DynamoDB `PutItem` and lists them with paginated `Scan`.

## Build and monitoring flow

1. A one-off CodeBuild project built the backend image and pushed it to ECR because Docker was unavailable locally.
2. ECS pulls that image from ECR; the execution role grants the pull and log permissions.
3. ECS sends application logs to CloudWatch Logs. An ALB unhealthy-target metric feeds the CloudWatch alarm.

## Security and boundaries

The ALB accepts public HTTP on port 80. The Fargate task has a public IP for ECR access but allows inbound port 3000 only from the ALB security group. The task role has `PutItem` and `Scan` on only the Kudos Board table. No EC2 or SSH access is used. The frontend, S3/CloudFront hosting, Terraform, and continuous deployment are later-checkpoint work; they are not shown as deployed.
