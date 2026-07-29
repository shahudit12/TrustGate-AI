# TrustGate AI — Azure Deployment Guide

## Prerequisites

- Azure CLI 2.60+: `az --version`
- An active Azure subscription
- Contributor or Owner role on the subscription
- Docker (for building container images)
- Node.js 20+ (for building frontend)

---

## Step 1: Azure Login & Subscription

```bash
# Login to Azure
az login

# List subscriptions
az account list --output table

# Set your subscription
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Verify
az account show
```

---

## Step 2: Create Resource Group

```bash
# Production deployment in East US
az group create \
  --name trustgate-prod-rg \
  --location eastus \
  --tags Project="TrustGate AI" Environment="production"
```

---

## Step 3: Deploy Azure Infrastructure (Bicep)

```bash
# Get your tenant ID and object ID
TENANT_ID=$(az account show --query tenantId -o tsv)
ADMIN_OBJ_ID=$(az ad signed-in-user show --query id -o tsv)

# Deploy all infrastructure
az deployment group create \
  --resource-group trustgate-prod-rg \
  --template-file infrastructure/bicep/main.bicep \
  --parameters \
    environment=prod \
    tenantId=$TENANT_ID \
    adminObjectId=$ADMIN_OBJ_ID \
  --output table

# Capture outputs
COSMOS_ENDPOINT=$(az deployment group show \
  --resource-group trustgate-prod-rg \
  --name main \
  --query properties.outputs.cosmosDbEndpoint.value -o tsv)

KEYVAULT_URI=$(az deployment group show \
  --resource-group trustgate-prod-rg \
  --name main \
  --query properties.outputs.keyVaultUri.value -o tsv)

BACKEND_URL=$(az deployment group show \
  --resource-group trustgate-prod-rg \
  --name main \
  --query properties.outputs.backendUrl.value -o tsv)

echo "Cosmos DB: $COSMOS_ENDPOINT"
echo "Key Vault: $KEYVAULT_URI"
echo "Backend URL: $BACKEND_URL"
```

---

## Step 4: Configure Azure OpenAI

```bash
# Create Azure OpenAI resource
az cognitiveservices account create \
  --name trustgate-openai \
  --resource-group trustgate-prod-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus

# Deploy GPT-4o model
az cognitiveservices account deployment create \
  --name trustgate-openai \
  --resource-group trustgate-prod-rg \
  --deployment-name gpt-4o \
  --model-name gpt-4o \
  --model-version "2024-08-06" \
  --model-format OpenAI \
  --capacity 10

# Get the endpoint
OPENAI_ENDPOINT=$(az cognitiveservices account show \
  --name trustgate-openai \
  --resource-group trustgate-prod-rg \
  --query properties.endpoint -o tsv)

OPENAI_KEY=$(az cognitiveservices account keys list \
  --name trustgate-openai \
  --resource-group trustgate-prod-rg \
  --query key1 -o tsv)

echo "OpenAI Endpoint: $OPENAI_ENDPOINT"
```

---

## Step 5: Populate Key Vault Secrets

```bash
# Set all secrets in Key Vault
KV_NAME=$(az keyvault list \
  --resource-group trustgate-prod-rg \
  --query "[0].name" -o tsv)

# Azure OpenAI key
az keyvault secret set \
  --vault-name $KV_NAME \
  --name "azure-openai-api-key" \
  --value "$OPENAI_KEY"

# Cosmos DB key
COSMOS_KEY=$(az cosmosdb keys list \
  --resource-group trustgate-prod-rg \
  --name $(az cosmosdb list --resource-group trustgate-prod-rg --query "[0].name" -o tsv) \
  --query primaryMasterKey -o tsv)

az keyvault secret set \
  --vault-name $KV_NAME \
  --name "cosmos-db-key" \
  --value "$COSMOS_KEY"

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 48)
az keyvault secret set \
  --vault-name $KV_NAME \
  --name "jwt-secret" \
  --value "$JWT_SECRET"

# Generate ECDSA P-256 key for passport signing
openssl ecparam -name prime256v1 -genkey -noout -out passport-key.pem
PASSPORT_KEY=$(cat passport-key.pem | base64 -w 0)
az keyvault secret set \
  --vault-name $KV_NAME \
  --name "passport-signing-key" \
  --value "$PASSPORT_KEY"

# Clean up local key file
rm passport-key.pem

echo "✅ All secrets set in Key Vault"
```

---

## Step 6: Create Azure Container Registry

```bash
# Create ACR
az acr create \
  --name trustgatecr \
  --resource-group trustgate-prod-rg \
  --sku Standard \
  --admin-enabled false

# Login to ACR
az acr login --name trustgatecr

echo "✅ Container Registry ready: trustgatecr.azurecr.io"
```

---

## Step 7: Build & Push Backend Docker Image

```bash
# Build the production image
docker build \
  --target production \
  --tag trustgatecr.azurecr.io/trustgate-backend:latest \
  --tag trustgatecr.azurecr.io/trustgate-backend:$(git rev-parse --short HEAD) \
  ./backend

# Push to ACR
docker push trustgatecr.azurecr.io/trustgate-backend:latest
docker push trustgatecr.azurecr.io/trustgate-backend:$(git rev-parse --short HEAD)

echo "✅ Backend image pushed to ACR"
```

