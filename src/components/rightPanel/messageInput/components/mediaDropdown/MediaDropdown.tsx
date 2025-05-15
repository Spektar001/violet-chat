"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { File, ImageIcon, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import FileDialog from "./components/FileDialog";

type MediaDropdownProps = {
  conversationId: Id<"conversations">;
};

const MediaDropdown = ({ conversationId }: MediaDropdownProps) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);
  const updateMessageStatus = useMutation(api.message.updateMessageStatus);
  const currentUser = useQuery(api.users.getMe);

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

      const messageId = await sendFile({
        conversationId,
        storageId: storageId,
        senderId: currentUser!._id,
        senderName: currentUser?.name || "",
        messageType: selectedFile.type,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        imageSize: imageSize ?? undefined,
        status: "sending",
      });

      setSelectedFile(null);
      await updateMessageStatus({ messageId, status: "sent" });
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
        ref={fileInput}
        accept=""
        onChange={(e) => setSelectedFile(e.target?.files![0])}
        hidden
      />

      {selectedFile && (
        <FileDialog
          isOpen={selectedFile !== null}
          onClose={() => setSelectedFile(null)}
          selectedFile={selectedFile}
          isLoading={isLoading}
          handleSendFile={handleSendFile}
          fileType={selectedFile.type}
          onImageSize={(size) => setImageSize(size)}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Paperclip className="text-gray-400 hover:text-primary transition-colors duration-300" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              fileInput.current!.accept = "image/*,video/*";
              fileInput.current!.value = "";
              fileInput.current!.click();
            }}
          >
            <ImageIcon size={18} className="mr-1" /> Photo or Video
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              fileInput.current!.accept = "*/*";
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
