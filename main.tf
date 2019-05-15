terraform {
  backend "gcs" {
    bucket = "cc-hiroga-gcp-rss-webhook"
    prefix = "terraform/state"
  }
}

variable "project_id" {}
variable "bucket_name" {}

provider "archive" {}

// Configure the Google Cloud provider
provider "google" {
  credentials = "${file("key.json")}"
  project     = "${var.project_id}"
  region      = "asia-northeast1"
}

resource "google_pubsub_topic" "topic" {
  name    = "rss-webhook-topic"
  project = "${var.project_id}"
}

resource "google_cloud_scheduler_job" "job" {
  name        = "rss-webhook-job"
  description = "rss webhook job"
  schedule    = "0 */3 * * *"     # every 3 hours.

  pubsub_target {
    topic_name = "${google_pubsub_topic.topic.id}"
    data       = "${base64encode("{\"greeting\": \"hello\"}")}"
  }
}

resource "google_cloudfunctions_function" "function" {
  name                = "rss-webhook-function"
  entry_point         = "handler"
  available_memory_mb = 256
  project             = "${var.project_id}"
  runtime             = "nodejs8"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "${google_pubsub_topic.topic.name}"
  }

  source_archive_bucket = "${var.bucket_name}"
  source_archive_object = "${google_storage_bucket_object.archive.name}"
}

data "archive_file" "function_src" {
  type        = "zip"
  output_path = "function_src.zip"

  source_dir = "src"
}

resource "google_storage_bucket_object" "archive" {
  name       = "function_src.zip"
  bucket     = "${var.bucket_name}"
  source     = "function_src.zip"
  depends_on = ["data.archive_file.function_src"]
}
