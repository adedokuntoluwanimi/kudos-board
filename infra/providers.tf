terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    bucket       = "kudos-tfstate-996255343850-eu-west-1"
    key          = "kudos/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Project   = "project-7"
      Stage     = "checkpoint-2"
      ManagedBy = "terraform"
    }
  }
}

data "aws_caller_identity" "current" {}
