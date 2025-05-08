"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IConversation } from "@/types/types";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type GroupMembersDialogProps = {
  selectedConversation: IConversation;
};

const GroupMembersDialog = ({
  selectedConversation,
}: GroupMembersDialogProps) => {
  const users = useQuery(api.users.getGroupMembers, {
    conversationId: selectedConversation?._id,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="text-sm text-muted-foreground text-left cursor-pointer">
          {users?.length} members
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[300px]" align="start">
        <div className="flex flex-col max-h-[350px] overflow-y-auto">
          {users?.map((user) => (
            <div
              key={user._id}
              className={`flex gap-3 items-center p-2 rounded-2xl duration-300 hover:bg-violet-100 dark:hover:bg-white/10`}
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
                {selectedConversation.groupOwner === user._id ? (
                  <span className="text-violet-900 text-sm">Owner</span>
                ) : selectedConversation.admins?.includes(user._id) ? (
                  <span className="text-violet-900 text-sm">Admin</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default GroupMembersDialog;
