# Post–Checkpoint 3 shutdown

## Final presentation shutdown — 3–4 November 2026

- Restored bootstrap (4 resources) and app (41 resources) on 3 November for the final presentation in AWS account `996255343850`, `eu-west-1`.
- Deployment [41680489633](https://github.com/adedokuntoluwanimi/kudos-board/actions/runs/41680489633) passed test, backend and frontend jobs. ECS ran `kudos-api:16`; all four local API tests passed. The health, listing, configuration and frontend assets returned 200, and both CloudWatch alarms were OK. Browser rendering showed the saved user post.
- Final site: `https://d2do4dhc3jjmov.cloudfront.net`, CloudFront `E38NX6QJBI1JGI`. This replaces the October URL only for this historical restoration.
- After the presentation, disabled Deploy, confirmed no active workflow runs, and applied the destroy plan: 41 application resources destroyed on 3 November.
- Deregistered the seven remaining active `kudos-api` task definitions (8, 9, 10, 11, 13, 14 and 16). Inactive task-definition history is retained; it does not run containers.
- The interrupted state-bucket cleanup was completed on 4 November: saved the empty application state, removed 20 state versions/delete markers, confirmed the bucket was empty, and destroyed all 4 bootstrap resources.
- Readback found no project CloudFront distribution, ECS cluster, active task definitions, ALB, VPC, S3 buckets or ECR repository. Deploy remains `disabled_manually`.
- Four automatic DynamoDB `SYSTEM` backups remain from deleted tables. AWS rejects manual deletion with `ValidationException` and expires them automatically (latest: 8 December 2026). AWS documents these backups as retained for 35 days at no additional cost: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BackupSummary.html. Inactive task-definition history and the shared GitHub OIDC provider are retained; neither runs an application.
- Removed 8 verified session files: startup/destroy plans, the generated plan-review log, the temporary S3 deletion request and browser traces. Preserved state backups and presentation assets. No runtime-code changes required retesting.
- Recovery backups remain ignored locally at `infra/pre-shutdown-20261103.tfstate` and `infra/post-shutdown-20261103.tfstate`, alongside the bootstrap state files. Source, diagrams, evidence, branches, presentation and Google Doc are preserved.
- Leave Deploy disabled. A future restoration must recreate bootstrap storage before applying `infra/` and deploying a fresh image.

## Previous shutdown — 30 October 2026

**Done — 30 October 2026.** Deploy disabled; `infra/` destroy removed 41 resources; state-object versions cleared; `infra/bootstrap` destroy removed 4 resources. Site `https://d2pb1fsz4ljq3u.cloudfront.net` no longer resolves.

To tear down again after a future restore:

```powershell
# From project-7 root

# 1. Stop new deploys
gh workflow disable Deploy --repo adedokuntoluwanimi/kudos-board

# 2. Destroy the application stack (~few minutes; CloudFront is slow)
cd infra
terraform destroy -auto-approve

# 3. Optional: remove state-bucket cost too
# Save a local backup first if you want one, then delete all object
# versions/delete markers from kudos-tfstate-996255343850-eu-west-1, then:
cd bootstrap
terraform destroy -auto-approve
```

Confirm with `aws s3 ls` and a quick console/CLI scan that no project ALB, ECS, CloudFront, or DynamoDB resources remain.
