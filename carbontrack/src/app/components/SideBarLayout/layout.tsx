import Sidebar from "../../sharedComponents/KtdaSideBar";

export default function SidebarLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
