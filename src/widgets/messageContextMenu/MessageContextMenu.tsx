"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { formatSeenAt } from "@/lib/utils";
import { useQuery } from "convex/react";
import saveAs from "file-saver";
import { ArrowDownToLine, Copy, Trash } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import DeleteMessageModal from "../deleteMessageModal/DeleteMessageModal";
import MessageSeenBy from "./components/MessageSeenBy/MessageSeenBy";

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
  const { resolvedTheme } = useTheme();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const typeFile =
    messageType === "image" ||
    messageType === "video" ||
    messageType === "application";

  const otherUser = useQuery(api.users.getOtherUser, {
    otherUserId: otherUserId,
  });
  const message = useQuery(api.message.getMessageById, { messageId });
  const userIds = message?.seenBy?.map((s) => s.userId) || [];
  const seenByMap = new Map(
    message?.seenBy?.map((entry) => [entry.userId, entry.seenAt])
  );
  const seenUsers = useQuery(api.users.getUsersByIds, {
    userIds: userIds,
  });

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
                    Download
                  </ContextMenuItem>
                )}
                {!typeFile && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Copy Text
                  </ContextMenuItem>
                )}
                <ContextMenuItem onClick={() => setDeleteModalOpen(true)}>
                  <Trash size={20} className="text-gray-700 mr-3" />
                  Delete
                </ContextMenuItem>
                {message?.seenBy && seenUsers && seenUsers.length > 0 && (
                  <MessageSeenBy seenUsers={seenUsers} seenByMap={seenByMap} />
                )}
              </>
            ) : (
              <>
                {typeFile && (
                  <ContextMenuItem onClick={downloadFile}>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Download
                  </ContextMenuItem>
                )}
                {!typeFile && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Copy Text
                  </ContextMenuItem>
                )}
                {isAdmin && (
                  <ContextMenuItem onClick={() => setDeleteModalOpen(true)}>
                    <Trash size={20} className="text-gray-700 mr-3" />
                    Delete
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
                    Download
                  </ContextMenuItem>
                )}
                {!typeFile && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Copy Text
                  </ContextMenuItem>
                )}
                <ContextMenuItem onClick={() => setDeleteModalOpen(true)}>
                  <Trash size={20} className="text-gray-700 mr-3" />
                  Delete
                </ContextMenuItem>
                {message?.seenBy && message.seenBy.length > 0 && (
                  <div className="flex items-center gap-2 mt-1 text-sm px-3 py-1.5 border-t cursor-default">
                    <Image
                      width={16}
                      height={11}
                      src={
                        resolvedTheme === "dark"
                          ? "/msg-dblcheck.svg"
                          : "/msg-black-dblcheck.svg"
                      }
                      alt="msg-dblcheck"
                    />
                    <p>{formatSeenAt(message.seenBy[0].seenAt)}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {typeFile && (
                  <ContextMenuItem onClick={downloadFile}>
                    <ArrowDownToLine size={20} className="text-gray-700 mr-3" />
                    Download
                  </ContextMenuItem>
                )}
                {!typeFile && (
                  <ContextMenuItem onClick={copyToClipboard}>
                    <Copy size={20} className="text-gray-700 mr-3" />
                    Copy Text
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
