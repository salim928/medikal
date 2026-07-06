import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: "mediconnect",
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Generate signed URL (valid for 1 hour)
    const getCommand = new GetObjectCommand({
      Bucket: "mediconnect",
      Key: key,
    });

    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("R2 upload error:", error);
    throw error;
  }
}

export async function uploadToIPFS(
  data: Buffer,
  filename: string
): Promise<string> {
  try {
    const formData = new FormData();
    const blob = new Blob([data]);
    formData.append("file", blob, filename);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.IpfsHash;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw error;
  }
}