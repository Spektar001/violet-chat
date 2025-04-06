"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  conversationId: Id<"conversations">;
  participantName?: string;
  groupName?: string;
  groupImage?: string;
  participantImage?: string;
  isGroup: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const DeleteChatModal = ({
  conversationId,
  groupImage,
  participantImage,
  participantName,
  groupName,
  isGroup,
  isOpen,
  onClose,
}: Props) => {
  const deleteChat = useMutation(api.conversation.deleteChat);

  const handleDeleteChat = async (conversationId: Id<"conversations">) => {
    try {
      await deleteChat({ conversationId });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={participantImage || groupImage || "/placeholder.png"}
                className="object-cover"
              />
            </Avatar>
            {isGroup ? groupName : "Delete chat"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-2">
          <p>
            Are you sure you want to delete all message history with{" "}
            {participantName}?
          </p>
          <p>This action cannot be undone.</p>
          <p>Also removed for {participantName}</p>
        </DialogDescription>
        <div className="flex items-center justify-end gap-10">
          <Button variant="ghost" className="text-gray-500" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChat(conversationId);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChatModal;
