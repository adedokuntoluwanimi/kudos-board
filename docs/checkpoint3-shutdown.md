# Post–Checkpoint 3 shutdown

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
