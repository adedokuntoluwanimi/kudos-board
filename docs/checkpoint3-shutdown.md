# Post–Checkpoint 3 shutdown

Run this **after** the demo when you authorize teardown. The stack is intentionally left **live** for Checkpoint 3 at `https://d2pb1fsz4ljq3u.cloudfront.net` (CloudFront `E8U5DU2Z1LNKV`). Do not destroy while the walkthrough is still needed.

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
