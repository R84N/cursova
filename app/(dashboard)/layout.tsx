//Лейаут сторінки з дошками

//Імпорт необхідних елементів

import Navbar from "./_components/navbar";
import OrgSidebar from "./_components/org-sidebar";
import Sidebar from "./_components/sidebar";


//Типізація для пропсів
interface DashboardLayoutProps {
  children: React.ReactNode;
}


const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full flex">
      <Sidebar />
      <OrgSidebar />
      <div className="pl-3 w-full">
        <Navbar />
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
