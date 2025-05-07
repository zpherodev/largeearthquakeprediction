
import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
