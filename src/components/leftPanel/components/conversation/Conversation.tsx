"use client";

import { useConversationStore } from "@/components/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ImageIcon, Users, VideoIcon } from "lucide-react";

const Conversation = ({ conversation }: { conversation: any }) => {
  const conversationImage = conversation.groupImage || conversation.image;
  const conversationName = conversation.groupName || conversation.name;
  const lastMessage = conversation.lastMessage;
  const lastMessageType = lastMessage?.messageType;

  const formatTime = (timeStamp: number) => {
    return format(timeStamp, "HH:mm");
  };

  // const currentUser = useQuery(api.users.getMe);

  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const activeBgClass = selectedConversation?._id === conversation._id;

  return (
    <>
      <div
        className={`flex gap-2 items-center p-3 rounded-2xl duration-300 cursor-pointer ${activeBgClass ? "bg-[#AF57DB] text-white" : "hover:bg-violet-300"} `}
        onClick={() => setSelectedConversation(conversation)}
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
            {/* {lastMessage?.sender === currentUser?._id ? <SuccessSvg /> : ""} */}
            {conversation.isGroup && <Users size={16} />}
            {!lastMessage && "Say Hi!"}
            {lastMessageType === "text" && (
              <span className="text-xs overflow-hidden whitespace-nowrap text-ellipsis">
                {lastMessage?.content}
              </span>
            )}
            {lastMessageType === "image" && <ImageIcon size={16} />}
            {lastMessageType === "video" && <VideoIcon size={16} />}
          </p>
        </div>
      </div>
    </>
  );
};

export default Conversation;
