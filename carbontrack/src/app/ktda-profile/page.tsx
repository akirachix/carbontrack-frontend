import SidebarLayout from "@/app/components/SideBarLayout";
import ProfileDisplay from "@/app/components/SharedProfile";

const KtdaProfilePage = () => {
  return (
    <SidebarLayout>
      <ProfileDisplay />
    </SidebarLayout>
  );
};

KtdaProfilePage.displayName = "KtdaProfilePage";

export default KtdaProfilePage;