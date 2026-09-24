import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env.js";

const credentials = { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY };
const common = { region: env.S3_REGION, credentials, forcePathStyle: true };
const internalClient = new S3Client({ ...common, endpoint: env.S3_ENDPOINT });
const publicClient = new S3Client({ ...common, endpoint: env.S3_PUBLIC_ENDPOINT });

export const objectStorage = {
  async createUploadUrl({ cleObjet, typeMime, taille, empreinte }) {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: cleObjet,
      ContentType: typeMime,
      ContentLength: taille,
      Metadata: { sha256: empreinte },
    });
    return getSignedUrl(publicClient, command, { expiresIn: 5 * 60 });
  },
  async inspect(key) {
    return internalClient.send(new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
  },
  async read(key) {
    const response = await internalClient.send(new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
    return Buffer.from(await response.Body.transformToByteArray());
  },
  async createDownloadUrl(piece) {
    const ascii = piece.nomFichier.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
    const disposition = `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(piece.nomFichier)}`;
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: piece.cleObjet,
      ResponseContentType: piece.typeMime,
      ResponseContentDisposition: disposition,
    });
    return getSignedUrl(publicClient, command, { expiresIn: 60 });
  },
  async delete(key) {
    await internalClient.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
  },
};
