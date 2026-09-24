import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const required = [
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_BUCKET",
  "S3_ACCESS_KEY",
  "S3_SECRET_KEY",
  "APP_ORIGIN",
];

for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} est requis pour initialiser le stockage S3.`);
}

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

try {
  await client.send(new HeadBucketCommand({ Bucket: process.env.S3_BUCKET }));
} catch (error) {
  if (!["NotFound", "NoSuchBucket", "UnknownError"].includes(error.name) && error.$metadata?.httpStatusCode !== 404) {
    throw error;
  }
  await client.send(new CreateBucketCommand({ Bucket: process.env.S3_BUCKET }));
}

await client.send(
  new PutBucketCorsCommand({
    Bucket: process.env.S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "HEAD", "PUT"],
          AllowedOrigins: [process.env.APP_ORIGIN],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }),
);

console.info(`Bucket S3 ${process.env.S3_BUCKET} initialisé pour ${process.env.APP_ORIGIN}.`);
