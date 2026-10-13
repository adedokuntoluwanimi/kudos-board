output "site_url" {
  value = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "alb_dns_name" {
  value = aws_lb.api.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "deploy_role_arn" {
  value = aws_iam_role.deploy.arn
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service" {
  value = aws_ecs_service.api.name
}

output "task_family" {
  value = aws_ecs_task_definition.api.family
}

output "site_bucket" {
  value = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "dynamodb_table" {
  value = aws_dynamodb_table.kudos.name
}

output "api_url_parameter" {
  value = aws_ssm_parameter.api_url.name
}
