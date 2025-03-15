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

type Props = {
  isGroup: boolean;
  isAdmin: boolean;
};

const ChatOptionsDropdown = ({ isGroup, isAdmin }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="text-gray-400 hover:text-primary duration-300 cursor-pointer" />
      </DropdownMenuTrigger>
      {isGroup ? (
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
            <DropdownMenuItem>
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
          <DropdownMenuItem>
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
  );
};

export default ChatOptionsDropdown;
