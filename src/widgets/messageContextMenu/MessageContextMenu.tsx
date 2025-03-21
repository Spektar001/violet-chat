"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useQuery } from "convex/react";
import { ArrowDownToLine, Copy, Trash } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import DeleteMessageModal from "../deleteMessageModal/DeleteMessageModal";

type Props = {
  isGroup: boolean;
  isAdmin: boolean;
  isMyMessage: boolean;
  messageId: Id<"messages">;
  messageType: string;
  otherUserId: Id<"users">;
};

const MessageContextMenu = ({
  isGroup,
  isAdmin,
  isMyMessage,
  messageId,
  messageType,
  otherUserId,
}: Props) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const typeImageOrVideo = messageType === "image" || messageType === "video";

  const otherUser = useQuery(api.users.getOtherUser, {
    otherUserId: otherUserId,
  });
  const message = useQuery(api.message.getMessageById, { messageId });

  const copyToClipboard = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isDeleteModalOpen && (
        <DeleteMessageModal
          messageId={messageId}
          isGroup={isGroup}
          participantName={otherUser?.name || otherUser?.email}
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
      <ContextMenuContent>
        {isGroup ? (
          <>
            {isMyMessage ? (
              <>
                {typeImageOrVideo && (
                  <ContextMenuItem>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Сохранить как...
                  </ContextMenuItem>
                )}
                {!typeImageOrVideo && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Копировать текст
                  </ContextMenuItem>
                )}
                <ContextMenuItem onClick={() => setDeleteModalOpen(true)}>
                  <Trash size={20} className="text-gray-700 mr-3" />
                  Удалить
                </ContextMenuItem>
              </>
            ) : (
              <>
                {typeImageOrVideo && (
                  <ContextMenuItem>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Сохранить как...
                  </ContextMenuItem>
                )}
                {!typeImageOrVideo && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Копировать текст
                  </ContextMenuItem>
                )}
                {isAdmin && (
                  <ContextMenuItem onClick={() => setDeleteModalOpen(true)}>
                    <Trash size={20} className="text-gray-700 mr-3" />
                    Удалить
                  </ContextMenuItem>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {isMyMessage ? (
              <>
                {typeImageOrVideo && (
                  <ContextMenuItem>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Сохранить как...
                  </ContextMenuItem>
                )}
                {!typeImageOrVideo && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Копировать текст
                  </ContextMenuItem>
                )}
                <ContextMenuItem onClick={() => setDeleteModalOpen(true)}>
                  <Trash size={20} className="text-gray-700 mr-3" />
                  Удалить
                </ContextMenuItem>
              </>
            ) : (
              <>
                {typeImageOrVideo && (
                  <ContextMenuItem>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Сохранить как...
                  </ContextMenuItem>
                )}
                {!typeImageOrVideo && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Копировать текст
                  </ContextMenuItem>
                )}
              </>
            )}
          </>
        )}
      </ContextMenuContent>
    </>
  );
};

export default MessageContextMenu;
