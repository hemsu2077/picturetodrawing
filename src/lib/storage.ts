import { retryWithBackoff, RetryPresets, RetryOptions } from './retry';

interface StorageConfig {
  endpoint: string;
  region: string;
  accessKey: string;
  secretKey: string;
  retryOptions?: RetryOptions;
}

export function newStorage(config?: StorageConfig) {
  return new Storage(config);
}

export class Storage {
  private endpoint: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private bucket: string;
  private region: string;
  private retryOptions: RetryOptions;

  constructor(config?: StorageConfig) {
    this.endpoint = config?.endpoint || process.env.STORAGE_ENDPOINT || "";
    this.accessKeyId =
      config?.accessKey || process.env.STORAGE_ACCESS_KEY || "";
    this.secretAccessKey =
      config?.secretKey || process.env.STORAGE_SECRET_KEY || "";
    this.bucket = process.env.STORAGE_BUCKET || "";
    this.region = config?.region || process.env.STORAGE_REGION || "auto";
    this.retryOptions = config?.retryOptions || RetryPresets.fileUpload;
  }

  async uploadFile({
    body,
    key,
    contentType,
    bucket,
    onProgress,
    disposition = "inline",
  }: {
    body: Buffer | Uint8Array;
    key: string;
    contentType?: string;
    bucket?: string;
    onProgress?: (progress: number) => void;
    disposition?: "inline" | "attachment";
  }) {
    const uploadBucket = bucket || this.bucket;
    if (!uploadBucket) {
      throw new Error("Bucket is required");
    }

    const bodyArray = body instanceof Buffer ? new Uint8Array(body) : body;
    const url = `${this.endpoint}/${uploadBucket}/${key}`;

    // Wrap the upload operation with retry logic
    return retryWithBackoff(
      async () => {
        const { AwsClient } = await import("aws4fetch");

        const client = new AwsClient({
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        });

        const headers: Record<string, string> = {
          "Content-Type": contentType || "application/octet-stream",
          "Content-Disposition": disposition,
          "Content-Length": bodyArray.length.toString(),
        };

        const request = new Request(url, {
          method: "PUT",
          headers,
          body: bodyArray,
        });

        const response = await client.fetch(request);

        if (!response.ok) {
          const errorMsg = `Upload failed: ${response.status} ${response.statusText}`;
          // Log response body for debugging (truncated)
          try {
            const errorBody = await response.text();
            if (process.env.NODE_ENV !== 'production') {
              console.error('R2 upload error response:', errorBody.substring(0, 500));
            }
          } catch (e) {
            // Ignore if we can't read the error body
          }
          throw new Error(errorMsg);
        }

        return {
          location: url,
          bucket: uploadBucket,
          key,
          filename: key.split("/").pop(),
          url: process.env.STORAGE_DOMAIN
            ? `${process.env.STORAGE_DOMAIN}/${key}`
            : url,
        };
      },
      {
        ...this.retryOptions,
        onRetry: (error, attempt) => {
          console.warn(
            `[Storage] Upload retry ${attempt}/${this.retryOptions.maxAttempts} for ${key}:`,
            error.message
          );
        },
      }
    );
  }

  async downloadAndUpload({
    url,
    key,
    bucket,
    contentType,
    disposition = "inline",
  }: {
    url: string;
    key: string;
    bucket?: string;
    contentType?: string;
    disposition?: "inline" | "attachment";
  }) {
    // Download with retry logic
    const body = await retryWithBackoff(
      async () => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No body in response");
        }

        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
      },
      {
        ...RetryPresets.standard,
        onRetry: (error, attempt) => {
          console.warn(
            `[Storage] Download retry ${attempt} for ${url}:`,
            error.message
          );
        },
      }
    );

    // Upload with retry logic (already handled in uploadFile)
    return this.uploadFile({
      body,
      key,
      bucket,
      contentType,
      disposition,
    });
  }
}
