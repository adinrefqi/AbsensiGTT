import { UserRole, AttendanceStatus } from "@/types";

// Database types (snake_case to match Supabase convention)
export interface DbProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSchool {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius_meter: number;
  created_at: string;
  updated_at: string;
}

export interface DbTeacher {
  id: string;
  user_id: string;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export interface DbManager {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DbTeacherSchool {
  id: string;
  teacher_id: string;
  school_id: string;
  created_at: string;
}

export interface DbManagerSchool {
  id: string;
  manager_id: string;
  school_id: string;
  created_at: string;
}

export interface DbAttendance {
  id: string;
  teacher_id: string;
  school_id: string;
  clock_in: string;
  clock_out: string | null;
  clock_in_lat: number;
  clock_in_lng: number;
  clock_out_lat: number | null;
  clock_out_lng: number | null;
  clock_in_photo_url: string | null;
  clock_out_photo_url: string | null;
  notes: string | null;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
}

// Tables
export type Tables = {
  profiles: DbProfile;
  schools: DbSchool;
  teachers: DbTeacher;
  managers: DbManager;
  teacher_schools: DbTeacherSchool;
  manager_schools: DbManagerSchool;
  attendances: DbAttendance;
};

// Tables Insert types
export type TablesInsert = {
  profiles: Omit<DbProfile, "created_at" | "updated_at">;
  schools: Omit<DbSchool, "created_at" | "updated_at">;
  teachers: Omit<DbTeacher, "created_at" | "updated_at">;
  managers: Omit<DbManager, "created_at" | "updated_at">;
  teacher_schools: Omit<DbTeacherSchool, "created_at">;
  manager_schools: Omit<DbManagerSchool, "created_at">;
  attendances: Omit<DbAttendance, "created_at" | "updated_at">;
};

// Tables Update types
export type TablesUpdate = {
  profiles?: Partial<Omit<DbProfile, "id" | "created_at">>;
  schools?: Partial<Omit<DbSchool, "id" | "created_at">>;
  teachers?: Partial<Omit<DbTeacher, "id" | "created_at">>;
  managers?: Partial<Omit<DbManager, "id" | "created_at">>;
  teacher_schools?: Partial<Omit<DbTeacherSchool, "id" | "created_at">>;
  manager_schools?: Partial<Omit<DbManagerSchool, "id" | "created_at">>;
  attendances?: Partial<Omit<DbAttendance, "id" | "created_at">>;
};
