import { Skeleton } from "./ui/skeleton";

const LeftPanelFallback = () => {
  return (
    <div className="h-full w-1/4 border-r">
      <div className="p-3 flex justify-between items-center border-b">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="w-10 h-10 rounded-md" />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1 h-[calc(100%-4rem)] scroll-smooth overflow-auto">
        <Skeleton className="flex gap-2 items-center p-3 rounded-2xl">
          <Skeleton className="w-10 h-10 rounded-full bg-white" />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-2 bg-white rounded-full" />
              <Skeleton className="w-8 h-2 bg-white rounded-full" />
            </div>
            <Skeleton className="mt-1 w-16 h-2 bg-white rounded-full" />
          </div>
        </Skeleton>
        <Skeleton className="flex gap-2 items-center p-3 rounded-2xl">
          <Skeleton className="w-10 h-10 rounded-full bg-white" />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-2 bg-white rounded-full" />
              <Skeleton className="w-8 h-2 bg-white rounded-full" />
            </div>
            <Skeleton className="mt-1 w-32 h-2 bg-white rounded-full" />
          </div>
        </Skeleton>
        <Skeleton className="flex gap-2 items-center p-3 rounded-2xl">
          <Skeleton className="w-10 h-10 rounded-full bg-white" />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-2 bg-white rounded-full" />
              <Skeleton className="w-8 h-2 bg-white rounded-full" />
            </div>
            <Skeleton className="mt-1 w-20 h-2 bg-white rounded-full" />
          </div>
        </Skeleton>
      </div>
    </div>
  );
};

export default LeftPanelFallback;
