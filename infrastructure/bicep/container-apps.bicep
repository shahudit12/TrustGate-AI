// ─────────────────────────────────────────────────────────────────────────────
// Azure Container Apps — Backend API Deployment
// ─────────────────────────────────────────────────────────────────────────────

param resourcePrefix string
param location string
param uniqueSuffix string
param cosmosDbEndpoint string
param storageConnectionString string
param keyVaultUrl string
param tags object

// Container Apps Environment (shared infrastructure)
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${resourcePrefix}-cae-${uniqueSuffix}'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'azure-monitor'
    }
    zoneRedundant: false
  }
}

// Managed Identity for backend (used to access Key Vault, Cosmos, Storage)
resource backendIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${resourcePrefix}-backend-identity'
  location: location
  tags: tags
}

// TrustGate AI Backend Container App
resource backendContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${resourcePrefix}-backend'
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${backendIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 8000
        transport: 'http'
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          allowedHeaders: ['*']
        }
      }
      secrets: [
        {
          name: 'cosmos-db-key'
          keyVaultUrl: '${keyVaultUrl}secrets/cosmos-db-key'
          identity: backendIdentity.id
        }
        {
          name: 'azure-openai-api-key'
          keyVaultUrl: '${keyVaultUrl}secrets/azure-openai-api-key'
          identity: backendIdentity.id
        }
        {
          name: 'jwt-secret'
          keyVaultUrl: '${keyVaultUrl}secrets/jwt-secret'
          identity: backendIdentity.id
        }
        {
          name: 'storage-connection-string'
          value: storageConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'trustgate-backend'
          image: 'trustgatecr.azurecr.io/trustgate-backend:latest'
          resources: {
            cpu: json('2.0')
            memory: '4Gi'
          }
          env: [
            { name: 'APP_ENV', value: 'production' }
            { name: 'DEBUG', value: 'false' }
            { name: 'DEMO_MODE', value: 'false' }
            { name: 'COSMOS_DB_URL', value: cosmosDbEndpoint }
            { name: 'COSMOS_DB_KEY', secretRef: 'cosmos-db-key' }
            { name: 'AZURE_OPENAI_API_KEY', secretRef: 'azure-openai-api-key' }
            { name: 'JWT_SECRET', secretRef: 'jwt-secret' }
            { name: 'AZURE_STORAGE_CONNECTION_STRING', secretRef: 'storage-connection-string' }
            { name: 'AZURE_KEY_VAULT_URL', value: keyVaultUrl }
          ]
          probes: [
            {
              type: 'Readiness'
              httpGet: {
                path: '/health'
                port: 8000
              }
              initialDelaySeconds: 30
              periodSeconds: 10
            }
            {
              type: 'Liveness'
              httpGet: {
                path: '/health'
                port: 8000
              }
              initialDelaySeconds: 60
              periodSeconds: 30
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '20'
              }
            }
          }
        ]
      }
    }
  }
}

output backendUrl string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output backendFqdn string = backendContainerApp.properties.configuration.ingress.fqdn
