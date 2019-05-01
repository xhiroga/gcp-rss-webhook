variable "project" {}

// Configure the Google Cloud provider
provider "google" {
  credentials = "${file("key.json")}"
  project     = "{var.project}"
  region      = "asia-northeast1"
}
