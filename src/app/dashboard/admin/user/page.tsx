"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import type { Profile, UserRole } from "@/types";

export default function KelolaUserPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "" as UserRole | "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setUsers(data);
    if (error) toast.error(error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateDialog = () => {
    setSelectedUser(null);
    setFormData({ email: "", full_name: "", password: "", role: "", phone: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (user: Profile) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || "",
      full_name: user.full_name,
      password: "",
      role: user.role,
      phone: user.phone || "",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (user: Profile) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return "default";
      case "GURU": return "secondary";
      case "MANAGER": return "outline";
      default: return "secondary";
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.full_name || !formData.role) {
      toast.error("Email, nama, dan role wajib diisi");
      return;
    }
    if (!selectedUser && !formData.password) {
      toast.error("Password wajib diisi untuk user baru");
      return;
    }

    setSubmitting(true);
    try {
      if (selectedUser) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: formData.full_name, role: formData.role, phone: formData.phone || null })
          .eq("id", selectedUser.id);
        if (profileError) throw profileError;
        toast.success("User berhasil diperbarui");
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.full_name, role: formData.role, phone: formData.phone } },
        });
        if (authError) throw authError;
        if (!authData.user) throw new Error("Gagal membuat user");

        await supabase.from("profiles").insert({
          id: authData.user.id,
          full_name: formData.full_name,
          role: formData.role,
          phone: formData.phone || null,
        });
        toast.success("User baru berhasil ditambahkan");
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", selectedUser.id);
      if (error) throw error;
      toast.success("User berhasil dihapus");
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header title="Kelola User" description="Tambah, edit, dan hapus user sistem" />
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog}><Plus className="h-4 w-4 mr-2" />Tambah User</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <UserCog className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada data user</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell><Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge></TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User" : "Tambah User Baru"}</DialogTitle>
            <DialogDescription>{selectedUser ? "Perbarui data user di bawah ini" : "Isi data user baru di bawah ini"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!selectedUser && (
              <>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="user@email.com" /></div>
                <div className="space-y-2"><Label>Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Minimal 6 karakter" /></div>
              </>
            )}
            <div className="space-y-2"><Label>Nama Lengkap</Label><Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="Nama lengkap" /></div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })} className="h-11">
                <option value="">Pilih role</option>
                <option value="ADMIN">Admin</option>
                <option value="GURU">Guru (GTT)</option>
                <option value="MANAGER">Manager / Kepala Sekolah</option>
              </Select>
            </div>
            <div className="space-y-2"><Label>No. Telepon</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="08xxxxxxxxxx" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? "Menyimpan..." : selectedUser ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus user "{selectedUser?.full_name}"? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>{submitting ? "Menghapus..." : "Hapus"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
