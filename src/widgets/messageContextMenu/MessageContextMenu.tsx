"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ArrowDownToLine, Copy, Trash } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  isGroup: boolean;
  isAdmin: boolean;
  isMyMessage: boolean;
  messageId: Id<"messages">;
  messageType: string;
};

const MessageContextMenu = ({
  isGroup,
  isAdmin,
  isMyMessage,
  messageId,
  messageType,
}: Props) => {
  const typeImageOrVideo = messageType === "image" || messageType === "video";

  return (
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
                <ContextMenuItem>
                  <Copy size={20} className="text-gray-700 mr-3" />
                  Копировать текст
                </ContextMenuItem>
              )}
              <ContextMenuItem>
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
                <ContextMenuItem>
                  <Copy size={20} className="text-gray-700 mr-3" />
                  Копировать текст
                </ContextMenuItem>
              )}
              {isAdmin && (
                <ContextMenuItem>
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
                <ContextMenuItem>
                  <Copy size={20} className="text-gray-700 mr-3" />
                  Копировать текст
                </ContextMenuItem>
              )}
              <ContextMenuItem>
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
                <ContextMenuItem>
                  <Copy size={20} className="text-gray-700 mr-3" />
                  Копировать текст
                </ContextMenuItem>
              )}
            </>
          )}
        </>
      )}
    </ContextMenuContent>
  );
};

export default MessageContextMenu;
