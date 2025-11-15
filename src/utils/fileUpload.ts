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
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = 'partner-documents',
  folder?: string
): Promise<string> {
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
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files or FileList to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns Array of uploaded file information
 */
export async function uploadMultipleFiles(
  files: File[] | FileList,
  bucket: string = 'partner-documents',
  folder?: string
): Promise<UploadedFile[]> {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map(async (file) => {
    const url = await uploadFile(file, bucket, folder);
    return {
      name: file.name,
      url,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    };
  });

  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 * @param filePath - The path of the file to delete
 * @param bucket - The storage bucket name
 */
export async function deleteFile(
  filePath: string,
  bucket: string = 'partner-documents'
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
}

/**
 * Format file size to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 * @param filename - The filename
 * @returns File extension
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
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

