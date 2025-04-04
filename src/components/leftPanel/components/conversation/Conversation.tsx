"use client";

import { IConversation } from "@/components/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import ReactPlayer from "react-player";
import { api } from "../../../../../convex/_generated/api";

type ConversationProps = {
  pathname: string;
  conversation: IConversation;
};

const Conversation = ({ pathname, conversation }: ConversationProps) => {
  const conversationImage = conversation.groupImage || conversation.image;
  const conversationName = conversation.groupName || conversation.name;
  const lastMessage = conversation.lastMessage;
  const lastMessageType = lastMessage?.messageType.split("/")[0];
  const imageType = lastMessage?.messageType.split("/")[1];

  const currentUser = useQuery(api.users.getMe);

  const senderName =
    lastMessage?.senderName === currentUser?.name
      ? "You"
      : lastMessage?.senderName.trim();

  const formatTime = (timeStamp: number) => {
    return format(timeStamp, "HH:mm");
  };

  const activeBgClass = conversation._id === pathname;

  return (
    <Link href={`/v/${conversation._id}`}>
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
            <span
              className={`text-[10px] lg:text-xs ${activeBgClass ? "text-white" : "text-gray-500"} ml-auto`}
            >
              {formatTime(
                lastMessage?._creationTime || conversation._creationTime
              )}
            </span>
          </div>
          <p
            className={`text-[12px] mt-1 flex items-center gap-1 ${activeBgClass ? "text-white" : "text-gray-500"} `}
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
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Conversation;
