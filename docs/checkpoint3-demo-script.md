# Checkpoint 3 — demo script

Keep it tight. Fill in the live URL after restore.

**Live site:** https://d2pb1fsz4ljq3u.cloudfront.net

1. **Open the site** — board loads over HTTPS from CloudFront → private S3.
2. **Post a kudos** — From / To / Message → submit → card appears; refresh → still there (DynamoDB).
3. **Pipeline** — tweak a frontend subtitle on `main`, push, watch Actions (`test` → `backend` → `frontend`); confirm the change is live with no console steps.
4. **Architecture** — one CloudFront distribution: default → S3; `/kudos*` and `/health` → ALB → ECS Fargate → DynamoDB. Config from SSM (table name, allowed origins, API URL injected into `config.js` at deploy). Deploy role via GitHub OIDC.
5. **Failure story** — CP2 port bug: tasks failed health checks; circuit breaker rolled back; site stayed up (`minimumHealthyPercent = 100`). Actions run [38482136609](https://github.com/adedokuntoluwanimi/kudos-board/actions/runs/38482136609); recovery [38483865997](https://github.com/adedokuntoluwanimi/kudos-board/actions/runs/38483865997).
6. **Close** — cost (~$40/mo, ALB + public IPv4), least-privilege IAM, AI write-up vs what you owned ([talk notes](checkpoint3-talk.md)).
