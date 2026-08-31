variable "bucket_name" {
  description = "Globally unique S3 bucket name for the guides site (for example paul-baur-guides)"
  type        = string
}

variable "aws_region" {
  description = "AWS region for the bucket"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Tags applied to the bucket"
  type        = map(string)
  default = {
    project    = "guides"
    managed-by = "opentofu"
  }
}
