import { S3Client } from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { loadEnvConfig } from "@next/env";
import { Hash } from "@aws-sdk/hash-node";
import { LambdaClient } from "@aws-sdk/client-lambda";
import Logger from "./logger";

loadEnvConfig(process.cwd()); // Ensure that the .env file is loaded

// Environment variables related to AWS Configurations
export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME
export const REGION = process.env.AWS_REGION
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_KEY

// Create an instance of the S3Client

let s3Client: S3Client;
let s3RequestPresigner: S3RequestPresigner;
let lambdaClient: LambdaClient;

export const getS3Client = () => {
    if (!s3Client) {
        s3Client = new S3Client({
            region: REGION, // e.g., 'us-east-1'
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID as string,
                secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
            },
        });
        Logger.info("AWS", "S3 Client created");
    }
    return s3Client;
};

export const getS3RequestPresigner = () => {
    if (!s3RequestPresigner) {
        s3RequestPresigner = new S3RequestPresigner({
            region: REGION as string,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID as string,
                secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
            },
            sha256: Hash.bind(null, "sha256")
        });
        Logger.info("AWS", "S3 Request Presigner created");
    }
    return s3RequestPresigner;
}

export const getLambdaClient = () => {
    if (!lambdaClient) {
        // Create the Lambda client with the configuration
        lambdaClient = new LambdaClient({
            region: REGION as string,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID as string,
                secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
            },
            // endpoint: process.env.AWS_LAMBDA_ENDPOINT as string
        });
        Logger.info("AWS", "Lambda Client created");
    }
    return lambdaClient
}
