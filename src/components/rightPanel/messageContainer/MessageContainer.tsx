"use client";

import { IConversation, IUser } from "@/types/types";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Image from "next/image";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";
import ChatBubble from "../chatBubble/ChatBubble";
import GroupFeatures from "./components/GroupFeatures";

type MessageContainerProps = {
  selectedConversation: IConversation;
};

const MessageContainer = ({ selectedConversation }: MessageContainerProps) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.messages.getMessages, {
    conversationId: selectedConversation!._id,
  });
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const sendFile = useMutation(api.messages.sendFile);
  const updateMessageStatus = useMutation(api.message.updateMessageStatus);
  const markSeen = useMutation(api.message.markMessagesSeen);
  const currentUser = useQuery(api.users.getMe) as IUser | undefined;

  const handleImageClick = async () => {
    try {
      const response = await fetch("/hello.gif");
      const blob = await response.blob();
      const file = new File([blob], "hello.gif", { type: blob.type });

      await handleSendImage(file);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send image");
    }
  };

  const handleSendImage = async (imageFile: File) => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });

      const { storageId } = await result.json();
      const messageId = await sendFile({
        conversationId: selectedConversation._id,
        storageId: storageId,
        senderId: currentUser!._id,
        senderName: currentUser?.name || "",
        messageType: imageFile.type,
        fileName: imageFile.name,
        status: "sending",
      });
      await updateMessageStatus({ messageId, status: "sent" });
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [messages]);

  useEffect(() => {
    if (
      messages &&
      messages?.length > 0 &&
      selectedConversation?._id &&
      currentUser?._id
    ) {
      markSeen({
        conversationId: selectedConversation._id,
        userId: currentUser._id,
      });
    }
  }, [currentUser?._id, markSeen, messages, selectedConversation._id]);

  if (messages?.length === 0) {
    return (
      <div className="py-3 px-5 flex-1 w-full flex flex-col items-center justify-center overflow-y-scroll no-scrollbar bg-chat-tile-light dark:bg-chat-tile-dark">
        {selectedConversation.isGroup ? (
          <GroupFeatures
            currentUser={currentUser!}
            groupOwner={selectedConversation.groupOwner!}
          />
        ) : (
          <div className="w-72 flex flex-col items-center justify-center p-4 text-center text-white bg-violet-400/50 dark:bg-white/10 rounded-2xl">
            <p className="text font-medium">No messages here yet...</p>
            <p className="w-52">
              Send a message or click on the greeting below
            </p>
            <Image
              className="cursor-pointer"
              onClick={handleImageClick}
              src={"/hello.gif"}
              width={150}
              height={200}
              alt={"hello"}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-3 px-5 flex-1 w-full flex flex-col gap-3 overflow-y-scroll no-scrollbar bg-chat-tile-light dark:bg-chat-tile-dark">
      <div className="flex flex-col max-w-full h-full">
        {messages?.map((message, idx) => (
          <div key={message._id} ref={lastMessageRef}>
            <ChatBubble
              message={message}
              currentUser={currentUser!}
              previousMessage={idx > 0 ? messages[idx - 1] : undefined}
              selectedConversation={selectedConversation}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageContainer;
