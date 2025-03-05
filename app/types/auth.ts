export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface AuthError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
} 