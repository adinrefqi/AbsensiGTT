"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import type { School } from "@/types";

export default function KelolaSekolahPage() {
  const supabase = createClient();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchSchools = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("schools").select("*").order("name");
    if (data) setSchools(data);
    if (error) toast.error(error.message);
    setLoading(false);
  };

  useEffect(() => { fetchSchools(); }, []);

  const openCreateDialog = () => {
    setSelectedSchool(null);
    setFormData({ name: "", address: "", phone: "", email: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (school: School) => {
    setSelectedSchool(school);
    setFormData({ name: school.name, address: school.address || "", phone: school.phone || "", email: school.email || "" });
    setDialogOpen(true);
  };

  const openDeleteDialog = (school: School) => {
    setSelectedSchool(school);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Nama sekolah wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      if (selectedSchool) {
        const { error } = await supabase.from("schools").update({ name: formData.name, address: formData.address || null, phone: formData.phone || null, email: formData.email || null }).eq("id", selectedSchool.id);
        if (error) throw error;
        toast.success("Sekolah berhasil diperbarui");
      } else {
        const { error } = await supabase.from("schools").insert({ name: formData.name, address: formData.address || null, phone: formData.phone || null, email: formData.email || null });
        if (error) throw error;
        toast.success("Sekolah baru berhasil ditambahkan");
      }
      setDialogOpen(false);
      fetchSchools();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSchool) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("schools").delete().eq("id", selectedSchool.id);
      if (error) throw error;
      toast.success("Sekolah berhasil dihapus");
      setDeleteDialogOpen(false);
      fetchSchools();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header title="Kelola Sekolah" description="Tambah, edit, dan hapus data sekolah" />
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog}><Plus className="h-4 w-4 mr-2" />Tambah Sekolah</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Sekolah</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada data sekolah</p>
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school, index) => (
                  <TableRow key={school.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.address || "-"}</TableCell>
                    <TableCell><Badge variant="outline">{school.phone || "-"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(school)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(school)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSchool ? "Edit Sekolah" : "Tambah Sekolah Baru"}</DialogTitle>
            <DialogDescription>{selectedSchool ? "Perbarui data sekolah di bawah ini" : "Isi data sekolah baru di bawah ini"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nama Sekolah</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="SD Negeri 1 Harapan" /></div>
            <div className="space-y-2"><Label>Alamat</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Jl. Merdeka No. 1, Jakarta" /></div>
            <div className="space-y-2"><Label>Telepon</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="021-1234567" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="sekolah@email.com" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? "Menyimpan..." : selectedSchool ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Sekolah</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus sekolah "{selectedSchool?.name}"? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
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
