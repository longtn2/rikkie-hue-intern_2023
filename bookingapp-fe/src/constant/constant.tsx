import { Tag } from "antd";
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

export interface BookingData {
  room_name: string;
  title: string;
  user_name: string[];
  time_start: string;
  time_end: string;
  is_eccept: boolean;
  is_deleted: boolean;
}

export const statuTag = (item: BookingData) => {
  if (item.is_deleted) {
    return (
      <Tag className="status-tag" color="#ff0000">
        Rejected
      </Tag>
    );
  } else if (item.is_eccept) {
    return (
      <Tag className="status-tag" color="#009900">
        Successed
      </Tag>
    );
  } else {
    return (
      <Tag className="status-tag" color="#ff9933">
        Pending
      </Tag>
    );
  }
}
export const token = getCookie("token");
export const roles = getCookie("roles");
export const HEADER = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": true,
};
