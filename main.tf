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

resource "google_pubsub_topic" "scheduled-topic" {
  name    = "scheduled-topic"
  project = "${var.project_id}"
}
