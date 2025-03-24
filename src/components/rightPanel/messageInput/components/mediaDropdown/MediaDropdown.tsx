"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { File, ImageIcon, Paperclip, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

type MediaDropdownProps = {
  conversationId: Id<"conversations">;
};

const MediaDropdown = ({ conversationId }: MediaDropdownProps) => {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);
  const currentUser = useQuery(api.users.getMe);

  const handleSendImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });

      const { storageId } = await result.json();
      await sendFile({
        conversationId: conversationId,
        storageId: storageId,
        sender: currentUser!._id,
        senderName: currentUser?.name || "",
        messageType: selectedImage.type,
        fileName: selectedImage.name,
      });

      setSelectedImage(null);
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVideo = async () => {
    if (!selectedVideo) return;

    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedVideo.type },
        body: selectedVideo,
      });

      const { storageId } = await result.json();

      await sendFile({
        storageId: storageId,
        conversationId: conversationId,
        sender: currentUser!._id,
        senderName: currentUser?.name || "",
        messageType: selectedVideo.type,
        fileName: selectedVideo.name,
      });

      setSelectedVideo(null);
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      const { storageId } = await result.json();

      await sendFile({
        conversationId,
        storageId: storageId,
        sender: currentUser!._id,
        senderName: currentUser?.name || "",
        messageType: selectedFile.type,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });

      setSelectedFile(null);
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={imageInput}
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files![0])}
        hidden
      />
      <input
        type="file"
        ref={videoInput}
        accept="video/*"
        onChange={(e) => setSelectedVideo(e.target?.files![0])}
        hidden
      />
      <input
        type="file"
        ref={fileInput}
        accept="*/*"
        onChange={(e) => setSelectedFile(e.target?.files![0])}
        hidden
      />

      {selectedImage && (
        <MediaImageDialog
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage}
          isLoading={isLoading}
          handleSendImage={handleSendImage}
        />
      )}

      {selectedVideo && (
        <MediaVideoDialog
          isOpen={selectedVideo !== null}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          isLoading={isLoading}
          handleSendVideo={handleSendVideo}
        />
      )}

      {selectedFile && (
        <FileDialog
          isOpen={selectedFile !== null}
          onClose={() => setSelectedFile(null)}
          selectedFile={selectedFile}
          isLoading={isLoading}
          handleSendFile={handleSendFile}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Paperclip className="text-gray-400 hover:text-primary transition-colors duration-300" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              imageInput.current!.value = "";
              imageInput.current!.click();
            }}
          >
            <ImageIcon size={18} className="mr-1" /> Photo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              videoInput.current!.value = "";
              videoInput.current!.click();
            }}
          >
            <Video size={20} className="mr-1" />
            Video
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              fileInput.current!.value = "";
              fileInput.current!.click();
            }}
          >
            <File size={20} className="mr-1" />
            Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MediaDropdown;

type MediaImageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: File;
  isLoading: boolean;
  handleSendImage: () => void;
};

const MediaImageDialog = ({
  isOpen,
  onClose,
  selectedImage,
  isLoading,
  handleSendImage,
}: MediaImageDialogProps) => {
  const [renderedImage, setRenderedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    const reader = new FileReader();
    reader.onload = (e) => setRenderedImage(e.target?.result as string);
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Photo</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-10 justify-center items-center">
          {renderedImage && (
            <Image
              src={renderedImage}
              width={400}
              height={300}
              alt="selected image"
            />
          )}
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleSendImage}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

type MediaVideoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: File;
  isLoading: boolean;
  handleSendVideo: () => void;
};

const MediaVideoDialog = ({
  isOpen,
  onClose,
  selectedVideo,
  isLoading,
  handleSendVideo,
}: MediaVideoDialogProps) => {
  const renderedVideo = URL.createObjectURL(
    new Blob([selectedVideo], { type: selectedVideo.type })
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Video</DialogTitle>
        </DialogHeader>
        <DialogDescription className="w-full">
          {renderedVideo && (
            <ReactPlayer
              url={renderedVideo}
              controls
              height="100%"
              width="100%"
            />
          )}
        </DialogDescription>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleSendVideo}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

type FileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File;
  isLoading: boolean;
  handleSendFile: () => void;
};

const FileDialog = ({
  isOpen,
  onClose,
  selectedFile,
  isLoading,
  handleSendFile,
}: FileDialogProps) => {
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
          <DialogTitle>Send File</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <File size={40} />
            <div className="flex flex-col">
              <span className="text-foreground">{selectedFile.name}</span>
              <span className="text-gray-400">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </div>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleSendFile}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
