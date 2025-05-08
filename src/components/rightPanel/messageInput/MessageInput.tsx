"use client";

import { Button } from "@/components/ui/button";
import { IConversation } from "@/types/types";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { SendHorizontal, Smile } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { api } from "../../../../convex/_generated/api";
import MediaDropdown from "./components/mediaDropdown/MediaDropdown";

type MessageInputProps = {
  selectedConversation: IConversation;
};

const MessageInput = ({ selectedConversation }: MessageInputProps) => {
  const [msgText, setMsgText] = useState("");
  const sendTextMsg = useMutation(api.messages.sendTextMessages);
  const updateMessageStatus = useMutation(api.message.updateMessageStatus);
  const currentUser = useQuery(api.users.getMe);

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!msgText.trim()) return;

    try {
      const messageId = await sendTextMsg({
        content: msgText,
        conversationId: selectedConversation!._id,
        senderId: currentUser!._id,
        senderName: currentUser?.name || "",
        status: "sending",
      });
      setMsgText("");
      await updateMessageStatus({ messageId, status: "sent" });
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    }
  };

  return (
    <div className="py-3 px-5 border-t flex gap-3">
      <div className="flex items-end gap-3 mb-2">
        <Smile />
        <MediaDropdown conversationId={selectedConversation._id} />
      </div>
      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3">
        <div className="space-y-2 h-full w-full">
          <TextareaAutosize
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                await handleSendTextMsg(e);
              }
            }}
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            rows={1}
            maxRows={3}
            placeholder="Type a message..."
            className="min-h-full w-full resize-none border-0 outline-0 p-1.5"
          />
        </div>
        <div className="self-end">
          <Button disabled={msgText.trim() ? false : true} type="submit">
            <SendHorizontal />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
