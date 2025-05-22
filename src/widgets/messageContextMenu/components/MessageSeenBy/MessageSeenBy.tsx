"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatSeenAt } from "@/lib/utils";
import { IUser } from "@/types/types";
import { useTheme } from "next-themes";
import Image from "next/image";

type MessageSeenByProps = {
  seenUsers: IUser[];
  seenByMap: Map<string, number>;
};

const MessageSeenBy = ({ seenUsers, seenByMap }: MessageSeenByProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="text-sm mt-1 px-3 py-1.5 border-t cursor-default">
        {seenUsers.length === 1 ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="flex gap-2 items-center text-sm">
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
                {seenUsers[0]?.name}
                <Avatar className="overflow-visible relative w-6 h-6">
                  <AvatarImage
                    src={seenUsers[0]?.image || "/placeholder.png"}
                    className="object-cover rounded-full"
                  />
                </Avatar>
              </TooltipTrigger>
              <TooltipContent
                align="start"
                side="left"
                sideOffset={16}
                className="text-sm text-gray-400"
              >
                {formatSeenAt(seenByMap.get(seenUsers[0]._id)!)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2">
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
                <p className="flex items-center gap-2">
                  {seenUsers.length} Seen
                </p>
              </TooltipTrigger>
              <TooltipContent align="start" side="left" sideOffset={16}>
                <ul className="max-h-[350px] overflow-y-auto">
                  {seenUsers.map((user) => {
                    const seenAt = seenByMap.get(user!._id);
                    return (
                      <li
                        key={user?._id}
                        className="flex items-center gap-2 p-1 rounded-md duration-300 hover:bg-violet-100 dark:hover:bg-white/10"
                      >
                        <Avatar className="overflow-visible relative w-8 h-8">
                          <AvatarImage
                            src={user?.image || "/placeholder.png"}
                            className="object-cover rounded-full"
                          />
                          <AvatarFallback>
                            <div className="animate-pulse bg-gray-tertiary w-8 h-8 rounded-full"></div>
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{user?.name}</p>
                          <div className="flex gap-1">
                            <Image
                              width={14}
                              height={11}
                              src="/msg-gray-dblcheck.svg"
                              alt="msg-gray-dblcheck"
                            />
                            <p className="text-xs text-gray-400">
                              {formatSeenAt(seenAt!)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </>
  );
};

export default MessageSeenBy;
