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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/dashboard/admin/guru", label: "Kelola Guru", icon: <Users className="h-5 w-5" /> },
  { href: "/dashboard/admin/sekolah", label: "Kelola Sekolah", icon: <Building2 className="h-5 w-5" /> },
  { href: "/dashboard/admin/user", label: "Kelola User", icon: <UserCog className="h-5 w-5" /> },
];

const guruNav: NavItem[] = [
  { href: "/dashboard/guru", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/dashboard/guru/absensi", label: "Absensi", icon: <ClipboardCheck className="h-5 w-5" /> },
  { href: "/dashboard/guru/riwayat", label: "Riwayat", icon: <History className="h-5 w-5" /> },
];

const managerNav: NavItem[] = [
  { href: "/dashboard/manager", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/dashboard/manager/absensi", label: "Absensi", icon: <ClipboardCheck className="h-5 w-5" /> },
  { href: "/dashboard/manager/laporan", label: "Laporan", icon: <FileSpreadsheet className="h-5 w-5" /> },
];

const roleConfig = {
  ADMIN: { label: "Admin", color: "bg-red-500/10 text-red-600" },
  GURU: { label: "Guru", color: "bg-blue-500/10 text-blue-600" },
  MANAGER: { label: "Manager", color: "bg-green-500/10 text-green-600" },
};

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
        <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sidebar-foreground truncate">Absensi GTT</h2>
          <Badge className={cn("text-[10px] px-1.5 py-0 font-medium mt-1", roleConfig[role].color)}>
            {roleConfig[role].label}
          </Badge>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5"
              )}
            >
              <span className={cn(isActive && "drop-shadow-sm")}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2 bg-sidebar-accent/30 rounded-lg">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {userName || "User"}
          </p>
          <p className="text-xs text-sidebar-foreground/50 capitalize">{role.toLowerCase()}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar shadow-xl">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background/95 backdrop-blur-md border-b flex items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 ml-3">
          <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold">Absensi GTT</span>
        </div>
      </div>

      {/* Mobile padding */}
      <div className="lg:hidden h-16" />
    </>
  );
}
