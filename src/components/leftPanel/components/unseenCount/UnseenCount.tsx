import { IMessage } from "@/components/types/types";
import { Badge } from "@/components/ui/badge";

type Props = {
  unseenCount?: IMessage[];
};
const UnseenCount = ({ unseenCount }: Props) => {
  return <Badge variant={"unseen"}>{unseenCount?.length}</Badge>;
};

export default UnseenCount;
