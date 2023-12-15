import { useEffect, useState } from 'react';
import { Typography, Spin, Space } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './Booking.css';
import { url } from '../../ultils/urlApi';
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
import { handleErrorShow, handleSuccessShow } from '../../ultils/ultilsApi';
import ReusableForm from './ResaubleForm';
import { getCookie } from '../../helper/Cookie';
import {
  timeEndWeek,
  timeStartWeek,
  formatMonth,
  formatDate,
} from '../../ultils/ultils';
import Autocomplete from './SearchRoomBooking';
import FooterBooking from './FooterBooking';
import FormEditBooking from './FormEditBooking';
import ListBooking from './ListBooking';
import {
  HEADER,
  BookingDataCalendar,
  BookingDataApi,
  DataType,
  Room,
} from '../../constant/constant';
import ActionBooking from './ActionBooking';
import ModalConfirm from './ModalConfirm';
const { Title } = Typography;

const CalendarBooking = () => {
  const [rooms, setRooms] = useState<Room[]>();
  const [users, setUsers] = useState<DataType[]>();
  const [bookingData, setBookingData] = useState<BookingDataCalendar[]>([]);
  const [selectedBookingData, setSelectedBookingData] =
    useState<BookingDataCalendar | null>(null);
  const [modalShow, setModalShow] = useState<Boolean>(false);
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [isDeleted, setIsDeleted] = useState<Boolean>(false);
  const [startDate, setStartDate] = useState<string>(timeStartWeek);
  const [endDate, setEndDate] = useState<string>(timeEndWeek);
  const roles: string[] = getCookie('roles');
  const checkAdmin: boolean = roles.includes('admin');
  const [timeStartAdd, setTimeStartAdd] = useState<moment.Moment | null>(null);
  const [timeEndAdd, setTimeEndAdd] = useState<moment.Moment | null>(null);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/v1/rooms`, {
        withCredentials: true,
        headers: HEADER,
      });
      if (response?.data?.data) {
        setRooms(response.data.data.rooms);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${url}/v1/users`, {
        headers: HEADER,
      });
      if (response?.data?.data) {
        setUsers(response.data.data.users);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const urlCallApi = roles.includes('admin')
        ? `${url}/v1/bookings`
        : `${url}/v1/user/bookings`;
      const response = await axios.get(urlCallApi, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        headers: HEADER,
      });

      if (response?.data?.data) {
        const updatedData = response.data.data.map(
          (booking: BookingDataApi) => {
            const { time_end, time_start, is_accepted, ...rest } = booking;
            return {
              ...rest,
              is_accepted: is_accepted,
              start: time_start,
              end: time_end,
              backgroundColor: is_accepted ? '#009900' : '#ff9933',
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

  useEffect(() => {
    fetchBookingData(startDate, endDate);
    fetchRooms();
    fetchUser();
  }, [startDate, endDate]);
  const handleEventClick = (eventInfo: EventClickArg) => {
    const { event } = eventInfo;
    const selectedData: BookingDataCalendar = {
      title: event.title,
      booking_id: event.extendedProps.booking_id || null,
      backgroundColor: event.backgroundColor,
      is_accepted: event.extendedProps.is_accepted,
      start: moment(event.start).format(),
      end: moment(event.end).format(),
      user_ids: event.extendedProps.user_ids,
      room_id: event.extendedProps.room_id,
      room_name: event.extendedProps.room_name,
      user_names: event.extendedProps.user_names,
      creator_name: event.extendedProps.creator_name,
      creator_id: event.extendedProps.creator_id,
    };
    setSelectedBookingData(selectedData);
    setModalShow(true);
  };

  const handleCloseShow = () => {
    setSelectedBookingData(null);
    setModalShow(false);
  };
  const eventContent = (eventInfo: EventContentArg) => {
    const { event, view } = eventInfo;
    const content = () => {
      if (view.type === 'listWeek' || view.type === 'timeGridWeek') {
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Title level={2}>{event.title}</Title>
        </div>;
      } else {
        <div
          style={{
            backgroundColor: event.backgroundColor,
            color: 'black',
            width: '100%',
            paddingLeft: '10px',
            fontSize: '18px',
          }}
        >
          {event.title}
        </div>;
      }
    };
    return content;
  };

  const handleDateSelect = (arg: DateSelectArg) => {
    const { start, end } = arg;
    const startTime = moment(start);
    const endTime = moment(end);
    setTimeStartAdd(startTime);
    setTimeEndAdd(endTime);
    visibleModal('add', true);
  };

  const visibleModal = (action: string, visible: boolean) => {
    switch (action) {
      case 'add':
        setUpdateModal(visible);
        break;
      case 'edit':
        setIsEditing(visible);
        break;
      case 'delete':
        setIsDeleted(visible);
        break;
    }
  };

  const handleAddBooking = async (values: BookingDataApi) => {
    try {
      setLoading(true);
      const formattedBookingData = {
        ...values,
        time_start: formatMonth(values.time_start),
        time_end: formatMonth(values.time_end),
      };
      const urlCallApi: string = roles.includes('admin')
        ? `${url}/v1/bookings`
        : `${url}/v1/user/bookings`;
      const response = await axios.post(urlCallApi, formattedBookingData, {
        withCredentials: true,
        headers: HEADER,
      });
      if (response?.data?.data) {
        visibleModal('add', false);
        fetchBookingData(startDate, endDate);
        handleSuccessShow(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
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
      user_ids: values.user_ids
        ? values.user_ids
        : selectedBookingData?.user_ids,
      room_id: values.room_id ? values.room_id : selectedBookingData?.room_id,
      time_start: formatMonth(values.time_start),
      time_end: formatMonth(values.time_end),
    };
    try {
      const response = await axios.put(
        `${url}/v1/bookings/${formattedBookingData.booking_id}`,
        formattedBookingData,
        {
          withCredentials: true,
          headers: HEADER,
        }
      );
      if (response?.data?.data) {
        fetchBookingData(startDate, endDate);
        visibleModal('edit', false);
        handleSuccessShow(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
      fetchBookingData(startDate, endDate);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      const response = await axios.delete(
        `${url}/v1/bookings/${selectedBookingData?.booking_id}`,
        {
          headers: HEADER,
        }
      );
      if (response?.data?.data) {
        fetchBookingData(startDate, endDate);
        handleSuccessShow(response);
        visibleModal('delete', false);
      }
    } catch (error: any) {
      handleErrorShow(error);
    }
  };

  const handleEventDrop = (eventInfo: EventClickArg) => {
    const { event } = eventInfo;
    const selectedData: BookingDataApi = {
      title: event.title,
      booking_id: event.extendedProps.booking_id || null,
      is_accepted: event.extendedProps.is_accepted,
      time_start: formatMonth(event.start),
      time_end: formatMonth(event.end),
      user_ids: event.extendedProps.user_ids,
      room_id: event.extendedProps.room_id,
      room_name: event.extendedProps.room_name,
      user_names: event.extendedProps.user_names,
      creator_name: event.extendedProps.creator_name,
      creator_id: event.extendedProps.creator_id,
    };
    handleUpdate(selectedData);
  };

  const handleSearchRoom = async (values: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${url}/v1/bookings/search_room/${values}`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
          withCredentials: true,
          headers: HEADER,
        }
      );

      if (response?.data?.data) {
        const updatedData = response.data.data.map(
          (booking: BookingDataApi) => {
            const { time_end, time_start, is_accepted, ...rest } = booking;
            return {
              ...rest,
              is_accepted: is_accepted,
              start: time_start,
              end: time_end,
              backgroundColor: is_accepted ? '#009900' : '#ff9933',
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

  const handleSearch = (values: number) => {
    if (values) {
      handleSearchRoom(values);
    } else {
      fetchBookingData(startDate, endDate);
    }
  };

  return (
    <>
      <div className='search'>
        <Autocomplete options={rooms ?? []} onSelect={handleSearch} />
      </div>

      <div>
        <div className='action'>
          <Spin
            size='large'
            tip='Loading...'
            spinning={loading}
            className='loading'
          />
        </div>
        <div className='full-calendar'>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
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
            editable={roles.includes('admin') ? true : false}
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
          />
        </div>
      </div>

      <ModalConfirm
        title={selectedBookingData?.title}
        visible={modalShow ? true : false}
        onCancel={handleCloseShow}
        footer={
          checkAdmin ? (
            <div>
              <Space className='space'>
                <ActionBooking
                  is_accepted={selectedBookingData?.is_accepted ?? false}
                  visible={visibleModal}
                />
              </Space>
            </div>
          ) : null
        }
      >
        {selectedBookingData && (
          <ListBooking selectedBookingData={selectedBookingData} />
        )}
      </ModalConfirm>

      <ModalConfirm
        title='Add Booking'
        visible={updateModal}
        onCancel={() => visibleModal('add', false)}
        footer={null}
      >
        <ReusableForm
          onSubmit={handleAddBooking}
          timeStart={timeStartAdd}
          timeEnd={timeEndAdd}
          rooms={rooms ?? []}
          users={users ?? []}
        />
      </ModalConfirm>

      <ModalConfirm
        title={
          <>
            <Typography.Title level={2} className='title-modal'>
              Update Booking
            </Typography.Title>
            <div className='modal-container-title'>
              <div className='modal-title-div'>
                Title:
                <Typography.Title level={5}>
                  {selectedBookingData?.title}
                </Typography.Title>
              </div>
            </div>
            <div className='modal-container-title'>
              <div className='modal-title-div'>
                Room Name:
                <Typography.Title level={5}>
                  {selectedBookingData?.room_name}
                </Typography.Title>
              </div>
            </div>
          </>
        }
        visible={isEditing ? true : false}
        onCancel={() => visibleModal('add', false)}
        footer={null}
      >
        <FormEditBooking
          users={users ?? []}
          onCancel={() => visibleModal('add', false)}
          initialValues={selectedBookingData}
          onFinish={handleUpdate}
        />
      </ModalConfirm>

      <ModalConfirm
        title='Delete Booking'
        visible={isDeleted ? true : false}
        onCancel={() => visibleModal('delete', false)}
        footer={
          <FooterBooking
            onDelete={handleDeleteBooking}
            onCancel={() => visibleModal('delete', false)}
            id={selectedBookingData?.booking_id!}
          />
        }
      >
        <p>Are you sure you want to delete this booking?</p>
      </ModalConfirm>
    </>
  );
};

export default CalendarBooking;
