#!/bin/bash

# AWS Deployment Setup Script for KZN Matric Excellence
# This script automates the creation of AWS resources

echo "🚀 KZN Matric Excellence - AWS Setup"
echo "======================================"
echo ""

# Configuration
APP_NAME="kzn-matric-excellence"
ENV_NAME="kzn-matric-prod"
REGION="us-east-1"
DB_NAME="kzn_matric"
DB_USER="admin"
DB_INSTANCE_ID="kzn-matric-db"

echo "Configuration:"
echo "  App Name: $APP_NAME"
echo "  Environment: $ENV_NAME"
echo "  Region: $REGION"
echo "  Database: $DB_NAME"
echo ""

# Step 1: Initialize Elastic Beanstalk
echo "📦 Step 1: Initializing Elastic Beanstalk..."
eb init $APP_NAME --platform node.js-18 --region $REGION

# Step 2: Create Environment
echo ""
echo "🌍 Step 2: Creating Elastic Beanstalk environment..."
echo "This will take 5-10 minutes..."
eb create $ENV_NAME --instance-type t3.small --database.engine mysql --database.username $DB_USER

# Step 3: Get database endpoint
echo ""
echo "📊 Step 3: Getting database information..."
DB_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --query 'DBInstances[0].Endpoint.Address' --output text)

echo "Database Endpoint: $DB_ENDPOINT"

# Step 4: Set environment variables
echo ""
echo "⚙️  Step 4: Setting environment variables..."

# Generate secrets
JWT_SECRET=$(openssl rand -hex 64)
NEXTAUTH_SECRET=$(openssl rand -hex 32)

# Get the application URL
APP_URL=$(eb status | grep "CNAME" | awk '{print $2}')
APP_URL="https://$APP_URL"

echo "Enter your database password:"
read -s DB_PASSWORD

eb setenv \
  DB_HOST=$DB_ENDPOINT \
  DB_PORT=3306 \
  DB_USER=$DB_USER \
  DB_PASSWORD=$DB_PASSWORD \
  DB_NAME=$DB_NAME \
  JWT_SECRET=$JWT_SECRET \
  NEXTAUTH_URL=$APP_URL \
  NEXT_PUBLIC_API_URL=$APP_URL/api \
  NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
  NODE_ENV=production

echo ""
echo "✅ AWS Setup Complete!"
echo ""
echo "📝 Important Information:"
echo "  Application URL: $APP_URL"
echo "  Database Endpoint: $DB_ENDPOINT"
echo "  Database Name: $DB_NAME"
echo "  Database User: $DB_USER"
echo ""
echo "🔐 Secrets (save these securely):"
echo "  JWT_SECRET: $JWT_SECRET"
echo "  NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo "  DB_PASSWORD: [hidden]"
echo ""
echo "Next steps:"
echo "  1. Import your database: See AWS-DEPLOYMENT-GUIDE.md"
echo "  2. Deploy application: npm run build && eb deploy"
echo "  3. Create admin user: curl $APP_URL/api/create-admin"
echo ""
