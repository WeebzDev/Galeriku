"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Check, LoaderCircle, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { cn, formatFileSize } from "@/lib/utils";
import { DioUploader } from "@/utils/dropio";

import type { UploadResult } from "@/lib/dropio/client";
import { createFile } from "@/server/actions";

type FileUploaderProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (file: UploadResult) => void;
};

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export function FileUploader(props: FileUploaderProps) {
  const { isOpen, onClose, onUploadComplete } = props;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const abortRef = useRef<() => void>(() => {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const { result } = await DioUploader({
      file: selectedFile,
      onProgress(percent) {
        setUploadProgress(percent);
      },
      setAbortHandler(abortFn) {
        abortRef.current = abortFn;
      },
    });

    if (result.isError) {
      return handleError(result.message);
    } else {
      await createFile(result);
      return handleOnCompleted(result);
    }
  };

  const handleOnCompleted = (result: UploadResult) => {
    if (result.isError) return;

    if (onUploadComplete) {
      onUploadComplete(result);
    }

    setIsUploading(false);

    toast(`Upload Success`, {
      description: `uploaded ${result.originalName}`,
    });

    handleClose(true);
    router.refresh();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0]!;
      handleFileSelect(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadProgress(0);
    setUploadComplete(false);
  };

  const handleClose = (isUploadCompleted?: boolean) => {
    if (isUploading && !isUploadCompleted) return;

    onClose();
    setTimeout(() => {
      resetUploader();
    }, 500);
  };

  const handleAbortUpload = () => {
    if (abortRef.current) {
      abortRef.current();
      setIsUploading(false);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      abortRef.current = () => {};
      return;
    }
  };

  const handleError = (message: string) => {
    toast("Upload failed", {
      description: message ?? "A network error occurred.",
    });
    setIsUploading(false);
    return;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
        return toast("Invalid file type. Only image files are allowed.");
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        return toast(`File size exceeds the maximum allowed size of ${10}MB.`);
      }

      handleFileSelect(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
        </DialogHeader>

        {!selectedFile ? (
          <div
            className={cn(
              "cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleChange(e)}
            />
            <Upload className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <h3 className="mb-1 text-lg font-medium">
              Drag & drop your file here
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              or click to browse from your computer
            </p>
            <p className="text-muted-foreground text-xs">
              Supports all file types up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative flex items-center gap-4 rounded-lg border p-4">
              <div className="bg-muted relative h-10 w-10 overflow-hidden rounded-sm p-2">
                <Image
                  src={previewUrl}
                  alt="Preview Image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-[258px]">
                <p className="truncate font-medium" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              {!isUploading && !uploadComplete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={resetUploader}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {uploadComplete && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              )}
              {isUploading && (
                <div className="absolute bottom-0 left-0 w-full space-y-2">
                  <div className="text-muted-foreground flex justify-end space-x-2 px-4 text-sm">
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  isUploading ? handleAbortUpload() : handleClose()
                }
                className="cursor-pointer"
              >
                {uploadComplete ? "Close" : "Cancel"}
              </Button>
              {!uploadComplete && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="min-w-28 cursor-pointer"
                >
                  {uploadProgress === 100 && isUploading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : uploadProgress ? (
                    <span>{isUploading ? "Uploading..." : "Upload"}</span>
                  ) : (
                    <span>Upload</span>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
