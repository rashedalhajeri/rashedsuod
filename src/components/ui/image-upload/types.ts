
export interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  storeId?: string;
  bucketName?: string;
  folderPath?: string;
  maxFiles?: number;
  uploadText?: string;
  emptyText?: string;
}

export interface ImagePreviewProps {
  imageUrl: string;
  index: number;
  onRemove: (index: number) => void;
}

export interface UploadDropZoneProps {
  isDragging: boolean;
  isUploading: boolean;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  isEmpty: boolean;
}

export interface UploadErrorAlertProps {
  errorMessage: string;
  onRetry: () => void;
  isRetrying: boolean;
}
