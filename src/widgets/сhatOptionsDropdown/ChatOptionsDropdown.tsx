"use client";

import { IConversation } from "@/components/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  Eraser,
  Info,
  LogOut,
  SlidersHorizontal,
  Trash,
} from "lucide-react";
import { useState } from "react";
import ClearHistoryModal from "../clearHistoryModal/clearHistoryModal";

type Props = {
  isAdmin: boolean;
  conversation: IConversation;
};

const ChatOptionsDropdown = ({ isAdmin, conversation }: Props) => {
  const [isClearHistoryModalOpen, setClearHistoryModalOpen] = useState(false);

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="text-gray-400 hover:text-primary duration-300 cursor-pointer" />
        </DropdownMenuTrigger>
        {conversation.isGroup ? (
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Info />
              View group info
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem>
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
              <DropdownMenuItem>
                <Trash />
                Delete and leave
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
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
            <DropdownMenuItem>
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
