import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon';

const files = new Files({ adapter: neon({ bucket: 'images' }) });

export async function uploadImage(
  _prev: { error?: string; publicUrl?: string } | null,
  formData: FormData,
) {
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'No file selected' };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const key = `${Date.now()}-${file.name}`;

  await files.upload(key, bytes, { contentType: file.type });

  // The images bucket is public_read, so the object is served directly.
  const publicUrl = `${process.env.AWS_ENDPOINT_URL_S3}/images/${key}`;
  return { publicUrl };
}