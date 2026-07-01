// User roles
export type UserRole = "ADMIN" | "GURU" | "MANAGER";

// Attendance status
export type AttendanceStatus = "HADIR" | "TIDAK_HADIR" | "BELUM_CLOCK_OUT";

// Profile (extends Supabase auth.users)
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// School
export interface School {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius_meter: number;
  created_at: string;
  updated_at: string;
}

// Teacher
export interface Teacher {
  id: string;
  user_id: string;
  subjects: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: Profile;
  schools?: School[];
}

// Manager
export interface Manager {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: Profile;
  schools?: School[];
}

// Teacher-School relationship (many-to-many)
export interface TeacherSchool {
  id: string;
  teacher_id: string;
  school_id: string;
  created_at: string;
}

// Manager-School relationship (many-to-many)
export interface ManagerSchool {
  id: string;
  manager_id: string;
  school_id: string;
  created_at: string;
}

// Attendance record
export interface Attendance {
  id: string;
  teacher_id: string;
  school_id: string;
  clock_in: string;
  clock_out?: string;
  clock_in_lat: number;
  clock_in_lng: number;
  clock_out_lat?: number;
  clock_out_lng?: number;
  clock_in_photo_url?: string;
  clock_out_photo_url?: string;
  notes?: string;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
  // Joined data
  teacher?: Teacher;
  school?: School;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalGuru: number;
  totalSekolah: number;
  totalUser: number;
  todayAttendance: number;
  presentRate: number;
}

// Attendance form data
export interface AttendanceFormData {
  school_id: string;
  lat: number;
  lng: number;
  photo?: File;
  notes?: string;
}

// Login form
export interface LoginFormData {
  email: string;
  password: string;
}

// Register form
export interface RegisterFormData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

// School form
export interface SchoolFormData {
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius_meter: number;
}

// Teacher form
export interface TeacherFormData {
  user_id: string;
  subjects: string[];
  school_ids: string[];
}

// User form (for admin)
export interface UserFormData {
  email: string;
  password?: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}
