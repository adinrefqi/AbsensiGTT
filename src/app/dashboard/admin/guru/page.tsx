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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import type { Profile, School } from "@/types";

interface TeacherWithProfile extends Profile {
  subjects?: string[];
  schools?: string[];
}

export default function KelolaGuruPage() {
  const supabase = createClient();
  const [teachers, setTeachers] = useState<TeacherWithProfile[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherWithProfile | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    phone: "",
    subjects: "",
    school_ids: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data: teachersData } = await supabase
      .from("teachers")
      .select(`
        *,
        profile:profiles(*),
        teacher_schools(school_id)
      `);

    if (teachersData) {
      const teachersWithProfile = teachersData.map((t: any) => ({
        ...t.profile,
        subjects: t.subjects || [],
        schools: t.teacher_schools?.map((ts: any) => ts.school_id) || [],
      }));
      setTeachers(teachersWithProfile);
    }
    setLoading(false);
  };

  const fetchSchools = async () => {
    const { data } = await supabase.from("schools").select("*").order("name");
    if (data) setSchools(data);
  };

  useEffect(() => {
    fetchTeachers();
    fetchSchools();
  }, []);

  const openCreateDialog = () => {
    setSelectedTeacher(null);
    setFormData({
      email: "",
      full_name: "",
      password: "",
      phone: "",
      subjects: "",
      school_ids: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (teacher: TeacherWithProfile) => {
    setSelectedTeacher(teacher);
    setFormData({
      email: teacher.email,
      full_name: teacher.full_name,
      password: "",
      phone: teacher.phone || "",
      subjects: teacher.subjects?.join(", ") || "",
      school_ids: teacher.schools || [],
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (teacher: TeacherWithProfile) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (selectedTeacher) {
        // Update existing teacher
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            phone: formData.phone || null,
          })
          .eq("id", selectedTeacher.id);

        if (profileError) throw profileError;

        const subjects = formData.subjects.split(",").map((s) => s.trim()).filter(Boolean);

        const { error: teacherError } = await supabase
          .from("teachers")
          .update({ subjects })
          .eq("user_id", selectedTeacher.id);

        if (teacherError) throw teacherError;

        // Update school assignments
        await supabase
          .from("teacher_schools")
          .delete()
          .eq("teacher_id", selectedTeacher.id);

        for (const school_id of formData.school_ids) {
          await supabase.from("teacher_schools").insert({
            teacher_id: selectedTeacher.id,
            school_id,
          });
        }

        toast.success("Data guru berhasil diperbarui");
      } else {
        // Create new teacher
        if (!formData.email || !formData.password || !formData.full_name) {
          toast.error("Email, password, dan nama wajib diisi");
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.full_name, role: "GURU", phone: formData.phone },
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Gagal membuat user");

        const userId = authData.user.id;

        await supabase.from("profiles").insert({
          id: userId,
          email: formData.email,
          full_name: formData.full_name,
          role: "GURU",
          phone: formData.phone || null,
        });

        const subjects = formData.subjects.split(",").map((s) => s.trim()).filter(Boolean);

        const { error: teacherError } = await supabase.from("teachers").insert({
          user_id: userId,
          subjects,
        });

        if (teacherError) throw teacherError;

        for (const school_id of formData.school_ids) {
          await supabase.from("teacher_schools").insert({
            teacher_id: userId,
            school_id,
          });
        }

        toast.success("Guru baru berhasil ditambahkan");
      }

      setDialogOpen(false);
      fetchTeachers();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    setSubmitting(true);
    try {
      // Delete teacher record
      await supabase.from("teachers").delete().eq("user_id", selectedTeacher.id);

      // Delete profile (this will cascade to auth if configured)
      await supabase.from("profiles").delete().eq("id", selectedTeacher.id);

      toast.success("Guru berhasil dihapus");
      setDeleteDialogOpen(false);
      fetchTeachers();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header title="Kelola Guru" description="Tambah, edit, dan hapus data guru" />

      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Guru
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
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada data guru</p>
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher, index) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{teacher.full_name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects?.map((subject) => (
                          <Badge key={subject} variant="secondary">{subject}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(teacher)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(teacher)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTeacher ? "Edit Guru" : "Tambah Guru Baru"}
            </DialogTitle>
            <DialogDescription>
              {selectedTeacher
                ? "Perbarui data guru di bawah ini"
                : "Isi data guru baru di bawah ini"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!selectedTeacher && (
              <>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="guru@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label>No. Telepon</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Mata Pelajaran</Label>
              <Input
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="Matematika, Bahasa Inggris (pisahkan dengan koma)"
              />
            </div>
            <div className="space-y-2">
              <Label>Sekolah</Label>
              <Select
                value={formData.school_ids[0] || ""}
                onValueChange={(value) => value && setFormData({ ...formData, school_ids: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sekolah" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Menyimpan..." : selectedTeacher ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Guru</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus guru "{selectedTeacher?.full_name}"? Tindakan ini
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
