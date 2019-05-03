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
    -e GOOGLE_COMPUTE_REGION="$GOOGLE_COMPUTE_REGION" \
    -e TF_VAR_project_id="$TF_VAR_project_id"

circleci local execute --job build \
    -e GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY" \
    -e GOOGLE_COMPUTE_REGION="$GOOGLE_COMPUTE_REGION" \
    -e TF_VAR_project_id="$TF_VAR_project_id"
```
