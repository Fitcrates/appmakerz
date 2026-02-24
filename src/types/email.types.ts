export interface EmailForm {
  name: string;
  email: string;
  message: string;
}

export interface EmailResponse {
  status: number;
  text: string;
}