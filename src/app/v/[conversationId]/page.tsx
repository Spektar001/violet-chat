"use client";

import GroupMembersDialog from "@/components/rightPanel/groupMembersDialog/GroupMembersDialog";
import MessageContainer from "@/components/rightPanel/messageContainer/MessageContainer";
import MessageInput from "@/components/rightPanel/messageInput/MessageInput";
import RightPanelFallback from "@/components/RightPanelFallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatOptionsDropdown from "@/widgets/сhatOptionsDropdown/ChatOptionsDropdown";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  params: Promise<{ conversationId: Id<"conversations"> }>;
};

const ConversationPage = ({ params }: Props) => {
  const router = useRouter();
  const { conversationId } = use(params);
  const conversation = useQuery(api.conversation.getConversationById, {
    id: conversationId,
  });
  const currentUser = useQuery(api.users.getMe);

  const isAdmin = currentUser?._id === conversation?.admin;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.push("/v");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [router]);

  if (!conversation) {
    return <RightPanelFallback />;
  }

  const conversationName =
    conversation?.participantName || conversation?.groupName;
  const conversationImage =
    conversation?.otherUser?.image || conversation?.groupImage;

  return (
    <div className="w-3/4 h-full flex flex-col">
      <div className="py-3 px-5 flex justify-between items-center border-b">
        <div className="flex items-center gap-3">
          <Link href={"/v"}>
            <ArrowLeft className="mr-3 text-gray-400 hover:text-primary transition-colors duration-300" />
          </Link>
          <Avatar>
            <AvatarImage
              src={conversationImage || "/placeholder.png"}
              className="object-cover"
            />
            <AvatarFallback>
              <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p>{conversationName}</p>
            {conversation?.isGroup && (
              <GroupMembersDialog selectedConversation={conversation} />
            )}
          </div>
        </div>
        <ChatOptionsDropdown isAdmin={isAdmin} conversation={conversation} />
      </div>
      <MessageContainer selectedConversation={conversation} />
      <MessageInput selectedConversation={conversation} />
    </div>
  );
};

export default ConversationPage;
