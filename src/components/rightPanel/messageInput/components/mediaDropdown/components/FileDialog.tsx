"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { File } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type FileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File;
  isLoading: boolean;
  handleSendFile: () => void;
  fileType: string;
};

const FileDialog = ({
  isOpen,
  onClose,
  selectedFile,
  isLoading,
  handleSendFile,
  fileType,
}: FileDialogProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const previewVideo = URL.createObjectURL(
    new Blob([selectedFile], { type: selectedFile.type })
  );

  const type = fileType.split("/")[0];

  useEffect(() => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "image"
              ? "Send Photo"
              : type === "video"
                ? "Send Video"
                : "Send File"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-4">
          {type === "image" && preview && (
            <div className="flex justify-center items-center">
              <Image
                src={preview}
                width={400}
                height={300}
                alt="selected image"
              />
            </div>
          )}
          {type === "video" && previewVideo && (
            <ReactPlayer
              url={previewVideo}
              controls
              height="100%"
              width="100%"
            />
          )}
          {type === "application" && (
            <div className="flex items-center gap-4">
              <File size={40} />
              <div className="flex flex-col">
                <span className="text-foreground">{selectedFile.name}</span>
                <span className="text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-end gap-10">
            <Button variant="ghost" className="text-gray-500" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleSendFile}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default FileDialog;
