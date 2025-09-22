import Sidebar from "../../sharedComponents/KtdaSideBar";

export default function SidebarLayout({
  children,
}: { children: React.ReactNode }) {
  return (
        <div className="flex">
          <Sidebar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
  );
}
