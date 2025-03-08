import LeftPanel from "@/components/leftPanel/LeftPanel";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="h-screen w-full overflow-hidden flex">
      <LeftPanel />
      {children}
    </main>
  );
};

export default Layout;
