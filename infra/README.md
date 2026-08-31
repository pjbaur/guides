# Hosting the guides on S3

OpenTofu configuration for a plain S3 static website: one public-read bucket
with `index.html` as the index document. No CloudFront, no custom domain —
the site is served from the bucket's HTTP website endpoint. Easy to put
CloudFront in front later if HTTPS matters.

**Not applied yet.** Nothing here has been run against an AWS account.

## One-time setup

Requires [OpenTofu](https://opentofu.org) and AWS credentials in the
environment (`aws login` / SSO / whatever you normally use).

```sh
cd infra
tofu init
tofu apply -var bucket_name=<globally-unique-name>
```

`apply` prints `website_endpoint` — that is the site URL. Bucket names are
global; if the name is taken, pick another.

## Deploying content

The site is the repo's HTML plus the linked meta-docs. From the repo root:

```sh
BUCKET=<bucket_name from apply>

# Rebuild the hub first if guides.json changed
node scripts/build-index.mjs

# HTML + LICENSE (content-type inferred from extension)
aws s3 sync . "s3://$BUCKET" \
  --exclude "*" \
  --include "index.html" \
  --include "*-guide.html" \
  --include "guides.json" \
  --include "LICENSE"

# Markdown separately: force a text content-type so browsers render it
# inline instead of downloading it
aws s3 sync . "s3://$BUCKET" \
  --exclude "*" \
  --include "*.md" \
  --exclude ".*/*" \
  --exclude "infra/*" \
  --content-type "text/plain; charset=utf-8"
```

Re-run both `sync` commands to deploy updates; `sync` only uploads what
changed.

## Tearing down

```sh
cd infra
tofu destroy -var bucket_name=<name>
```

`destroy` fails while the bucket has objects — empty it first:
`aws s3 rm "s3://$BUCKET" --recursive`.

## Future: S3-only hosting

`index.html` currently bakes the guide list in at build time so the page
works from `file://`. Once hosting moves exclusively to S3, the plan
(tracked as `TODO(s3-migration)` in `index.html` and `guides.json`) is to
have the page `fetch("guides.json")` at runtime instead, and drop the
build step.
