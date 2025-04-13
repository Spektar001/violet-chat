"use client";

import { IConversation } from "@/components/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { Users } from "lucide-react";
import { api } from "../../../convex/_generated/api";

type Props = {
  conversation: IConversation;
  isOpen: boolean;
  onClose: () => void;
};

const GroupInfoModal = ({ conversation, isOpen, onClose }: Props) => {
  const users = useQuery(api.users.getGroupMembers, {
    conversationId: conversation?._id,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="mb-3">
          <DialogTitle className="mb-3">Group Info</DialogTitle>
          <div className="flex items-center gap-4">
            <Avatar className="overflow-visible w-16 h-16">
              <AvatarImage
                src={conversation.groupImage || "/placeholder.png"}
                className="rounded-full object-cover"
              />
            </Avatar>
            <div className="flex flex-col ">
              <p className="text-lg">{conversation.groupName}</p>
              <p className="text-xs text-gray-400">
                {conversation.participants.length} members
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-3 px-3 mb-3">
            <Users className="w-7 h-7" />
            <p className="uppercase text-sm px-3">
              {conversation.participants.length} members
            </p>
          </div>
          <div className="flex flex-col max-h-[350px] overflow-x-auto">
            {users?.map((user) => (
              <div
                key={user._id}
                className="flex gap-3 items-center p-2 rounded-2xl duration-300 hover:bg-violet-100"
              >
                <Avatar className="overflow-visible">
                  <AvatarImage
                    src={user.image}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback>
                    <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
                  </AvatarFallback>
                </Avatar>

                <div className="w-full flex items-center justify-between">
                  <span className="text-ellipsis text-nowrap overflow-hidden">
                    {user.name || user.email.split("@")[0]}
                  </span>
                  {conversation.admins?.includes(user._id) && (
                    <span className="text-violet-900">Owner</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupInfoModal;
