"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IConversation } from "@/types/types";
import {
  EllipsisVertical,
  Eraser,
  Info,
  LogOut,
  SlidersHorizontal,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import ClearHistoryModal from "../clearHistoryModal/clearHistoryModal";
import DeleteChatModal from "../DeleteChatModal/DeleteChatModal";
import GroupInfoModal from "../groupInfoModal/GroupInfoModal";
import LeaveUserModal from "../leaveUserModal/LeaveUserModal";
import ManageGroupModal from "../manageGroupModal/ManageGroupModal";

type Props = {
  isAdmin: boolean;
  conversation: IConversation;
};

const ChatOptionsDropdown = ({ isAdmin, conversation }: Props) => {
  const [isClearHistoryModalOpen, setClearHistoryModalOpen] = useState(false);
  const [isDeleteChatModal, setDeleteChatModal] = useState(false);
  const [isLeaveUserModal, setLeaveUserModal] = useState(false);
  const [isGroupInfoModal, setGroupInfoModal] = useState(false);
  const [isManageGroupModal, setManageGroupModal] = useState(false);

  useEffect(() => {
    setManageGroupModal(false);
    setDeleteChatModal(false);
    setClearHistoryModalOpen(false);
  }, [isAdmin]);

  return (
    <>
      {isManageGroupModal && (
        <ManageGroupModal
          conversation={conversation}
          isOpen={isManageGroupModal}
          onClose={() => setManageGroupModal(false)}
        />
      )}
      {isGroupInfoModal && (
        <GroupInfoModal
          conversation={conversation}
          isOpen={isGroupInfoModal}
          onClose={() => setGroupInfoModal(false)}
        />
      )}
      {isClearHistoryModalOpen && (
        <ClearHistoryModal
          conversationId={conversation._id}
          participantName={conversation.otherUser?.name}
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
          participantName={conversation.otherUser?.name.trim()}
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="text-gray-400 hover:text-primary duration-300 cursor-pointer" />
        </DropdownMenuTrigger>
        {conversation.isGroup ? (
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setGroupInfoModal(true)}>
              <Info />
              View group info
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem onClick={() => setManageGroupModal(true)}>
                <SlidersHorizontal />
                Manage group
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem onClick={() => setClearHistoryModalOpen(true)}>
                <Eraser />
                Сlear history
              </DropdownMenuItem>
            )}
            {isAdmin ? (
              <DropdownMenuItem onClick={() => setDeleteChatModal(true)}>
                <Trash />
                Delete group
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setLeaveUserModal(true)}>
                <LogOut />
                Leave group
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setClearHistoryModalOpen(true)}>
              <Eraser />
              Сlear history
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteChatModal(true)}>
              <Trash />
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
};

export default ChatOptionsDropdown;
