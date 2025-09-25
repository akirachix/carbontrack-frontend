
import FactorySidebar from "../../sharedComponents/FactorySidebar";

export default function FactoryLayout({
  children,
}: { children: React.ReactNode }) {
  return (
        <div className="flex">
          <FactorySidebar/>
          <main className="flex-grow">
            {children}
          </main>
        </div>
      
    
  );
}