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
import moment from 'moment';
import axios from 'axios';
import { getCookie } from '../helper/CookiesHelper';
import { url } from '../ultils/apiUrl';
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { handleErrorShow, handleSuccessShow } from '../ultils/apiUltils';
import { formatDate, timeEndWeek, timeStartWeek } from '../../ultils/ultils';
import './Booking.css';
const { Title } = Typography;

interface BookingData {
  title: string;
  booking_id: number | null;
  is_accepted: boolean;
  start: string;
  end: string;
  user_ids: number[];
  room_id: number | null;
  room_name: string;
  user_names: string[];
}

interface BookingDataApi {
  title: string;
  booking_id: number | null;
  is_accepted: boolean;
  time_start: string;
  time_end: string;
  user_ids: number[];
  room_id: number | null;
  room_name: string;
  user_names: string[];
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
  const [startDate, setStartDate] = useState<string>(timeStartWeek);
  const [endDate, setEndDate] = useState<string>(timeEndWeek);
  const roles: string[] = getCookie('roles');
  const id: number = parseInt(getCookie('user_id'));
  const checkAdmin: boolean = roles.includes('admin');
  const [timeStartAdd, setTimeStartAdd] = useState<moment.Moment | null>(null);
  const [timeEndAdd, setTimeEndAdd] = useState<moment.Moment | null>(null);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      let response;
      roles.includes('admin')
        ? (response = await axios.get(`${url}/v1/bookings`, {
            params: {
              start_date: startDate,
              end_date: endDate,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': true,
            },
          }))
        : (response = await axios.get(`${url}/v1/user/bookings`, {
            params: {
              start_date: startDate,
              end_date: endDate,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': true,
            },
          }));

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
      start: formatDate(event.start),
      end: formatDate(event.end),
      user_id: event.extendedProps.user_id,
      room_id: event.extendedProps.room_id,
      room_name: event.extendedProps.room_name,
      user_name: event.extendedProps.user_name,
    };

    setSelectedBookingData(selectedData);
    setModalShow(true);
  };

  const handleUpdate = async (values: BookingDataApi) => {
    const formattedBookingData = {
      ...values,
      booking_id: values.booking_id
        ? values.booking_id
        : selectedBookingData?.booking_id,
      user_id: values.user_id,
      room_id: selectedBookingData?.room_id,
      time_start: formatDate(values.time_start),
      time_end: formatDate(values.time_end),
    };
    try {
      setLoading(true);
      const response = await axios.put(
        `${url}/v1/bookings/${formattedBookingData!.booking_id}`,
        formattedBookingData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': true,
          },
        }
      );
      fetchBookingData(startDate, endDate);
      handleSuccessShow(response);
    } catch (error: any) {
      handleErrorShow(error);
      fetchBookingData(startDate, endDate);
    } finally {
      setLoading(false);
    }
  };

  const eventContent = (eventInfo: EventContentArg) => {
    const { event, view } = eventInfo;
    let content;
    if (view.type === 'listWeek') {
        content = (
          <div
            className='listWeek'
        >
          <Title level={2}>{event.title}</Title>
        </div>
        )
    } else {
        <>
          <div
            className='listWeekCalendar'
          >
            <Title level={2}>{event.title}</Title>
          </div>
        </>
    }
    return content;
  };
  const handleDateSelect = (arg: DateSelectArg) => {
    const { start, end } = arg;
    const startTime = moment(start);
    const endTime = moment(end);
    setTimeStartAdd(startTime);
    setTimeEndAdd(endTime);
  };

  const handleDatesSet = (arg: { start: Date; end: Date }) => {
    const { start, end } = arg;
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    setStartDate(startDate);
    setEndDate(endDate);
    fetchBookingData(startDate, endDate);
  };

  const handleUpdate = async (values: BookingDataApi) => {
    const formattedBookingData = {
      ...values,
      booking_id: values.booking_id
        ? values.booking_id
        : selectedBookingData?.booking_id,
      user_ids: values.user_ids ? values.user_ids : selectedBookingData?.user_ids,
      room_id: values.room_id ? values.room_id : selectedBookingData?.room_id,
      time_start: formatDate(values.time_start),
      time_end: formatDate(values.time_end),
    };
    try {
      const response = await axios.put(
        `${url}/v1/bookings/${formattedBookingData!.booking_id}`,
        formattedBookingData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': true,
          },
        }
      );
      fetchBookingData(startDate, endDate);
      handleSuccessShow(response);
    } catch (error: any) {
      handleErrorShow(error);
      fetchBookingData(startDate, endDate);
    }
  };

  const handleEventDrop = (eventInfo: EventClickArg) => {
    const { event } = eventInfo;
    const selectedData: BookingDataApi = {
      title: event.title,
      booking_id: event.extendedProps.booking_id || null,
      is_accepted: event.extendedProps.is_accepted,
      time_start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
      time_end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
      user_ids: event.extendedProps.user_ids,
      room_id: event.extendedProps.room_id,
      room_name: event.extendedProps.room_name,
      user_names: event.extendedProps.user_names,
    };
    handleUpdate(selectedData);
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
      editable={true}
      eventDrop={handleEventDrop}
    />
  );
};

export default CalendarBooking;
