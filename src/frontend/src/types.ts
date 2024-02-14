export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}
