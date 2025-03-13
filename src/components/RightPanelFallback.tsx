import { Skeleton } from "./ui/skeleton";

const RightPanelFallback = () => {
  return (
    <div className="w-3/4 h-full flex flex-col">
      <div className="py-3 px-5 flex justify-between items-center border-b">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full animate-pulse duration-700" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-16 h-2 rounded-full animate-pulse duration-700" />
            <Skeleton className="w-10 h-2 rounded-full animate-pulse duration-700" />
          </div>
        </div>
      </div>
      <div className="py-3 px-5 flex-1 w-full flex flex-col gap-3 overflow-y-scroll no-scrollbar bg-chat-tile-light dark:bg-chat-tile-dark">
        <div className="flex flex-col max-w-full h-full">
          <div className="flex gap-1 items-start mb-3">
            <div
              className={
                "flex flex-col gap-3 max-w-[70%] min-w-[10%] p-3 rounded-e-2xl rounded-bl-2xl shadow-md text-wrap bg-white"
              }
            >
              <Skeleton className="w-16 h-2 rounded-full animate-pulse duration-700" />
              <Skeleton className="w-10 h-2 rounded-full animate-pulse duration-700" />
              <div className="flex items-end justify-end">
                <Skeleton className="w-10 h-2 rounded-full animate-pulse duration-700" />
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end mb-3 w-full">
            <div
              className={
                "max-w-[70%] min-w-[10%] flex flex-col gap-3 p-3 rounded-s-2xl rounded-tr-2xl shadow-md bg-white"
              }
            >
              <Skeleton className="w-32 h-2 rounded-full animate-pulse duration-700" />
              <Skeleton className="w-16 h-2 rounded-full animate-pulse duration-700" />
              <Skeleton className="w-10 h-2 rounded-full animate-pulse duration-700" />
              <div className="flex gap-3 items-center justify-end">
                <Skeleton className="w-10 h-2 rounded-full animate-pulse duration-700" />
              </div>
            </div>
          </div>
          <div className="flex gap-1 items-start mb-3">
            <div
              className={
                "flex flex-col gap-3 max-w-[70%] min-w-[10%] p-3 rounded-e-2xl rounded-bl-2xl shadow-md text-wrap bg-white"
              }
            >
              <Skeleton className="w-40 h-2 rounded-full animate-pulse duration-700" />
              <Skeleton className="w-56 h-2 rounded-full animate-pulse duration-700" />
              <Skeleton className="w-20 h-2 rounded-full animate-pulse duration-700" />
              <Skeleton className="w-24 h-2 rounded-full animate-pulse duration-700" />
              <div className="flex items-end justify-end">
                <Skeleton className="w-10 h-2  rounded-full animate-pulse duration-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-3 px-5 border-t flex gap-3">
        <div className="flex items-end gap-3 mb-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
        <form className="w-full flex gap-3">
          <div className="space-y-2 h-full w-full">
            <Skeleton className="min-h-full w-full resize-none border-0 outline-0 p-1.5" />
          </div>
          <div className="self-end">
            <Skeleton className="w-12 h-10 rounded-md" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RightPanelFallback;
