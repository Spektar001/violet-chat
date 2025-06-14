"use client";

import { IUser } from "@/types/types";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

type Props = {
  currentUser: IUser;
  groupOwner: Id<"users">;
};

const GroupFeatures = ({ currentUser, groupOwner }: Props) => {
  const isOwner = currentUser._id === groupOwner;
  const userOwner = useQuery(api.users.getOtherUser, {
    otherUserId: groupOwner,
  });

  return (
    <div className="w-72 flex flex-col p-4 text-center text-white bg-violet-400/50 dark:bg-white/10 rounded-2xl">
      <p className="text-center mb-3">
        {isOwner ? "You" : userOwner?.name} created a group
      </p>
      <p className="text-left mb-2">Groups can have:</p>
      <ul className="space-y-1">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
          Infinite number of members
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
          Persistent chat history
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
          Admins with different rights
        </li>
      </ul>
    </div>
  );
};

export default GroupFeatures;
