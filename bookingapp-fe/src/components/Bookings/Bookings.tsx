import { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Spin,
  DatePicker,
  List,
  Typography,
  Space,
  Select,
  Popover,
  Alert,
  AutoComplete,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { getCookie } from '../helper/CookiesHelper';
import { url } from '../ultils/apiUrl';
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { handleErrorShow, handleSuccessShow } from '../ultils/apiUltils';
const { Title } = Typography;

interface BookingData {
  title: string;
  booking_id: number | null;
  start: string;
  end: string;
  user_id: number[];
  room_id: number | null;
  room_name: string;
  user_name: string[];
}

interface BookingDataApi {
  title: string;
  booking_id: number | null;
  time_start: string;
  time_end: string;
  user_id: number[];
  room_id: number | null;
  room_name: string;
  user_name: string[];
}

interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
}

interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

const CalendarBooking = () => {
  const [rooms, setRooms] = useState<Room[]>();
  const [users, setUsers] = useState<DataType[]>();
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const token: string = getCookie('token');
  const [selectedBookingData, setSelectedBookingData] =
    useState<BookingData | null>(null);
  const [modalShow, setModalShow] = useState<Boolean>(false);
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [isDeleted, setIsDeleted] = useState<Boolean>(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf('week').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState<string>(
    dayjs().endOf('week').format('YYYY-MM-DD')
  );
  const roles: string[] = getCookie('roles');
  const id: number = parseInt(getCookie('user_id'));
  const checkAdmin: boolean = roles.includes('admin');
  const [timeStartAdd, setTimeStartAdd] = useState<dayjs.Dayjs | null>(null);
  const [timeEndAdd, setTimeEndAdd] = useState<dayjs.Dayjs | null>(null);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [success, setSuccess] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [successAdd, setSuccessAdd] = useState('');
  const [isSuccessAdd, setIsSuccessAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookingData(startDate, endDate);
    fetchRooms();
    fetchUser();
  }, [startDate, endDate]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${url}/v1/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true,
        },
      });
      setRooms(response.data.data.rooms);
    } catch (error: any) {
      handleErrorShow(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${url}/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true,
        },
      });
      setUsers(response.data.data.users);
    } catch (error: any) {
      handleErrorShow(error);
    }
  };

  const fetchBookingData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      let response;

      if (roles.includes('admin')) {
        response = await axios.get(`${url}/v1/bookings`, {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': true,
          },
        });
      } else {
        response = await axios.get(`${url}/v1/user/bookings`, {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': true,
          },
        });
      }

      if (response.data.data) {
        const updatedData = response.data.data.map(
          (booking: BookingDataApi) => {
            const { time_end, time_start, ...rest } = booking;
            return {
              ...rest,
              start: time_start,
              end: time_end,
            };
          }
        );
        setBookingData(updatedData);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventInfo: EventClickArg) => {
    const { event } = eventInfo;

    const selectedData: BookingData = {
      title: event.title,
      booking_id: event.extendedProps.booking_id || null,
      start: dayjs(event.start).format(),
      end: dayjs(event.end).format(),
      user_id: event.extendedProps.user_id,
      room_id: event.extendedProps.room_id,
      room_name: event.extendedProps.room_name,
      user_name: event.extendedProps.user_name,
    };

    setSelectedBookingData(selectedData);
    setModalShow(true);
  };

  const eventContent = (eventInfo: EventContentArg) => {
    const { event, view } = eventInfo;

    if (view.type === 'listWeek') {
      return (
        <>
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <Title level={2}>{event.title}</Title>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>{event.title}</div>
        </>
      );
    }
  };
  const handleDateSelect = (arg: DateSelectArg) => {
    const { start, end } = arg;
    const startTime = dayjs(start);
    const endTime = dayjs(end);
    console.log('Start TIme: ', startTime, 'End Time: ', endTime);
    setTimeStartAdd(startTime);
    setTimeEndAdd(endTime);
  };

  const handleDatesSet = (arg: { start: Date; end: Date }) => {
    const { start, end } = arg;
    const startDate = dayjs(start).format('YYYY-MM-DD');
    const endDate = dayjs(end).format('YYYY-MM-DD');

    setStartDate(startDate);
    setEndDate(endDate);

    fetchBookingData(startDate, endDate);
  };
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView='timeGridWeek'
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek',
      }}
      events={bookingData}
      eventClick={handleEventClick}
      eventContent={eventContent}
      fixedWeekCount={true}
      showNonCurrentDates={false}
      selectable={true}
      selectMirror={true}
      select={handleDateSelect}
      datesSet={handleDatesSet}
    />
  );
};
export default CalendarBooking;
