
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Compass, 
  Map as MapIcon, 
  BarChart3, 
  Info, 
  FileBarChart,
  Menu 
} from "lucide-react";
import { useMobileToggle } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const location = useLocation();
  const { mobileOpen, setMobileOpen } = useMobileToggle();
  
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { to: "/", icon: <Home className="w-5 h-5" />, text: "Dashboard" },
    { to: "/magnetic-data", icon: <Compass className="w-5 h-5" />, text: "Magnetic Data" },
    { to: "/predictions", icon: <BarChart3 className="w-5 h-5" />, text: "Predictions" },
    { to: "/map", icon: <MapIcon className="w-5 h-5" />, text: "Map" },
    { to: "/model-report", icon: <FileBarChart className="w-5 h-5" />, text: "Model Report" },
    { to: "/about", icon: <Info className="w-5 h-5" />, text: "About" },
  ];

  return (
    <div
      className={cn(
        "z-30 h-screen bg-gray-100 dark:bg-gray-950 border-r border-border w-[250px] transition-all duration-300 ease-in-out fixed md:relative left-0",
        mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold">Earthquake</h1>
            <p className="text-xs text-muted-foreground">Prediction System</p>
          </div>
          <div className="flex md:hidden ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>
      
      <nav className="space-y-1 p-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
              isActive(link.to)
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : "hover:bg-muted"
            )}
          >
            {link.icon}
            <span>{link.text}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-4 w-full px-4 text-center text-xs text-muted-foreground">
        <p>Magnetic Field Analysis</p>
        <p className="mt-1">© 2024 C.R. Kunferman</p>
      </div>
    </div>
  );
}
