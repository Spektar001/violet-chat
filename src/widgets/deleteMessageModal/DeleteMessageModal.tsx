"use client";

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
  messageId: Id<"messages">;
  storageId?: Id<"_storage">;
  participantName?: string;
  isGroup: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const DeleteMessageModal = ({
  messageId,
  storageId,
  participantName,
  isGroup,
  isOpen,
  onClose,
}: Props) => {
  const deleteMessage = useMutation(api.message.deleteMessageById);

  const deleteMessageById = async (
    messageId: Id<"messages">,
    storageId?: Id<"_storage">
  ) => {
    try {
      await deleteMessage({ messageId, storageId });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to delete this message?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {!isGroup ? (
            <span>
              This message will also be deleted from {participantName}
            </span>
          ) : (
            <span>This message will also be deleted for everyone</span>
          )}
        </DialogDescription>
        <div className="flex items-center justify-end gap-10">
          <Button variant="ghost" className="text-gray-500" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => deleteMessageById(messageId, storageId)}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
