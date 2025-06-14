"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";
import { IConversation, IMessage, IUser } from "@/types/types";
import MessageContextMenu from "@/widgets/messageContextMenu/MessageContextMenu";
import saveAs from "file-saver";
import { File } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactPlayer from "react-player";
import DateIndicator from "../dateIndicator/DateIndicator";

type ChatBubbleProps = {
  message: IMessage;
  currentUser: IUser;
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
  const isAdmin =
    selectedConversation?.admins?.includes(currentUser!._id) ?? false;
  const storageId = message.storageId || undefined;
  const isMyMessage = currentUser._id === message.sender?._id;
  const messageType = message?.messageType.split("/")[0];
  const otherUserId = selectedConversation.participants.find(
    (id) => id !== currentUser._id
  );

  const bgClass = fromMe
    ? "bg-[#AF57DB]/50 dark:bg-primary/50 text-white"
    : "bg-white/50 dark:bg-[#505d6f]/50";

  return (
    <>
      {!fromMe ? (
        <>
          <DateIndicator message={message} previousMessage={previousMessage} />
          <div className="flex gap-1 items-start mb-3">
            {isGroup && (
              <Avatar className="overflow-visible relative">
                {selectedConversation?.isOnline && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white" />
                )}
                <AvatarImage
                  src={message?.sender?.image || "/placeholder.png"}
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
                  className={`relative flex flex-col z-20 max-w-[70%] min-w-[10%] p-2 rounded-e-2xl rounded-bl-2xl shadow-md text-wrap whitespace-pre-wrap break-all break-words ${bgClass} width-image`}
                >
                  {messageType === "text" && <TextMessage message={message} />}
                  {messageType === "video" && (
                    <VideoMessage message={message} />
                  )}
                  {messageType === "application" && (
                    <FileMessage message={message} />
                  )}
                  {messageType === "image" && (
                    <ImageMessage
                      message={message}
                      handleClick={() => setOpen(true)}
                    />
                  )}
                  {open && (
                    <ImageDialog
                      src={message.content}
                      imageSize={message?.imageSize}
                      open={open}
                      onClose={() => setOpen(false)}
                    />
                  )}
                  <p className="text-sm flex items-end justify-end">
                    {formatTime(message._creationTime)}
                  </p>
                </div>
              </ContextMenuTrigger>
              <MessageContextMenu
                isGroup={isGroup}
                isAdmin={isAdmin}
                isMyMessage={isMyMessage}
                messageId={message._id}
                storageId={storageId}
                messageType={messageType}
                otherUserId={otherUserId!}
              />
            </ContextMenu>
          </div>
        </>
      ) : (
        <>
          <DateIndicator message={message} previousMessage={previousMessage} />
          <div className="flex items-end justify-end mb-3 w-full">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div
                  className={`relative max-w-[70%] min-w-[10%] flex flex-col z-20 p-2 rounded-s-2xl rounded-tr-2xl shadow-md text-wrap whitespace-pre-wrap break-all break-words ${bgClass} width-image`}
                >
                  {messageType === "text" && <TextMessage message={message} />}
                  {messageType === "video" && (
                    <VideoMessage message={message} />
                  )}
                  {messageType === "application" && (
                    <FileMessage message={message} />
                  )}
                  {messageType === "image" && (
                    <ImageMessage
                      message={message}
                      handleClick={() => setOpen(true)}
                    />
                  )}
                  {open && (
                    <ImageDialog
                      src={message.content}
                      imageSize={message.imageSize}
                      open={open}
                      onClose={() => setOpen(false)}
                    />
                  )}
                  <p className="text-sm flex gap-2 items-center justify-end">
                    {formatTime(message._creationTime)}
                    {message.status === "sending" && (
                      <Image
                        width={16}
                        height={16}
                        src="/clock.svg"
                        alt="sending"
                      />
                    )}
                    {message.status === "sent" &&
                      (!message.seenBy || message.seenBy.length === 0) && (
                        <Image
                          width={16}
                          height={11}
                          src="/msg-check.svg"
                          alt="sent"
                        />
                      )}
                    {message.status === "seen" &&
                      message.seenBy &&
                      message.seenBy.length > 0 && (
                        <Image
                          width={16}
                          height={11}
                          src="/msg-dblcheck.svg"
                          alt="seen"
                        />
                      )}
                  </p>
                </div>
              </ContextMenuTrigger>
              <MessageContextMenu
                isGroup={isGroup}
                isAdmin={isAdmin}
                isMyMessage={isMyMessage}
                messageId={message._id}
                storageId={message.storageId}
                messageType={messageType}
                otherUserId={otherUserId!}
              />
            </ContextMenu>
          </div>
        </>
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
    <div className="w-[250px] h-[250px] relative size-image">
      <Image
        src={message.content}
        fill
        className="cursor-pointer object-cover rounded-lg"
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
  imageSize,
  onClose,
  open,
}: {
  open: boolean;
  src: string;
  imageSize?: { width: number; height: number };
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex justify-center items-center">
            <Image
              src={src}
              width={imageSize?.width}
              height={imageSize?.height}
              className="object-contain max-h-[400px]"
              alt="image"
            />
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

const VideoMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="relative w-full max-w-[445px] aspect-video rounded-lg overflow-hidden cursor-pointer">
      <ReactPlayer
        url={message.content}
        width="100%"
        height="100%"
        controls={true}
        light={false}
      />
    </div>
  );
};

const FileMessage = ({ message }: { message: IMessage }) => {
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const downloadFile = () => {
    if (!message?.content) return;
    saveAs(message.content, message.fileName);
  };

  return (
    <div
      onClick={downloadFile}
      className="cursor-pointer flex items-center gap-4"
    >
      <File size={40} />
      <div className="flex flex-col">
        <span className="text-foreground">{message.fileName}</span>
        <span className="text-gray-500">
          {formatFileSize(message.fileSize!)}
        </span>
      </div>
    </div>
  );
};
