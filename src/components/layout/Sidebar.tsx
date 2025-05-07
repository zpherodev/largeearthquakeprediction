
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Compass, Radar, Earth, Monitor, ArrowDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <Monitor className="w-5 h-5" />,
    path: "/"
  },
  {
    title: "Magnetic Data",
    icon: <Compass className="w-5 h-5" />,
    path: "/magnetic-data"
  },
  {
    title: "Predictions",
    icon: <Radar className="w-5 h-5" />,
    path: "/predictions"
  },
  {
    title: "Map View",
    icon: <Earth className="w-5 h-5" />,
    path: "/map"
  },
  {
    title: "About",
    icon: <Info className="w-5 h-5" />,
    path: "/about"
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={cn("flex items-center", collapsed ? "hidden" : "")}>
          <Earth className="h-6 w-6 text-sidebar-primary mr-2" />
          <h1 className="text-sidebar-foreground font-bold text-lg">QuakeWatch</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ArrowDown className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-90" : "-rotate-90")} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary-foreground transition-colors"
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <div className={cn("rounded-md bg-sidebar-accent p-3", collapsed ? "items-center justify-center" : "")}>
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-slow"></div>
            {!collapsed && <span className="text-xs text-sidebar-foreground">System Active</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
