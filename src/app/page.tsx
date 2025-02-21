import LeftPanel from "@/components/leftPanel/LeftPanel";
import RightPanel from "@/components/rightPanel/RightPanel";

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden flex">
      <LeftPanel />
      <RightPanel />
    </main>
  );
}
