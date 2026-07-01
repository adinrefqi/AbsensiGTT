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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { School } from "@/types";

export default function KelolaSekolahPage() {
  const supabase = createClient();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
    radius_meter: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSchools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .order("name");

    if (data) setSchools(data);
    if (error) toast.error(error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const openCreateDialog = () => {
    setSelectedSchool(null);
    setFormData({
      name: "",
      address: "",
      lat: "",
      lng: "",
      radius_meter: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (school: School) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      lat: school.lat.toString(),
      lng: school.lng.toString(),
      radius_meter: school.radius_meter.toString(),
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (school: School) => {
    setSelectedSchool(school);
    setDeleteDialogOpen(true);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung browser ini");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        });
        toast.success("Lokasi berhasil dideteksi");
      },
      (error) => {
        toast.error("Gagal mendapatkan lokasi: " + error.message);
      }
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address) {
      toast.error("Nama dan alamat wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const schoolData = {
        name: formData.name,
        address: formData.address,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
        radius_meter: parseInt(formData.radius_meter) || 100,
      };

      if (selectedSchool) {
        const { error } = await supabase
          .from("schools")
          .update(schoolData)
          .eq("id", selectedSchool.id);

        if (error) throw error;
        toast.success("Sekolah berhasil diperbarui");
      } else {
        const { error } = await supabase.from("schools").insert(schoolData);

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
      const { error } = await supabase
        .from("schools")
        .delete()
        .eq("id", selectedSchool.id);

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
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Sekolah
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Sekolah</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Koordinat</TableHead>
                <TableHead>Radius</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada data sekolah</p>
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school, index) => (
                  <TableRow key={school.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{school.address}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {school.lat.toFixed(4)}, {school.lng.toFixed(4)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{school.radius_meter}m</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(school)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(school)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSchool ? "Edit Sekolah" : "Tambah Sekolah Baru"}
            </DialogTitle>
            <DialogDescription>
              {selectedSchool
                ? "Perbarui data sekolah di bawah ini"
                : "Isi data sekolah baru di bawah ini"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Sekolah</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="SD Negeri 1 Harapan"
              />
            </div>
            <div className="space-y-2">
              <Label>Alamat</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Merdeka No. 1, Jakarta"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Koordinat GPS</Label>
                <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation}>
                  <MapPin className="h-4 w-4 mr-1" />
                  Deteksi
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  placeholder="Latitude"
                />
                <Input
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  placeholder="Longitude"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Koordinat digunakan untuk validasi lokasi absensi guru
              </p>
            </div>
            <div className="space-y-2">
              <Label>Radius Validasi (meter)</Label>
              <Input
                type="number"
                value={formData.radius_meter}
                onChange={(e) => setFormData({ ...formData, radius_meter: e.target.value })}
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground">
                Jarak maksimal dari koordinat sekolah untuk validasi absensi (default: 100m)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Menyimpan..." : selectedSchool ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Sekolah</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus sekolah "{selectedSchool?.name}"? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
