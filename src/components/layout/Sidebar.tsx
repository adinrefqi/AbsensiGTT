"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCog,
  ClipboardCheck,
  History,
  FileSpreadsheet,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/supabase/auth";
import { toast } from "sonner";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/admin/guru", label: "Kelola Guru", icon: <Users className="h-5 w-5" /> },
  { href: "/admin/sekolah", label: "Kelola Sekolah", icon: <Building2 className="h-5 w-5" /> },
  { href: "/admin/user", label: "Kelola User", icon: <UserCog className="h-5 w-5" /> },
];

const guruNav: NavItem[] = [
  { href: "/guru", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/guru/absensi", label: "Absensi", icon: <ClipboardCheck className="h-5 w-5" /> },
  { href: "/guru/riwayat", label: "Riwayat", icon: <History className="h-5 w-5" /> },
];

const managerNav: NavItem[] = [
  { href: "/manager", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/manager/absensi", label: "Absensi", icon: <ClipboardCheck className="h-5 w-5" /> },
  { href: "/manager/laporan", label: "Laporan", icon: <FileSpreadsheet className="h-5 w-5" /> },
];

interface SidebarProps {
  role: "ADMIN" | "GURU" | "MANAGER";
  userName?: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();

  const navItems =
    role === "ADMIN" ? adminNav : role === "GURU" ? guruNav : managerNav;

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil logout");
    window.location.href = "/login";
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="p-2 bg-primary rounded-lg">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-sidebar-foreground">Absensi GTT</h2>
          <p className="text-xs text-sidebar-foreground/60 capitalize">{role.toLowerCase()}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {userName || "User"}
          </p>
          <p className="text-xs text-sidebar-foreground/60">{role}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon" className="h-10 w-10 lg:hidden" />
          }
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
