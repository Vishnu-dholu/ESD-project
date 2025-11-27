export type Role = "ROLE_STUDENT" | "ROLE_FACULTY" | "ROLE_TA" | "ROLE_ADMIN";

export interface User {
  username: string;
  fullName?: string;
  roles: Role[];
}

export interface Course {
  id: number;
  code: string;
  title: string;
  faculty?: User;
}

export interface TAApplication {
  id: number;
  student: User;
  course: Course;
  statementOfPurpose: string;
  status: string;
}
