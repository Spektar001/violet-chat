"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useQuery } from "convex/react";
import saveAs from "file-saver";
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
  storageId?: Id<"_storage">;
  messageType: string;
  otherUserId: Id<"users">;
};

const MessageContextMenu = ({
  isGroup,
  isAdmin,
  isMyMessage,
  messageId,
  storageId,
  messageType,
  otherUserId,
}: Props) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const typeFile =
    messageType === "image" ||
    messageType === "video" ||
    messageType === "application";

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

  const downloadFile = () => {
    if (!message?.content) return;
    saveAs(message.content, message.fileName);
  };

  return (
    <>
      {isDeleteModalOpen && (
        <DeleteMessageModal
          messageId={messageId}
          storageId={storageId}
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
                {typeFile && (
                  <ContextMenuItem onClick={downloadFile}>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Загрузить
                  </ContextMenuItem>
                )}
                {!typeFile && (
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
                {typeFile && (
                  <ContextMenuItem onClick={downloadFile}>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Загрузить
                  </ContextMenuItem>
                )}
                {!typeFile && (
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
                {typeFile && (
                  <ContextMenuItem onClick={downloadFile}>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Загрузить
                  </ContextMenuItem>
                )}
                {!typeFile && (
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
                {typeFile && (
                  <ContextMenuItem onClick={downloadFile}>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Загрузить
                  </ContextMenuItem>
                )}
                {!typeFile && (
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
