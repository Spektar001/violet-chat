"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { ImageIcon, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const UserListDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [renderedImage, setRenderedImage] = useState("");

  const router = useRouter();

  const imgRef = useRef<HTMLInputElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const createConversation = useMutation(api.conversations.createConversation);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const currentUser = useQuery(api.users.getMe);
  const users = useQuery(api.users.getUsers);

  const handleDialogClose = () => {
    setSelectedUsers([]);
    setGroupName("");
    setSelectedImage(null);
    setRenderedImage("");
  };

  useEffect(() => {
    if (selectedUsers.length < 2) {
      setGroupName("");
      setSelectedImage(null);
    }
  }, [selectedUsers]);

  useEffect(() => {
    if (!selectedImage) return setRenderedImage("");
    const reader = new FileReader();
    reader.onload = (e) => {
      setRenderedImage(e.target?.result as string);
    };
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      return;
    }
    setIsLoading(true);
    try {
      const isGroup = selectedUsers.length > 1;
      let conversationId;
      if (!isGroup) {
        conversationId = await createConversation({
          participantName: users?.find((user) => user._id === selectedUsers[0])
            ?.name,
          participants: [...selectedUsers, currentUser!._id],
          isGroup: false,
        });
      } else {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage!.type },
          body: selectedImage,
        });
        const { storageId } = await result.json();

        conversationId = await createConversation({
          participants: [...selectedUsers, currentUser!._id],
          isGroup: true,
          groupName: groupName,
          groupImage: storageId,
          admin: currentUser?._id,
        });
      }
      dialogCloseRef.current?.click();
      setSelectedUsers([]);
      setGroupName("");
      setSelectedImage(null);

      if (conversationId) {
        router.push(`/v/${conversationId}`);
      }
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) handleDialogClose();
      }}
    >
      <DialogTrigger>
        <MessageSquare className="text-gray-400 hover:text-primary transition-colors duration-300" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogClose ref={dialogCloseRef} />
          <DialogTitle>Users</DialogTitle>
        </DialogHeader>
        <DialogDescription>Start a new chat</DialogDescription>
        {renderedImage && (
          <div className="w-16 h-16 relative mx-auto">
            <Image
              src={renderedImage}
              fill
              alt="user image"
              className="rounded-full object-cover border border-violet-500"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={imgRef}
          hidden
          onChange={(e) => setSelectedImage(e.target.files![0])}
        />
        {selectedUsers.length > 1 && (
          <>
            <Button
              className="flex gap-2"
              onClick={() => imgRef.current?.click()}
            >
              <ImageIcon size={20} />
              Group Image
            </Button>
            <Input
              placeholder="Group Name"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </>
        )}
        <div className="flex flex-col gap-3 overflow-auto max-h-60">
          {users?.map((user) => (
            <div
              key={user._id}
              className={`flex gap-3 items-center p-2 rounded-2xl cursor-pointer active:scale-95 transition-all ease-in-out duration-300 ${selectedUsers.includes(user._id) ? "bg-[#AF57DB] text-white" : "hover:bg-violet-100 dark:hover:bg-white/10"}`}
              onClick={() => {
                if (selectedUsers.includes(user._id)) {
                  setSelectedUsers(
                    selectedUsers.filter((id) => id !== user._id)
                  );
                } else {
                  setSelectedUsers([...selectedUsers, user._id]);
                }
              }}
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

              <div className="w-full ">
                <div className="flex items-center justify-between">
                  <p className="text-md font-medium">
                    {user.name || user.email.split("@")[0]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="destructive"
            onClick={() => dialogCloseRef.current?.click()}
          >
            Cancel
          </Button>
          <Button
            disabled={
              selectedUsers.length === 0 ||
              (selectedUsers.length > 1 &&
                (!groupName.trim() || !selectedImage)) ||
              isLoading
            }
            onClick={handleCreateConversation}
          >
            {isLoading ? (
              <Image
                width={24}
                height={24}
                src={"spinner.svg"}
                alt={"spinner"}
              />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialog;
