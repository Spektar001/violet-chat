"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContextMenuTrigger } from "@/components/ui/context-menu";
import { formatTimeConversation } from "@/lib/utils";
import { IConversation, IUser } from "@/types/types";
import ChatContextMenu from "@/widgets/chatContextMenu/ChatContextMenu";
import { ContextMenu } from "@radix-ui/react-context-menu";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import ReactPlayer from "react-player";
import { api } from "../../../../../convex/_generated/api";
import UnseenCount from "../unseenCount/UnseenCount";

type ConversationProps = {
  pathname: string;
  conversation: IConversation;
  currentUser: IUser;
};

const Conversation = ({
  pathname,
  conversation,
  currentUser,
}: ConversationProps) => {
  const conversationImage = conversation.groupImage || conversation.image;
  const conversationName = conversation.groupName || conversation.name;
  const lastMessage = conversation.lastMessage;
  const lastMessageType = lastMessage?.messageType.split("/")[0];
  const imageType = lastMessage?.messageType.split("/")[1];

  const unseenCount = useQuery(api.message.getUnseenMessageCount, {
    conversationId: conversation._id,
    currentUser: currentUser._id,
  });

  const isAdmin = conversation?.admins?.includes(currentUser._id) ?? false;

  const senderName =
    lastMessage?.senderName === currentUser?.name
      ? "You"
      : lastMessage?.senderName.trim();

  const activeBgClass: boolean = conversation._id === pathname;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return "/clock.svg";
      case "sent":
        if (!activeBgClass) {
          return "/msg-gray-check.svg";
        } else {
          return "/msg-check.svg";
        }
      case "seen":
        if (!activeBgClass) {
          return "/msg-gray-dblcheck.svg";
        } else {
          return "/msg-dblcheck.svg";
        }
      default:
        return "/clock.svg";
    }
  };

  return (
    <Link href={`/v/${conversation._id}`}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`flex gap-2 items-start p-3 rounded-2xl duration-300 cursor-pointer ${activeBgClass ? "bg-[#AF57DB] text-white" : "hover:bg-violet-100 dark:hover:bg-white/10"} `}
          >
            <Avatar className="overflow-visible relative">
              <AvatarImage
                src={conversationImage || "/placeholder.png"}
                className="object-cover rounded-full"
              />
              <AvatarFallback>
                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
              </AvatarFallback>
            </Avatar>
            <div className="w-full overflow-hidden">
              <div className="flex items-center">
                <h3 className="text-xs lg:text-sm font-medium">
                  {conversationName}
                </h3>
                <div
                  className={`flex gap-1 text-[10px] lg:text-xs ${activeBgClass ? "text-white" : "text-gray-500"} ml-auto`}
                >
                  {!conversation.isGroup &&
                    lastMessage?.senderId === currentUser._id && (
                      <Image
                        width={16}
                        height={11}
                        src={getStatusIcon(lastMessage?.status)}
                        alt="checkIcon"
                      />
                    )}
                  {formatTimeConversation(
                    lastMessage?._creationTime || conversation._creationTime
                  )}
                </div>
              </div>
              <p
                className={`text-[12px] mt-1 flex items-center justify-between gap-1 ${activeBgClass ? "text-white" : "text-gray-500"} `}
              >
                {lastMessageType === "text" &&
                  (conversation.isGroup ? (
                    <span className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
                      {senderName}: {lastMessage?.content}
                    </span>
                  ) : (
                    <span className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
                      {lastMessage?.content}
                    </span>
                  ))}
                {lastMessageType === "application" &&
                  (conversation.isGroup ? (
                    <span className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
                      {senderName}: {lastMessage?.fileName}
                    </span>
                  ) : (
                    <span className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
                      {lastMessage?.fileName}
                    </span>
                  ))}
                {lastMessageType === "image" &&
                  imageType !== "gif" &&
                  (conversation.isGroup ? (
                    <>
                      {senderName}:{" "}
                      <Image
                        className="rounded-sm h-5"
                        src={lastMessage?.content || ""}
                        width={20}
                        height={25}
                        alt={"image"}
                      />
                    </>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Image
                        className="rounded-sm h-5"
                        src={lastMessage?.content || ""}
                        width={20}
                        height={25}
                        alt={"image"}
                      />
                      Photo
                    </span>
                  ))}
                {!conversation.isGroup && imageType === "gif" && (
                  <span className="uppercase">GIF</span>
                )}
                {imageType === "gif" && conversation.isGroup && (
                  <>
                    {senderName}: <span className="uppercase">GIF</span>
                  </>
                )}
                {lastMessageType === "video" && conversation.isGroup && (
                  <>
                    {senderName}:{" "}
                    <ReactPlayer
                      url={lastMessage?.content}
                      width="30px"
                      height="20px"
                      controls={false}
                      light={false}
                    />
                    Video
                  </>
                )}
                {!conversation.isGroup && lastMessageType === "video" && (
                  <>
                    <ReactPlayer
                      url={lastMessage?.content}
                      width="30px"
                      height="20px"
                      controls={false}
                      light={false}
                    />
                    Video
                  </>
                )}
                {!activeBgClass && unseenCount?.length !== 0 && (
                  <UnseenCount unseenCount={unseenCount} />
                )}
              </p>
            </div>
          </div>
        </ContextMenuTrigger>
        <ChatContextMenu isAdmin={isAdmin} conversation={conversation} />
      </ContextMenu>
    </Link>
  );
};

export default Conversation;
