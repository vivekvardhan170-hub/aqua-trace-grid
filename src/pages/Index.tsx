import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Overview } from "@/components/dashboard/Overview";
import { Reports } from "@/components/dashboard/Reports";
import { Verification } from "@/components/dashboard/Verification";
import { CarbonCredits } from "@/components/dashboard/CarbonCredits";
import { ProjectSites } from "@/components/dashboard/ProjectSites";
import { Communities } from "@/components/dashboard/Communities";
import { Analytics } from "@/components/dashboard/Analytics";
import { Blockchain } from "@/components/dashboard/Blockchain";
import { Settings } from "@/components/dashboard/Settings";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "reports":
        return <Reports />;
      case "verification":
        return <Verification />;
      case "carbon-credits":
        return <CarbonCredits />;
      case "project-sites":
        return <ProjectSites />;
      case "communities":
        return <Communities />;
      case "analytics":
        return <Analytics />;
      case "blockchain":
        return <Blockchain />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 lg:ml-64">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;
