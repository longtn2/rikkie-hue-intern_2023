import { Tag } from 'antd';
import getCookie from '../Route/Cookie';

export const TYPE_USER = { ADMIN: 'admin' };
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
export const token = getCookie('token');

export interface BookingDataCalendar {
  title: string;
  booking_id: number | null;
  is_accepted: boolean;
  start: string;
  end: string;
  user_ids: number[];
  room_id: number | null;
  room_name: string;
  user_names: string[];
  backgroundColor: string;
  creator_name: string;
  creator_id: string;
}

export interface BookingDataApi {
  title: string;
  booking_id: number | null;
  is_accepted: boolean;
  time_start: string;
  time_end: string;
  user_ids: number[];
  room_id: number | null;
  room_name: string;
  user_names: string[];
  creator_name: string;
  creator_id: number;
}
export interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

export const statuTag = (item: BookingData) => {
  if (item.is_deleted) {
    return (
      <Tag className='status-tag' color='#ff0000'>
        Rejected
      </Tag>
    );
  } else if (item.is_eccept) {
    return (
      <Tag className='status-tag' color='#009900'>
        Successed
      </Tag>
    );
  } else {
    return (
      <Tag className='status-tag' color='#ff9933'>
        Pending
      </Tag>
    );
  }
};
