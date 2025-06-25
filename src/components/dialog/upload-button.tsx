"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FileUploader } from "./file-uploader";

export function UploadFileButton() {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  return (
    <>
      <FileUploader
        isOpen={isUploading}
        onClose={() => setIsUploading(false)}
        onUploadComplete={(result) => console.log("log from button", result)}
      />
      <Button onClick={() => setIsUploading(true)} className="cursor-pointer">
        <Plus className="mr-2 h-4 w-4" />
        Upload
      </Button>
    </>
  );
}
