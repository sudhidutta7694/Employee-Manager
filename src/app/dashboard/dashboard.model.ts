export interface Employee {
  employeeId: number;
  employeeName: string;
  contactNo: string;
  emailId: string;
  deptId: number;
  password: string;
  gender: string;
  role: string;
  createdDate: string;
}

export interface DashboardState {
  totalEmployee: number;
  totalProject: number;
  recentEmployee: Employee[];
  loading: boolean;
  error: string | null;
}

export const initialDashboardState: DashboardState = {
  totalEmployee: 0,
  totalProject: 0,
  recentEmployee: [],
  loading: false,
  error: null,
};
