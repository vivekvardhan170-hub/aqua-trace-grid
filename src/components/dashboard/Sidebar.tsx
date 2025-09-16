import {
  BarChart3,
  FileText,
  CheckCircle,
  Coins,
  MapPin,
  Users,
  TrendingUp,
  Link,
  Settings as SettingsIcon,
  Waves,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/clerk-react";
import { useUserRole } from "@/contexts/UserRoleContext";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const allNavigation = [
  { id: "overview", name: "Overview", icon: BarChart3, roles: ["ngo", "nccr"] },
  { id: "reports", name: "Reports", icon: FileText, roles: ["ngo", "nccr"] },
  { id: "verification", name: "Verification", icon: CheckCircle, roles: ["nccr"] },
  { id: "carbon-credits", name: "Carbon Credits", icon: Coins, roles: ["ngo", "nccr"] },
  { id: "project-sites", name: "Project Sites", icon: MapPin, roles: ["nccr"] },
  { id: "communities", name: "Communities", icon: Users, roles: ["ngo", "nccr"] },
  { id: "analytics", name: "Analytics", icon: TrendingUp, roles: ["nccr"] },
  { id: "blockchain", name: "Blockchain", icon: Link, roles: ["nccr"] },
  { id: "settings", name: "Settings", icon: SettingsIcon, roles: ["ngo", "nccr"] },
];

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { signOut } = useClerk();
  const { userRole } = useUserRole();

  const handleLogout = () => {
    signOut();
    localStorage.removeItem('userRole');
  };

  // Filter navigation items based on user role
  const navigation = allNavigation.filter(item => 
    userRole && item.roles.includes(userRole)
  );
  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
          <Waves className="h-8 w-8 text-ocean-gradient" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Blue Carbon</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sidebar-foreground hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
          <div className="text-xs text-sidebar-foreground/60">
            NCCR Admin Dashboard v1.0
          </div>
        </div>
      </div>
    </div>
  );
};