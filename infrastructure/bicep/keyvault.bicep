// ─────────────────────────────────────────────────────────────────────────────
// Azure Key Vault — Secret Management for TrustGate AI
// ─────────────────────────────────────────────────────────────────────────────

param vaultName string
param location string
param tenantId string
param adminObjectId string
param tags object

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: vaultName
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// Grant admin full access via RBAC (Key Vault Administrator role)
resource adminRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: keyVault
  name: guid(keyVault.id, adminObjectId, 'Key Vault Administrator')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '00482a5a-887f-4fb3-b363-3b7fe8e74483')
    principalId: adminObjectId
    principalType: 'User'
  }
}

// Placeholder secrets (populate via CI/CD pipeline)
resource secretAzureOpenAIKey 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-openai-api-key'
  properties: {
    value: 'PLACEHOLDER_SET_VIA_PIPELINE'
    attributes: { enabled: true }
  }
}

resource secretCosmosKey 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'cosmos-db-key'
  properties: {
    value: 'PLACEHOLDER_SET_VIA_PIPELINE'
    attributes: { enabled: true }
  }
}

resource secretJwtSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'jwt-secret'
  properties: {
    value: 'PLACEHOLDER_SET_VIA_PIPELINE'
    attributes: { enabled: true }
  }
}

resource secretPassportSigningKey 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'passport-signing-key'
  properties: {
    value: 'PLACEHOLDER_SET_VIA_PIPELINE'
    attributes: { enabled: true }
  }
}

output vaultName string = keyVault.name
output vaultUri string = keyVault.properties.vaultUri
