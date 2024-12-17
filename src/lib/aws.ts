import { S3Client } from "@aws-sdk/client-s3";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd()); // Ensure that the .env file is loaded

// Environment variables related to AWS Configurations
export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME
export const REGION = process.env.AWS_REGION
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_KEY

// Create an instance of the S3Client

let s3Client: S3Client;

export const getS3Client = () => {
    if (!s3Client) {
        s3Client = new S3Client({
            region: REGION, // e.g., 'us-east-1'
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID as string,
                secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
            },
        });
        console.log('S3 Client created');
    }
    return s3Client;
};
