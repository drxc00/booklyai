# [bookly**ai**](https://booklyai.com)
An AI-Powered Ebook Generator that actually works. Powered by GPT-4o.
Built with Next.js 15 App Router, TypeScript, MongoDB, AWS S3 & Lambda functions, and LemonSqueezy.

## Features
- Created using **Next.js 15**
- Uses **MongoDB** as its primary database and AWS **S3** for PDF storage
- Uses **AWS Lambda Functions** for the backend
- Implemented with user Authentication (Google and Github OAuth) using **Auth.js**
- **LemonSqueezy** is used for the payment gateway
- Allows users to generate ebook based on a `topic`, `target audience`, and `description`
- Powered by **GPT-4o** model for quality generations

## Deployment
- The lambda function is deployed to AWS and is not available for the public.
- The front-end is self-hosted on a VPS.
- You can view the application at https://booklyai.com

# Notes
This repository is for the front-end code of the site. I order to use the application, a separate lambda function deployed to aws is required, which is not available for the public. 