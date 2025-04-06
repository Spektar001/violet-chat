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
  conversationId: Id<"conversations">;
  participantName?: string;
  groupName?: string;
  isGroup: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const ClearHistoryModal = ({
  conversationId,
  participantName,
  groupName,
  isGroup,
  isOpen,
  onClose,
}: Props) => {
  const clearHistory = useMutation(api.conversation.clearHistory);

  const handleClearHistory = async (conversationId: Id<"conversations">) => {
    try {
      await clearHistory({ conversationId });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isGroup
              ? `Are you sure you want to delete all messages in "${groupName}"?`
              : `Are you sure you want to delete all message history with ${participantName}?`}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-2">
          <p>This action cannot be undone.</p>
          {isGroup ? (
            <p>This will clear the history for all chat participants.</p>
          ) : (
            <p>Also removed for {participantName}</p>
          )}
        </DialogDescription>
        <div className="flex items-center justify-end gap-10">
          <Button variant="ghost" className="text-gray-500" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleClearHistory(conversationId);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClearHistoryModal;
