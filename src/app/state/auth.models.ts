export interface AuthUser {
  employeeId: number;
  employeeName: string;
  contactNo?: string;
  emailId: string;
  deptId?: number;
  role?: string;
  createdDate?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
