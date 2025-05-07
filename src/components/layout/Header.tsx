
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Large Earthquake Prediction System</h1>
        </div>
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
