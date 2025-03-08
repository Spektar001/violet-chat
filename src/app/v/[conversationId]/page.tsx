import RightPanel from "@/components/rightPanel/RightPanel";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  params: { conversationId: Id<"conversations"> };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  return <RightPanel conversationId={conversationId} />;
};

export default ConversationPage;
