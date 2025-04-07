"use cient";

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
  groupName?: string;
  groupImage?: string;
  isOpen: boolean;
  onClose: () => void;
};

const LeaveUserModal = ({
  conversationId,
  groupName,
  groupImage,
  isOpen,
  onClose,
}: Props) => {
  const leaveUser = useMutation(api.conversation.leaveUser);

  const handleLeaveUser = async (conversationId: Id<"conversations">) => {
    try {
      await leaveUser({ conversationId });
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
                src={groupImage || "/placeholder.png"}
                className="object-cover"
              />
            </Avatar>
            {groupName}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to leave this group?
        </DialogDescription>
        <div className="flex items-center justify-end gap-10">
          <Button variant="ghost" className="text-gray-500" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleLeaveUser(conversationId);
            }}
          >
            Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveUserModal;
