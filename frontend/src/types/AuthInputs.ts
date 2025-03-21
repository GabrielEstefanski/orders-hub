export interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accessToken?: string;
  profilePhoto?: File;
}
