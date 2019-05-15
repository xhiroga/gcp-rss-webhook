# gcp-rss-webhook
read rss and fire webhook ex discord. run on gcp

# setup
```
export BUCKET_NAME=${BUCKET_NAME}
mkdir assets
touch assets/rss_webhooks.json
bash mb.sh ${BUCKET_NAME}
bash sync.sh ${BUCKET_NAME}
```


# run
```
# for deploy with npm package, install to src dir.
export BUCKET_NAME=${BUCKET_NAME}
npm install
npm test
```


# depoloy
## prerequisite
1. get `key.json` by GCP Service Account
2. set environment variables


## by hand
```
export GOOGLE_APPLICATION_CREDENTIALS=./src/key.json
export TF_VAR_GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_APPLICATION_CREDENTIALS}
export TF_VAR_project_id="${PROJECT_ID}"
export TF_VAR_bucket_name="${BUCKET_NAME}"
export TF_LOG=DEBUG
cp -r ./node_modules ./src/node_modules
terraform apply -auto-approve
```

## circleci
```
export GCLOUD_SERVICE_KEY=$(cat ./src/key.json)

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
