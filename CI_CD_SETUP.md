# CI/CD Setup Guide for StayXL

Follow these steps to enable automatic deployments for your AWS-migrated StayXL platform.

## 1. GitHub Secrets

Add the following secrets to your GitHub Repository (**Settings > Secrets and variables > Actions > New repository secret**):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | IAM User Access Key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | IAM User Secret Key | `wJal...` |
| `AWS_REGION` | Target AWS Region | `ap-south-1` |
| `S3_BUCKET_NAME` | S3 Bucket for Frontend | `stayxl-frontend-prod` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront ID for Invalidation | `E1...` |
| `NEXT_PUBLIC_API_URL` | AWS API Gateway URL | `https://api...` |

## 2. Infrastructure Requirements

Before the first deployment:
- **Backend**: Ensure your IAM user has `AdministratorAccess` or specific permissions for SAM, Lambda, DynamoDB, and CloudFormation.
- **Frontend**: Create an S3 bucket with "Static website hosting" enabled and a CloudFront distribution pointing to it.

## 3. How it Works

- **Backend**: Pushing changes to the `backend/` directory triggers `deploy-backend.yml`. It uses AWS SAM to build and update your serverless stack.
- **Frontend**: Pushing changes to the root/app directory triggers `deploy-frontend.yml`. It runs a static export (`next export`), syncs to S3, and invalidates CloudFront cache.

## 4. How to Deploy (GitHub Actions)

Since you don't have AWS installed locally, we will use **GitHub Actions** for everything. 

1. **Commit and Push**: Just push your code to the `main` branch.
   ```bash
   git add .
   git commit -m "deploying to aws"
   git push origin main
   ```
2. **Monitor**: Go to your GitHub repository, click on the **Actions** tab, and you will see the **"Deploy Backend (AWS SAM)"** workflow running. 
3. **Finish**: Once it turns green, your Lambda function and DynamoDB tables are live!

## 5. How to Create an IAM User (Step-by-Step)

If you don't have an IAM user for GitHub Actions yet, follow these steps in the [AWS Console](https://console.aws.amazon.com/iam/):

1. **Go to IAM**: Search for "IAM" in the AWS search bar and click on it.
2. **Users > Create user**: Click on "Users" in the left sidebar, then click the orange "Create user" button.
3. **User name**: Enter `github-actions-stayxl`, then click "Next".
4. **Set permissions**:
   - Select **"Attach policies directly"**.
   - Search for and select **`AdministratorAccess`**. 
   > [!TIP]
   > For betteraren security in production, you can later replace this with specific policies for SAM, S3, and CloudFront.
5. **Review and create**: Click "Next", then "Create user".
6. **Generate Access Keys**:
   - Click on your new user (`github-actions-stayxl`).
   - Go to the **"Security credentials"** tab.
   - Scroll down to **"Access keys"** and click **"Create access key"**.
   - Select **"Command Line Interface (CLI)"**, check the confirmation box, and click "Next".
   - Click **"Create access key"**.
7. **Save Credentials**: Copy the **Access key ID** and **Secret access key** immediately and add them to your GitHub Secrets as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
