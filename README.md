# gcp-rss-webhook
read rss and fire webhook ex discord. run on gcp


# local
## prerequisite
1. get `key.json` by GCP Service Account
2. set environment variables

## run
```
circleci config validate

circleci local execute --job test \
    -e GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY" \
    -e TF_VAR_project_id="$TF_VAR_project_id" \
    -e TF_VAR_bucket_name="$TF_VAR_bucket_name"

circleci local execute --job build \
    -e GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY" \
    -e TF_VAR_project_id="$TF_VAR_project_id" \
    -e TF_VAR_bucket_name="$TF_VAR_bucket_name"
```
