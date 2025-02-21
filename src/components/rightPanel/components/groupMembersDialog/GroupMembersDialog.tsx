"use client";

import { Conversation } from "@/components/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

type GroupMembersDialogProps = {
  selectedConversation: Conversation;
};

const GroupMembersDialog = ({
  selectedConversation,
}: GroupMembersDialogProps) => {
  const users = useQuery(api.users.getGroupMembers, {
    conversationId: selectedConversation?._id,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <p className="text-sm text-muted-foreground text-left">
          {users?.length} members
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-2">Current Members</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-3">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className={`flex gap-3 items-center p-2 rounded-2xl duration-300 hover:bg-violet-300`}
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

                  <div className="w-full flex items-center gap-2">
                    <div className="w-[90%] flex items-center justify-between">
                      <h3 className="font-medium">
                        {user.name || user.email.split("@")[0]}
                      </h3>
                      {user._id === selectedConversation.admin && (
                        <span>owner</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default GroupMembersDialog;
