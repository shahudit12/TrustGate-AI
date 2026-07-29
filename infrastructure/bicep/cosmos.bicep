// ─────────────────────────────────────────────────────────────────────────────
// Azure Cosmos DB — NoSQL Database for TrustGate AI
// ─────────────────────────────────────────────────────────────────────────────

param accountName string
param location string
param tags object

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-02-15-preview' = {
  name: accountName
  location: location
  tags: tags
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      { name: 'EnableServerless' }  // Serverless for cost optimization in dev
    ]
    enableAutomaticFailover: false
    enableFreeTier: false
    backupPolicy: {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
        backupStorageRedundancy: 'Local'
      }
    }
  }
}

// ─────────────────────────────────────────────
// Database
// ─────────────────────────────────────────────
resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-02-15-preview' = {
  parent: cosmosAccount
  name: 'trustgate'
  properties: {
    resource: {
      id: 'trustgate'
    }
  }
}

// ─────────────────────────────────────────────
// Collections (Containers)
// ─────────────────────────────────────────────
var containers = [
  {
    name: 'verifications'
    partitionKey: '/session_id'
    defaultTtl: 7776000  // 90 days
    indexingMode: 'consistent'
  }
  {
    name: 'sessions'
    partitionKey: '/session_id'
    defaultTtl: 86400    // 24 hours
    indexingMode: 'consistent'
  }
  {
    name: 'audit_logs'
    partitionKey: '/session_id'
    defaultTtl: 31536000 // 1 year
    indexingMode: 'consistent'
  }
  {
    name: 'passports'
    partitionKey: '/passport_id'
    defaultTtl: 86400    // 24 hours (short TTL, passports self-expire)
    indexingMode: 'consistent'
  }
  {
    name: 'users'
    partitionKey: '/user_id'
    defaultTtl: -1       // No TTL
    indexingMode: 'consistent'
  }
]

resource cosmosContainers 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-02-15-preview' = [for container in containers: {
  parent: database
  name: container.name
  properties: {
    resource: {
      id: container.name
      partitionKey: {
        paths: [container.partitionKey]
        kind: 'Hash'
        version: 2
      }
      defaultTtl: container.defaultTtl
      indexingPolicy: {
        indexingMode: container.indexingMode
        automatic: true
        includedPaths: [{ path: '/*' }]
        excludedPaths: [{ path: '/"_etag"/?' }]
      }
    }
  }
}]

output endpoint string = cosmosAccount.properties.documentEndpoint
output accountName string = cosmosAccount.name
