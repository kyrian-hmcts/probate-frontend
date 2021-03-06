// Infrastructural variables

variable "product" {
  default = "probate"
}

variable "microservice" {
  default = "frontend"
}

variable "location" {
  default = "UK South"
}

variable "env" {
  type = "string"
}

variable "ilbIp" { }

variable "deployment_env" {
  type = "string"
}

variable "deployment_path" {
  default = "/opt/probate/frontend"
}

variable "node_config_dir" {
  // for Unix
  // default = "/opt/probate/frontend/config"
  
  // for Windows
  default = "D:\\home\\site\\wwwroot\\config"
}

variable "subscription" {}

variable "vault_section" {
  type = "string"
}

// CNP settings
variable "jenkins_AAD_objectId" {
  type                        = "string"
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environemnt variables and not normally required to be specified."
}

variable "client_id" {
  description = "(Required) The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. This is usually sourced from environment variables and not normally required to be specified."
}

variable "node_env" {
  default = "production"
}

variable "node_path" {
  default = "."
}

variable "external_host_name" {
  type = "string"
}

// Package details
variable "packages_name" {
  default = "probate-frontend"
}

variable "packages_project" {
  default = "probate"
}

variable "packages_environment" {
  type = "string"
}

variable "packages_version" {
  default = "-1"
}

variable "version" {
  default = "-1"
}

variable "probate_frontend_service_name" {
  default = "probate-frontend"
}


variable "probate_frontend_hostname" {
  type = "string"
}

variable "probate_frontend_public_port" {
  default = "443"
}

variable "probate_frontend_port" {
  default = "3001"
}

variable "outbound_proxy" {
  default = "http://proxyout.reform.hmcts.net:8080/"
}

variable "no_proxy" {
  default = "localhost,127.0.0.0/8,127.0.0.1,127.0.0.1*,local.home,reform.hmcts.net,*.reform.hmcts.net,betaDevBprobateApp01.reform.hmcts.net,betaDevBprobateApp02.reform.hmcts.net,betaDevBccidamAppLB.reform.hmcts.net,*.internal,*.platform.hmcts.net"
}

variable "ga_tracking_url" {
  description = "Google Analytics tracking URL"
  default = "http://www.google-analytics.com/collect"
}

variable "probate_redis_url" {
  type = "string"
}

variable "use_auth" {
  default = "false"
}

variable "health_endpoint" {
  default = "/health"
}

variable "frontend_service_name" {
  default = "probate-frontend"
}

variable "probate_business_service_url" {
  type = "string"
}      

variable "probate_submit_service_url" {
  type = "string"
}      
      
variable "probate_persistence_service_url" {
  type = "string"
}

variable "probate_frontend_use_redis" {
  default = "false"
}

variable "redis_listen_port" {
  default = "6379"
}

variable "f5_redis_listen_port" {
  default = "6379"
}

variable "probate_frontend_https" {
  default = "false"
}

variable "probate_frontend_use_auth" {
  default = "false"
}

variable "probate_frontend_use_idam" {
  default = "false"
}

variable "idam_user_host" {
  type = "string"
}

variable "probate_private_beta_auth_url" {
  default = "/login"
}

variable "probate_frontend_protocol" {
  default = "https"
}


variable "probate_google_track_id" {
  description = "Google Analytics tracking ID"
}

variable "probate_deployment_env" {
  type = "string"
}

variable "reform_team" {
  default = "probate"
}

variable "idam_service_api" {
  type = "string"
}

variable "payment_create_url" {
  type = "string"
}

variable "payment_return_url" {
  type = "string"
}


