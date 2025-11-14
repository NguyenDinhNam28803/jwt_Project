export interface LoginProps {
  username: string;
  password: string;
}

export interface SignupProps {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserInfo {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  __v: number;
}