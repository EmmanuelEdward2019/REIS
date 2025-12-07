import React, { useCallback, useState } from 'react';
import { Upload, X, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/utils/fileUpload';

interface FileUploaderProps {
    bucket: string;
    path?: string;
    accept?: string;
    maxSize?: number; // in MB
    multiple?: boolean;
    onUploadComplete?: (urls: string[]) => void;
    onUploadError?: (error: Error) => void;
    className?: string;
}

interface UploadingFile {
    file: File;
    progress: number;
    status: 'uploading' | 'success' | 'error';
    url?: string;
    error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    bucket,
    path = '',
    accept,
    maxSize = 10, // 10MB default
    multiple = false,
    onUploadComplete,
    onUploadError,
    className,
}) => {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = (file: File): string | null => {
        // Check file size
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `File size exceeds ${maxSize}MB limit`;
        }

        // Check file type if accept is specified
        if (accept) {
            const acceptedTypes = accept.split(',').map(t => t.trim());
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            const mimeType = file.type;

            const isAccepted = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileExtension === type.toLowerCase();
                }
                if (type.includes('*')) {
                    const baseType = type.split('/')[0];
                    return mimeType.startsWith(baseType);
                }
                return mimeType === type;
            });

            if (!isAccepted) {
                return `File type not accepted. Accepted types: ${accept}`;
            }
        }

        return null;
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const filesToUpload = Array.from(files);
        const newUploadingFiles: UploadingFile[] = filesToUpload.map(file => ({
            file,
            progress: 0,
            status: 'uploading' as const,
        }));

        setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

        const uploadPromises = filesToUpload.map(async (file, index) => {
            const validation = validateFile(file);
            if (validation) {
                setUploadingFiles(prev =>
                    prev.map((uf, i) =>
                        uf.file === file
                            ? { ...uf, status: 'error' as const, error: validation, progress: 0 }
                            : uf
                    )
                );
                if (onUploadError) {
                    onUploadError(new Error(validation));
                }
                return null;
            }

            try {
                const uploadedFile = await uploadFile(file, bucket, path);
                const url = uploadedFile.url;

                setUploadingFiles(prev =>
                    prev.map(uf =>
                        uf.file === file
                            ? { ...uf, status: 'success' as const, url, progress: 100 }
                            : uf
                    )
                );

                return url;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Upload failed';
                setUploadingFiles(prev =>
                    prev.map(uf =>
                        uf.file === file
                            ? { ...uf, status: 'error' as const, error: errorMessage, progress: 0 }
                            : uf
                    )
                );
                if (onUploadError) {
                    onUploadError(error instanceof Error ? error : new Error(errorMessage));
                }
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const successfulUrls = results.filter((url): url is string => url !== null);

        if (successfulUrls.length > 0 && onUploadComplete) {
            onUploadComplete(successfulUrls);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, []);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        e.target.value = ''; // Reset input
    };

    const removeFile = (file: File) => {
        setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                )}
            >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                    {accept ? `Accepted: ${accept}` : 'All file types accepted'} • Max {maxSize}MB
                </p>
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInputChange}
                />
                <Button type="button" variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                        Browse Files
                    </label>
                </Button>
            </div>

            {/* Uploading Files List */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                    {uploadingFiles.map((uploadingFile, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 border border-border rounded-lg"
                        >
                            <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{uploadingFile.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                {uploadingFile.status === 'uploading' && (
                                    <Progress value={uploadingFile.progress} className="h-1 mt-2" />
                                )}
                                {uploadingFile.status === 'error' && (
                                    <p className="text-xs text-destructive mt-1">{uploadingFile.error}</p>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                {uploadingFile.status === 'uploading' && (
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                )}
                                {uploadingFile.status === 'success' && (
                                    <CheckCircle className="h-5 w-5 text-success" />
                                )}
                                {uploadingFile.status === 'error' && (
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(uploadingFile.file)}
                                className="flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUploader;
