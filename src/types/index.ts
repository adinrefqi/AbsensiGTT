// User roles
export type UserRole = "ADMIN" | "GURU" | "MANAGER";

// Attendance status
export type AttendanceStatus = "HADIR" | "IZIN" | "SAKIT" | "ALFA";

// Profile (extends Supabase auth.users)
export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// School
export interface School {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  principal_name?: string;
  created_at: string;
  updated_at: string;
}

// Teacher
export interface Teacher {
  id: string;
  user_id?: string;
  school_id?: string;
  nip?: string;
  full_name: string;
  email?: string;
  phone?: string;
  subject?: string;
  created_at: string;
  updated_at: string;
}

// Attendance record
export interface Attendance {
  id: string;
  teacher_id: string;
  date: string;
  status: AttendanceStatus;
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
