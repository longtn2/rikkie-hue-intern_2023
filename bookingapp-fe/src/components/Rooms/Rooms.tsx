import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popover,
  List,
  Spin,
  Typography,
} from 'antd';
import { url } from '../../ultils/urlApi';
import { SearchOutlined } from '@ant-design/icons';
import { EditOutlined } from '@ant-design/icons';
import { handleErrorShow, handleSuccessShow } from '../../ultils/ultilsApi';
import './Room.css';
import FormAddRoom from './FormAddRoom';
import FormEditRoom from './FormEditRoom';
import { getHeaders } from '../../helper/Header';
import RoomDetails from './RoomDetails';
import Title from 'antd/es/typography/Title';
import { HEADER } from '../../constant/constant';
interface Room {
  room_id: number;
  room_name: string;
  description: string;
  is_blocked: boolean;
}

const { Search } = Input;

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const [totalRooms, setTotalRooms] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roomId, setRoomId] = useState<Room>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    handleDataRoomId();
    getInitalValues();
  }, [roomId?.room_id]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/v1/rooms`, {
        params: {
          page: currentPage,
          per_page: perPage,
        },
        withCredentials: true,
        headers: HEADER,
      });
      if (response?.data?.data) {
        setRooms(response.data.data.rooms);
        setTotalRooms(response.data.data.total_items);
        setCurrentPage(response.data.data.current_page);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomId = async (roomId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/v1/rooms/${roomId}`, {
        withCredentials: true,
        headers: HEADER,
      });
      if (response?.data?.data) {
        setRoomId(response.data.data);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const handleRoomId = (id: number) => {
    setRoomId(undefined);
    fetchRoomId(id);
    setVisibleModal(true);
  };

  const handleDataRoomId = () => {
    return roomId || null;
  };
  const handleLookRoom = async (description: string | undefined) => {
    try {
      setLoading(true);
      if (roomId?.room_id && description) {
        const response = await axios.put(
          `${url}/v1/rooms/${roomId?.room_id}/blocked`,
          {
            description: description,
          },
          {
            headers: HEADER,
          }
        );
        if (response) {
          fetchRoomId(roomId?.room_id);
          handleSuccessShow(response);
        }
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoom = async (description: string | undefined) => {
    try {
      setLoading(true);
      if (roomId?.room_id && description) {
        const response = await axios.put(
          `${url}/v1/rooms/${roomId?.room_id}/opened`,
          {
            description: description,
          },
          {
            headers: HEADER,
          }
        );
        if (response) {
          fetchRoomId(roomId?.room_id);
          handleSuccessShow(response);
        }
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage =
      Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
    setCurrentPage(newCurrentPage);
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalRooms,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
  };

  const handleShowAdd = () => {
    setIsModalVisible(true);
  };

  const handleAddRoom = async (values: any) => {
    try {
      const { room_name, description } = values;
      const response = await axios.post(
        `${url}/v1/rooms`,
        {
          room_name,
          description,
        },
        {
          headers: await HEADER,
        }
      );
      if (response) {
        fetchData();
        handleSuccessShow(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
    }
    handleCancel();
  };

  const handleEdit = (id: number, name: string, description: string) => {
    setSelectedRoom({
      room_id: id,
      room_name: name,
      description: description,
      is_blocked: false,
    });
    formEdit.setFieldsValue({ room_name: name, description: description });
    setShowEditModal(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);
      if (selectedRoom) {
        const response = await axios.put(
          `${url}/v1/rooms/${selectedRoom.room_id}`,
          {
            ...values,
            room_name: values.room_name,
            description: values.description,
          },
          {
            headers: HEADER,
          }
        );
        if (response) {
          fetchData();
          setShowEditModal(false);
          handleSuccessShow(response);
        }
      }
    } catch (error: any) {
      handleErrorShow(error);
    }
    setLoading(false);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      fetchData();
    } else {
      try {
        const response = await axios.get(`${url}/v1/rooms/search`, {
          params: {
            name: value,
          },
          headers: HEADER,
        });
        if (response?.data?.data) {
          handleSuccessShow(response);
          setRooms(response.data.data.rooms);
          setTotalRooms(response.data.data.total_items);
          setCurrentPage(response.data.data.current_page);
        }
      } catch (error: any) {
        handleErrorShow(error);
      }
    }
  };
  const handleCancelRoomId = () => {
    setVisibleModal(false);
  };
  const getInitalValues = () => {
    return selectedRoom || null;
  };
  return (
    <div className='container'>
      <Space className='search'>
        <Search
          placeholder='Search...'
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
        <Button type='primary' onClick={handleShowAdd}>
          Add Rooms
        </Button>
      </Space>
      <div className='action'>
        <Spin
          size='large'
          tip='Loading...'
          spinning={loading}
          className='loading'
        />
        <div className='card-group'>
          <List
            className='list'
            dataSource={rooms}
            grid={{
              gutter: [20, 20],
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            pagination={pagination}
            renderItem={room => (
              <List.Item className='listItem'>
                <div key={room.room_id} className='room-card'>
                  <div className='room-info'>
                    <div
                      className='room-info-title'
                      onClick={() => handleRoomId(room.room_id)}
                    >
                      <Title level={3} style={{ color: '#1677FF' }}>
                        {room.room_name}
                      </Title>
                    </div>
                    <p
                      style={{
                        color: room.is_blocked ? 'red' : 'black',
                        fontSize: '1.3rem',
                      }}
                    >
                      Trạng thái: {room.is_blocked ? 'Bận' : 'Rảnh'}
                    </p>
                  </div>
                  <div className='room-actions'>
                    <Space className='btn'>
                      <Popover content='Edit Room'>
                        <EditOutlined
                          className='btnClick'
                          onClick={() =>
                            handleEdit(
                              room.room_id,
                              room.room_name,
                              room.description || ''
                            )
                          }
                        />
                      </Popover>
                    </Space>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      <Modal
        title={
          <div className='btn'>
            <Typography.Title level={2} className='btn-click'>
              Edit Room Meeting
            </Typography.Title>
          </div>
        }
        visible={showEditModal}
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <FormEditRoom
          form={formAdd}
          getInitialValues={getInitalValues}
          onFinish={handleUpdate}
          onCancel={handleCloseEditModal}
        />
      </Modal>

      <Modal
        title='Add Room'
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <FormAddRoom
          onFinish={handleAddRoom}
          onCancel={handleCancel}
          form={formAdd}
        />
      </Modal>

      {visibleModal && (
        <RoomDetails
          getRoom={handleDataRoomId}
          onCancel={handleCancelRoomId}
          onAction={roomId?.is_blocked ? handleOpenRoom : handleLookRoom}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Rooms;
