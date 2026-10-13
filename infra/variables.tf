variable "region" {
  type    = string
  default = "eu-west-1"
}

variable "name" {
  description = "Prefix for every resource name."
  type        = string
  default     = "kudos"
}

variable "github_sub_prefix" {
  description = "OIDC subject prefix of the repo allowed to deploy. This repo uses GitHub's immutable form (owner@id/repo@id); read it with: gh api repos/OWNER/REPO/actions/oidc/customization/sub"
  type        = string
  default     = "repo:adedokuntoluwanimi@203470780/kudos-board@1418083261"
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "image_tag" {
  description = "Image tag for the Terraform-managed task definition. The pipeline replaces it with the commit SHA on every deploy."
  type        = string
  default     = "bootstrap"
}

variable "alarm_email" {
  description = "Optional email subscribed to alarm notifications. Leave empty to skip the subscription."
  type        = string
  default     = ""
}