---

## Step 8: Deploy Backend to Azure Container Apps

```bash
# The bicep template creates the Container App
# Update it to use the new image:

az containerapp update \
  --name trustgate-prod-backend \
  --resource-group trustgate-prod-rg \
  --image trustgatecr.azurecr.io/trustgate-backend:latest

# Verify deployment
az containerapp show \
  --name trustgate-prod-backend \
  --resource-group trustgate-prod-rg \
  --query "properties.latestRevisionFqdn" -o tsv

# Test health endpoint
curl https://$BACKEND_URL/health
```

---

## Step 9: Build & Deploy Frontend

```bash
# Build frontend with production settings
cd frontend

VITE_API_URL=$BACKEND_URL \
VITE_WS_URL=$(echo $BACKEND_URL | sed 's/https/wss/') \
VITE_DEMO_MODE=false \
npm run build

# Deploy to Azure Static Web Apps
SWA_TOKEN=$(az staticwebapp secrets list \
  --name trustgate-prod-frontend \
  --resource-group trustgate-prod-rg \
  --query "properties.apiKey" -o tsv)

npx @azure/static-web-apps-cli deploy \
  --deployment-token $SWA_TOKEN \
  --output-location dist

echo "✅ Frontend deployed to Azure Static Web Apps"
```

---

## Step 10: Configure Microsoft Entra ID (Optional)

```bash
# Create Entra ID app registration for authentication
APP_ID=$(az ad app create \
  --display-name "TrustGate AI" \
  --sign-in-audience AzureADMyOrg \
  --web-redirect-uris "https://YOUR_FRONTEND_URL" \
  --query appId -o tsv)

# Create client secret
APP_SECRET=$(az ad app credential reset \
  --id $APP_ID \
  --display-name "TrustGate AI Production Secret" \
  --query password -o tsv)

echo "Client ID: $APP_ID"
echo "Client Secret: $APP_SECRET"
echo "Tenant ID: $TENANT_ID"

# Store in Key Vault
az keyvault secret set \
  --vault-name $KV_NAME \
  --name "entra-client-secret" \
  --value "$APP_SECRET"
```

---

## Step 11: Configure Azure Monitor

```bash
# Create Application Insights
az monitor app-insights component create \
  --app trustgate-insights \
  --location eastus \
  --resource-group trustgate-prod-rg \
  --application-type web

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app trustgate-insights \
  --resource-group trustgate-prod-rg \
  --query instrumentationKey -o tsv)

echo "App Insights Key: $INSTRUMENTATION_KEY"

# Create alert: High error rate
az monitor metrics alert create \
  --name "TrustGate High Error Rate" \
  --resource-group trustgate-prod-rg \
  --description "Alert when backend error rate exceeds 5%" \
  --condition "avg Requests/Failed > 5" \
  --window-size 5m \
  --evaluation-frequency 1m
```

---

## Verification Checklist

After deployment, verify:

- [ ] `GET https://YOUR_BACKEND_URL/health` returns `{"status": "healthy"}`
- [ ] `GET https://YOUR_BACKEND_URL/docs` shows OpenAPI docs
- [ ] Frontend loads at Static Web App URL
- [ ] Verification flow completes end-to-end
- [ ] Dashboard shows data
- [ ] AI chat responds (requires Azure OpenAI)
- [ ] PDF report generates and downloads
- [ ] Cosmos DB shows records after verification
- [ ] Key Vault secrets are accessible by Container App

---

## Environment Variable Reference for Production

```bash
# Set these as Container App environment variables or via Key Vault references
APP_ENV=production
DEBUG=false
DEMO_MODE=false
SECRET_KEY=[from Key Vault]
JWT_SECRET=[from Key Vault]
AZURE_OPENAI_ENDPOINT=https://trustgate-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=[from Key Vault]
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-01
COSMOS_DB_URL=[from bicep output]
COSMOS_DB_KEY=[from Key Vault]
COSMOS_DB_DATABASE=trustgate
AZURE_STORAGE_CONNECTION_STRING=[from storage]
AZURE_KEY_VAULT_URL=[from bicep output]
AZURE_TENANT_ID=[your tenant ID]
ALLOWED_ORIGINS=https://YOUR_FRONTEND_URL
TRUST_THRESHOLD_LOW=80
TRUST_THRESHOLD_MEDIUM=60
TRUST_THRESHOLD_HIGH=40
```

---

## Cost Estimate (Monthly)

| Service | Tier | Estimated Cost |
|---------|------|---------------|
| Azure Container Apps | 2 replicas, 2 vCPU/4GB | ~$80/month |
| Azure Static Web Apps | Standard | $9/month |
| Azure Cosmos DB | Serverless, ~100K RU | ~$15/month |
| Azure Blob Storage | LRS, 10GB | ~$0.20/month |
| Azure Key Vault | Standard, 100 operations | ~$0.10/month |
| Azure OpenAI (GPT-4o) | 1M tokens/month | ~$30/month |
| Azure Monitor | 5GB logs | ~$5/month |
| **Total** | | **~$140/month** |

*Costs vary by usage. Azure OpenAI pricing changes frequently.*
