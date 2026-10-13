variable "region" {
  type    = string
  default = "eu-west-1"
}

variable "name" {
  description = "Prefix for every resource name."
  type        = string
  default     = "kudos"
}

variable "github_repo" {
  description = "owner/repo allowed to assume the deploy role from its main branch."
  type        = string
  default     = "adedokuntoluwanimi/kudos-board"
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
