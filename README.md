# gcp-rss-webhook

read rss and fire webhook ex discord. run on gcp

## setup

```shell
export BUCKET_NAME=${BUCKET_NAME}
touch rss_webhooks.json
bash mb.sh ${BUCKET_NAME}
bash sync.sh ${BUCKET_NAME}
```

## run

```shell
# for deploy with npm package, install to src dir.
export BUCKET_NAME=${BUCKET_NAME}
npm install
npm test
```

## deploy

### prerequisite

1. get `key.json` by GCP Service Account
2. set environment variables

### by hand

```shell
export GOOGLE_APPLICATION_CREDENTIALS=./key.json
export TF_VAR_GOOGLE_APPLICATION_CREDENTIALS=./key.json
export TF_VAR_project_id="${PROJECT_ID:-rss-webhook}"
export TF_VAR_bucket_name="${BUCKET_NAME:-cc-hiroga-gcp-rss-webhook}"
# export TF_LOG=DEBUG
terraform plan -lock=false
terraform apply -auto-approve -lock=false
```

### circleci

```shell
export GCLOUD_SERVICE_KEY=$(cat ./key.json)

circleci config validate

circleci local execute --job test \
    -e GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY" \
    -e TF_VAR_project_id="${PROJECT_ID}" \
    -e TF_VAR_bucket_name="${BUCKET_NAME}"

circleci local execute --job build \
    -e GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY" \
    -e TF_VAR_project_id="${PROJECT_ID}" \
    -e TF_VAR_bucket_name="${BUCKET_NAME}"
```
