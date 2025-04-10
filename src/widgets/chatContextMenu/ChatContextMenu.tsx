"use client";

import { IConversation } from "@/components/types/types";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Eraser, LogOut, Trash } from "lucide-react";
import { useState } from "react";
import ClearHistoryModal from "../clearHistoryModal/clearHistoryModal";
import DeleteChatModal from "../DeleteChatModal/DeleteChatModal";
import LeaveUserModal from "../leaveUserModal/LeaveUserModal";

type Props = {
  isAdmin: boolean;
  conversation: IConversation;
};

const ChatContextMenu = ({ isAdmin, conversation }: Props) => {
  const [isClearHistoryModalOpen, setClearHistoryModalOpen] = useState(false);
  const [isDeleteChatModal, setDeleteChatModal] = useState(false);
  const [isLeaveUserModal, setLeaveUserModal] = useState(false);

  return (
    <>
      {isClearHistoryModalOpen && (
        <ClearHistoryModal
          conversationId={conversation._id}
          participantName={conversation.participantName}
          groupName={conversation.groupName}
          isGroup={conversation.isGroup}
          isOpen={isClearHistoryModalOpen}
          onClose={() => setClearHistoryModalOpen(false)}
        />
      )}
      {isDeleteChatModal && (
        <DeleteChatModal
          conversationId={conversation._id}
          groupImage={conversation.groupImage}
          participantImage={conversation.otherUser?.image}
          participantName={conversation.participantName?.trim()}
          groupName={conversation.groupName}
          isGroup={conversation.isGroup}
          isOpen={isDeleteChatModal}
          onClose={() => setDeleteChatModal(false)}
        />
      )}
      {isLeaveUserModal && (
        <LeaveUserModal
          conversationId={conversation._id}
          groupImage={conversation.groupImage}
          groupName={conversation.groupName}
          isOpen={isLeaveUserModal}
          onClose={() => setLeaveUserModal(false)}
        />
      )}
      {conversation.isGroup ? (
        <ContextMenuContent>
          {isAdmin && (
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setClearHistoryModalOpen(true);
              }}
            >
              <Eraser size={15} className="text-gray-700 mr-3" />
              Сlear history
            </ContextMenuItem>
          )}
          {isAdmin && (
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setDeleteChatModal(true);
              }}
            >
              <Trash size={15} className="text-gray-700 mr-3" />
              Delete group
            </ContextMenuItem>
          )}
          {!isAdmin && (
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setLeaveUserModal(true);
              }}
            >
              <LogOut size={15} className="text-gray-700 mr-3" />
              Leave group
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      ) : (
        <ContextMenuContent>
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setClearHistoryModalOpen(true);
            }}
          >
            <Eraser size={15} className="text-gray-700 mr-3" />
            Сlear history
          </ContextMenuItem>
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDeleteChatModal(true);
            }}
          >
            <Trash size={15} className="text-gray-700 mr-3" />
            Delete chat
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </>
  );
};

export default ChatContextMenu;
