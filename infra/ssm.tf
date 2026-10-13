resource "aws_ssm_parameter" "api_url" {
  name  = "/${var.name}/api-url"
  type  = "String"
  value = "https://${aws_cloudfront_distribution.site.domain_name}"
}

resource "aws_ssm_parameter" "table_name" {
  name  = "/${var.name}/table-name"
  type  = "String"
  value = aws_dynamodb_table.kudos.name
}

resource "aws_ssm_parameter" "allowed_origins" {
  name  = "/${var.name}/allowed-origins"
  type  = "String"
  value = "https://${aws_cloudfront_distribution.site.domain_name}"
}
