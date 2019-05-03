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

resource "google_pubsub_topic" "schedule_topic" {
  name = "schedule-topic"

  labels = {
    repository = "gcp-rss-webhook"
  }
}
