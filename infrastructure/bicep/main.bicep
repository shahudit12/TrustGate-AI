// ─────────────────────────────────────────────────────────────────────────────
// TrustGate AI — Azure Bicep Main Deployment Template
// Deploys all Azure resources required for TrustGate AI
// ─────────────────────────────────────────────────────────────────────────────

targetScope = 'resourceGroup'

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Unique suffix for resource names (prevents naming conflicts)')
param uniqueSuffix string = uniqueString(resourceGroup().id)

@description('Azure AD Tenant ID')
param tenantId string

@description('Admin object ID for Key Vault access policies')
param adminObjectId string

// ─────────────────────────────────────────────
// Variables
// ─────────────────────────────────────────────
var prefix = 'trustgate'
var resourcePrefix = '${prefix}-${environment}'
var tags = {
  project: 'TrustGate AI'
  environment: environment
  managedBy: 'bicep'
  version: '1.0.0'
}

// ─────────────────────────────────────────────
// Azure Key Vault
// ─────────────────────────────────────────────
module keyVault 'keyvault.bicep' = {
  name: 'keyvault-deployment'
  params: {
    vaultName: '${prefix}kv${uniqueSuffix}'
    location: location
    tenantId: tenantId
    adminObjectId: adminObjectId
    tags: tags
  }
}

// ─────────────────────────────────────────────
// Azure Cosmos DB
// ─────────────────────────────────────────────
module cosmosDb 'cosmos.bicep' = {
  name: 'cosmos-deployment'
  params: {
    accountName: '${resourcePrefix}-cosmos-${uniqueSuffix}'
    location: location
    tags: tags
  }
}

// ─────────────────────────────────────────────
// Azure Blob Storage
// ─────────────────────────────────────────────
module storage 'storage.bicep' = {
  name: 'storage-deployment'
  params: {
    storageAccountName: '${prefix}st${uniqueSuffix}'
    location: location
    tags: tags
  }
}

// ─────────────────────────────────────────────
// Azure Container Apps (Backend)
// ─────────────────────────────────────────────
module containerApps 'container-apps.bicep' = {
  name: 'container-apps-deployment'
  params: {
    resourcePrefix: resourcePrefix
    location: location
    uniqueSuffix: uniqueSuffix
    cosmosDbEndpoint: cosmosDb.outputs.endpoint
    storageConnectionString: storage.outputs.connectionString
    keyVaultUrl: keyVault.outputs.vaultUri
    tags: tags
  }
  dependsOn: [
    keyVault
    cosmosDb
    storage
  ]
}

// ─────────────────────────────────────────────
// Azure Static Web Apps (Frontend)
// ─────────────────────────────────────────────
module staticWebApp 'static-web-apps.bicep' = {
  name: 'static-web-apps-deployment'
  params: {
    appName: '${resourcePrefix}-frontend'
    location: location
    tags: tags
    backendUrl: containerApps.outputs.backendUrl
  }
  dependsOn: [containerApps]
}

// ─────────────────────────────────────────────
// Outputs
// ─────────────────────────────────────────────
output frontendUrl string = staticWebApp.outputs.defaultHostname
output backendUrl string = containerApps.outputs.backendUrl
output cosmosDbEndpoint string = cosmosDb.outputs.endpoint
output keyVaultUri string = keyVault.outputs.vaultUri
output storageAccountName string = storage.outputs.accountName
