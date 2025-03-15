"use client";

import {
  IConversation,
  ICurrentUser,
  IMessage,
} from "@/components/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SuccessSvg } from "@/lib/success";
import MessageContextMenu from "@/widgets/messageContextMenu/MessageContextMenu";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactPlayer from "react-player";

type ChatBubbleProps = {
  message: IMessage;
  currentUser: ICurrentUser;
  previousMessage?: IMessage;
  selectedConversation: IConversation;
};

const ChatBubble = ({
  currentUser,
  message,
  selectedConversation,
  previousMessage,
}: ChatBubbleProps) => {
  const [open, setOpen] = useState(false);
  const fromMe = message.sender?._id === currentUser._id;
  const isGroup = selectedConversation?.isGroup;
  const isAdmin = currentUser._id === selectedConversation.admin;
  const isMyMessage = currentUser._id === message.sender._id;
  const messageType = message?.messageType.split("/")[0];

  const formatTime = (timeStamp: number) => {
    return format(timeStamp, "HH:mm");
  };

  const bgClass = fromMe
    ? "bg-[#AF57DB]/50 dark:bg-primary/50 text-white"
    : "bg-white/50 dark:bg-[#505d6f]/50";

  return (
    <>
      {!fromMe ? (
        <div className="flex gap-1 items-start mb-3">
          {isGroup && (
            <Avatar className="overflow-visible relative">
              {selectedConversation?.isOnline && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white" />
              )}
              <AvatarImage
                src={"/placeholder.png"}
                className="object-cover rounded-full"
              />
              <AvatarFallback>
                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
              </AvatarFallback>
            </Avatar>
          )}
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                className={`relative flex flex-col z-20 max-w-[70%] min-w-[10%] p-2 rounded-e-2xl rounded-bl-2xl shadow-md text-wrap whitespace-pre-wrap break-all break-words ${bgClass}`}
              >
                {messageType === "text" && <TextMessage message={message} />}
                {messageType === "video" && <VideoMessage message={message} />}
                {messageType === "image" && (
                  <ImageMessage
                    message={message}
                    handleClick={() => setOpen(true)}
                  />
                )}
                {open && (
                  <ImageDialog
                    src={message.content}
                    open={open}
                    onClose={() => setOpen(false)}
                  />
                )}
                <p className="flex items-end justify-end">
                  {formatTime(message._creationTime)}
                </p>
              </div>
            </ContextMenuTrigger>
            <MessageContextMenu
              isGroup={isGroup}
              isAdmin={isAdmin}
              isMyMessage={isMyMessage}
              messageId={message._id}
              messageType={messageType}
            />
          </ContextMenu>
        </div>
      ) : (
        <div className="flex items-end justify-end mb-3 w-full">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                className={`relative max-w-[70%] min-w-[10%] flex flex-col gap-1 z-20 p-2 rounded-s-2xl rounded-tr-2xl shadow-md text-wrap whitespace-pre-wrap break-all break-words ${bgClass}`}
              >
                {messageType === "text" && <TextMessage message={message} />}
                {messageType === "video" && <VideoMessage message={message} />}
                {messageType === "image" && (
                  <ImageMessage
                    message={message}
                    handleClick={() => setOpen(true)}
                  />
                )}
                {open && (
                  <ImageDialog
                    src={message.content}
                    open={open}
                    onClose={() => setOpen(false)}
                  />
                )}
                <p className="flex gap-3 items-center justify-end">
                  {formatTime(message._creationTime)}
                  <SuccessSvg />
                </p>
              </div>
            </ContextMenuTrigger>
            <MessageContextMenu
              isGroup={isGroup}
              isAdmin={isAdmin}
              isMyMessage={isMyMessage}
              messageId={message._id}
              messageType={messageType}
            />
          </ContextMenu>
        </div>
      )}
    </>
  );
};

export default ChatBubble;

const ImageMessage = ({
  message,
  handleClick,
}: {
  message: IMessage;
  handleClick: () => void;
}) => {
  return (
    <div className="w-[250px] h-[250px] relative">
      <Image
        src={message.content}
        fill
        className="cursor-pointer object-cover rounded-2xl"
        alt="image"
        onClick={handleClick}
      />
    </div>
  );
};

const TextMessage = ({ message }: { message: IMessage }) => {
  const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

  return (
    <>
      {isLink ? (
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href={message.content}
          className={`text-blue-400 hover:underline`}
        >
          {message.content}
        </Link>
      ) : (
        <>{message.content}</>
      )}
    </>
  );
};

const ImageDialog = ({
  src,
  onClose,
  open,
}: {
  open: boolean;
  src: string;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="min-w-[750px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogDescription className="relative h-[450px] flex justify-center">
          <Image src={src} fill className="object-contain" alt="image" />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

const VideoMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="rounded-2xl">
      <ReactPlayer
        url={message.content}
        width="450px"
        height="250px"
        controls={true}
        light={false}
      />
    </div>
  );
};
