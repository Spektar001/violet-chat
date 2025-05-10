"use client";

import Picker from "@emoji-mart/react";
import { Laugh } from "lucide-react";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  setMsgText: Dispatch<SetStateAction<string>>;
};

const EmojiPickerButton = ({ setMsgText }: Props) => {
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleEmoji = (e: { native: string }) => {
    setMsgText((prev) => prev + e.native);
  };
  const handleClickOutside = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <>
      <Laugh
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer"
      />
      <div
        className={`absolute z-50 left-4 bottom-20 ${open ? "block" : "hidden"}`}
      >
        <Picker
          theme={resolvedTheme}
          previewPosition="none"
          emojiSize={30}
          onClickOutside={handleClickOutside}
          set="apple"
          onEmojiSelect={handleEmoji}
        />
      </div>
    </>
  );
};

export default EmojiPickerButton;
