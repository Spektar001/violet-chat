import { formatDate, isSameDay } from "@/lib/utils";
import { IMessage } from "@/types/types";

type DateIndicatorProps = {
  message: IMessage;
  previousMessage?: IMessage;
};

const DateIndicator = ({ message, previousMessage }: DateIndicatorProps) => {
  return (
    <>
      {!previousMessage ||
      !isSameDay(previousMessage._creationTime, message._creationTime) ? (
        <div className="flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 p-1 rounded-md bg-white/70 dark:bg-white/10">
            {formatDate(message._creationTime)}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default DateIndicator;
