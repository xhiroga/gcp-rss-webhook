BUCKET_NAME=$1
gsutil cp -r rss_webhooks.json gs://${BUCKET_NAME}/
