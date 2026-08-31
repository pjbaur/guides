output "website_endpoint" {
  description = "HTTP endpoint of the S3 static website"
  value       = "http://${aws_s3_bucket_website_configuration.site.website_endpoint}"
}

output "bucket_name" {
  description = "Name of the site bucket"
  value       = aws_s3_bucket.site.id
}
