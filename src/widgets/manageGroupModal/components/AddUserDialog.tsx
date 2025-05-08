"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IUser } from "@/types/types";
import Image from "next/image";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  users: IUser[];
  onConfirm: (userIds: Id<"users">[]) => void;
};

const AddUserDialog = ({ isOpen, onClose, users, onConfirm }: Props) => {
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleUser = (userId: Id<"users">) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirm = () => {
    setIsLoading(true);
    onConfirm(selectedUsers);
    setSelectedUsers([]);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setSelectedUsers([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Users to Add</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto">
          {users?.map((user) => (
            <div
              key={user._id}
              className={`p-2 rounded-2xl flex items-center justify-between cursor-pointer duration-200 ${
                selectedUsers.includes(user._id)
                  ? "bg-[#AF57DB]"
                  : "hover:bg-violet-100 dark:hover:bg-white/10"
              }`}
              onClick={() => toggleUser(user._id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.image} />
                  <AvatarFallback />
                </Avatar>
                <span>{user.name || user.email.split("@")[0]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={selectedUsers.length === 0 || isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? (
              <Image
                width={24}
                height={24}
                src={"/spinner.svg"}
                alt={"spinner"}
              />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
