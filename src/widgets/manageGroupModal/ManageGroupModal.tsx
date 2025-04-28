"use client";

import { IConversation } from "@/components/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { Check, Star, StarOff, UserMinus, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import AddUserDialog from "./components/AddUserDialog";

type Props = {
  conversation: IConversation;
  isOpen: boolean;
  onClose: () => void;
};

const ManageGroupModal = ({ conversation, isOpen, onClose }: Props) => {
  const [groupName, setGroupName] = useState(conversation.groupName);
  const [editingName, setEditingName] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const users = useQuery(api.users.getGroupMembers, {
    conversationId: conversation?._id,
  });
  const allUsers = useQuery(api.users.getUsers);

  const updateParticipants = useMutation(api.conversation.updateParticipants);
  const updateConversation = useMutation(api.conversation.updateConversation);
  const updateAdmins = useMutation(api.conversation.updateAdmins);

  const handleNameSave = async () => {
    await updateConversation({
      conversationId: conversation._id,
      groupName: groupName!,
    });
    setEditingName(false);
  };

  const handleRemoveUser = async (userId: Id<"users">) => {
    await updateParticipants({
      conversationId: conversation._id,
      action: "remove",
      userIds: userId,
    });
  };

  const handleAddUsers = async (userIds: Id<"users">[]) => {
    await updateParticipants({
      conversationId: conversation._id,
      action: "add",
      userIds: userIds,
    });
    setAddDialogOpen(false);
  };

  const handleRemoveAdmin = async (userId: Id<"users">) => {
    await updateAdmins({
      conversationId: conversation._id,
      action: "remove",
      userId: userId,
    });
  };

  const handleAddAdmin = async (userIds: Id<"users">) => {
    await updateAdmins({
      conversationId: conversation._id,
      action: "add",
      userId: userIds,
    });
  };

  useEffect(() => {
    setGroupName(conversation.groupName);
  }, [conversation.groupName]);

  const nonMembers = useMemo(() => {
    if (!allUsers || !conversation.participants) return [];
    return allUsers.filter(
      (user) => !conversation.participants.includes(user._id)
    );
  }, [allUsers, conversation.participants]);

  return (
    <>
      <AddUserDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        users={nonMembers}
        onConfirm={handleAddUsers}
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader className="mb-3">
            <DialogTitle className="mb-3">Manage Group</DialogTitle>
            <div className="flex items-center gap-4">
              <Avatar className="overflow-visible w-16 h-16">
                <AvatarImage
                  src={conversation.groupImage || "/placeholder.png"}
                  className="rounded-full object-cover"
                />
              </Avatar>
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setEditingName(true);
                  }}
                />
                {editingName && groupName!.trim() && (
                  <Check
                    className="cursor-pointer text-primary"
                    onClick={handleNameSave}
                  />
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-3 px-3 mb-3 justify-between">
              <div className="flex items-end gap-3">
                <Users className="w-7 h-7" />
                <p className="uppercase text-sm px-3">
                  {conversation.participants.length} members
                </p>
              </div>
              <UserPlus
                className="w-7 h-7 cursor-pointer text-gray-400 hover:text-primary transition-colors duration-300"
                onClick={() => setAddDialogOpen(true)}
              />
            </div>

            <div className="flex flex-col max-h-[350px] overflow-y-auto">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className="flex gap-3 items-center p-2 rounded-2xl duration-300 hover:bg-violet-100 dark:hover:bg-white/10"
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
                    <div className="flex flex-col">
                      <span className="text-ellipsis text-nowrap overflow-hidden">
                        {user.name || user.email.split("@")[0]}
                      </span>
                      {conversation.groupOwner === user._id ? (
                        <span className="text-violet-900 text-sm">Owner</span>
                      ) : conversation.admins?.includes(user._id) ? (
                        <span className="text-violet-900 text-sm">Admin</span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      {!conversation.admins?.includes(user._id) ? (
                        <Star
                          className="cursor-pointer text-gray-400 hover:text-primary transition-colors duration-300"
                          onClick={() => handleAddAdmin(user._id)}
                        />
                      ) : (
                        <StarOff
                          className="cursor-pointer text-gray-400 hover:text-primary transition-colors duration-300"
                          onClick={() => handleRemoveAdmin(user._id)}
                        />
                      )}
                      <UserMinus
                        className="cursor-pointer text-gray-400 hover:text-primary transition-colors duration-300"
                        onClick={() => handleRemoveUser(user._id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageGroupModal;
