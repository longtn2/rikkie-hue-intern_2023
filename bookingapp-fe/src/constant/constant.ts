import getCookie from "../Route/Cookie";

export const TYPE_USER = { ADMIN: "admin" };
export interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
  is_deleted: boolean;
}

export const token = getCookie("token");
export const roles = getCookie("roles");
export const HEADER = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": true,
};
