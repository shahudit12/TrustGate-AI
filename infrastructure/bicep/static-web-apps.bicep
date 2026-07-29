// ─────────────────────────────────────────────────────────────────────────────
// Azure Static Web Apps — Frontend Deployment
// ─────────────────────────────────────────────────────────────────────────────

param appName string
param location string
param tags object
param backendUrl string

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: appName
  location: location
  tags: tags
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// Link backend API (Azure Container Apps) to Static Web App
resource staticWebAppLinkedBackend 'Microsoft.Web/staticSites/linkedBackends@2023-12-01' = {
  parent: staticWebApp
  name: 'trustgate-backend-link'
  properties: {
    backendResourceId: backendUrl
    region: location
  }
}

output defaultHostname string = staticWebApp.properties.defaultHostname
output staticWebAppName string = staticWebApp.name
