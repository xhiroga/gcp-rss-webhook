terraform {
  backend "gcs" {
    bucket = "cc-hiroga-gcp-rss-webhook"
    prefix = "terraform/state"
  }
}

variable "project_id" {}

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
  schedule    = "0 */3 * * *"

  pubsub_target {
    topic_name = "${google_pubsub_topic.topic.id}"
    data       = "${base64encode("{\"greeting\": \"hello\"}")}"
  }
}
