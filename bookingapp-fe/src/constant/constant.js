export const TYPE_USER = { ADMIN : 'admin'}
export interface DataType {
    user_id: number;
    role_id: number[];
    user_name: string;
    role_name: string[];
    phone_number: string;
    email: string;
    is_deleted: boolean;
  }
  export interface RoomManager {
    room_id: number;
    room_name: string;
    status: boolean;
    description: string;
    is_blocked: boolean;
  } 