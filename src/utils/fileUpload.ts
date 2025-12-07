import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'partner-documents')
 * @param folder - Optional folder path within the bucket
 * @returns The uploaded file object with metadata
 */
export async function uploadFile(
  file: File,
  bucket: string = 'partner-documents',
  folder?: string
): Promise<UploadedFile> {
  try {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported. Please upload PDF, DOC, XLS, JPG, or PNG files.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExt}`;

    // Construct file path
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      name: file.name,
      url: publicUrl,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error instanceof Error ? error : new Error('Failed to upload file');
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param bucket - The storage bucket name
 * @param path - Optional path within the bucket
 * @param options - Upload options
 * @returns Array of uploaded file objects
 */
export async function uploadFiles(
  files: File[],
  bucket: string,
  path: string = '',
  options?: {
    allowedTypes?: string[];
    maxSize?: number;
    onProgress?: (fileIndex: number, progress: number) => void;
  }
): Promise<UploadedFile[]> {
  const uploadPromises = files.map((file) =>
    uploadFile(file, bucket, path)
  );

  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file within the bucket
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error instanceof Error ? error : new Error('Failed to delete file');
  }
}

/**
 * Delete multiple files from Supabase Storage
 * @param bucket - The storage bucket name
 * @param filePaths - Array of file paths to delete
 */
export async function deleteFiles(bucket: string, filePaths: string[]): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove(filePaths);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting files:', error);
    throw error instanceof Error ? error : new Error('Failed to delete files');
  }
}

/**
 * Extract file path from Supabase public URL
 * @param publicUrl - The public URL from Supabase storage
 * @param bucket - The storage bucket name
 * @returns The file path within the bucket
 */
export function extractFilePathFromUrl(publicUrl: string, bucket: string): string {
  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
    return pathParts[1] || '';
  } catch (error) {
    console.error('Error extracting file path:', error);
    return '';
  }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file is an image
 * @param filename - The filename or file type
 * @returns True if file is an image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const ext = getFileExtension(filename);
  return imageExtensions.includes(ext);
}

/**
 * Check if file is a PDF
 * @param filename - The filename or file type
 * @returns True if file is a PDF
 */
export function isPDFFile(filename: string): boolean {
  return getFileExtension(filename) === 'pdf';
}

