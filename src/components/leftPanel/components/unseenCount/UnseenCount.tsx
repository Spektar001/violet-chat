import { Badge } from "@/components/ui/badge";
import { IMessage } from "@/types/types";

type Props = {
  unseenCount?: IMessage[];
};
const UnseenCount = ({ unseenCount }: Props) => {
  return (
    <Badge variant={"unseen"} className="dark:bg-[#707579]">
      {unseenCount?.length}
    </Badge>
  );
};

export default UnseenCount;
