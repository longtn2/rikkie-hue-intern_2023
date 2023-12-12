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
import 
import './Room.css';
import FormAddRoom from './FormAddRoom';
import FormEditRoom from './FormEditRoom';
interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

const { Search } = Input;

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form] = Form.useForm();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalRooms, setTotalRooms] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        setPerPage(response.data.data.per_page);
        setCurrentPage(response.data.data.current_page);
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
  useEffect(() => {
    fetchData();
  }, [currentPage, totalRooms]);

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
          headers: HEADER,
        }
      );
      if (response?.data?.data) {
        fetchData();
        handleSuccessShow(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
    }
    handleCancel();
  };

  const handleEdit = (id: number, name: string) => {
    setSelectedRoom({
      room_id: id,
      room_name: name,
      description: '',
      is_blocked: false,
    });
    form.setFieldsValue({ room_name: name });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (selectedRoom) {
        const response = await axios.put(
          `${url}/v1/rooms/${selectedRoom.room_id}`,
          { room_name: values.room_name, description: values.description },
          {
            headers: HEADER,
          }
        );
        if (response?.data?.data) {
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
          setPerPage(response.data.data.per_page);
          setCurrentPage(response.data.data.current_page);
        }
      } catch (error: any) {
        handleErrorShow(error);
      }
    }
  };

  const handleSearchRoom = (values: string) => {
    values ? handleSearch(values) : fetchData();
  };

  return (
    <div className='container'>
      <Space className='search'>
        <Search
          placeholder='Search...'
          enterButton={<SearchOutlined />}
          onSearch={handleSearchRoom}
        />
        <Button type='primary' onClick={handleShowAdd}>
          Add New User
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
            grid={{ gutter: 20, column: 3 }}
            pagination={pagination}
            renderItem={room => (
              <List.Item className='listItem'>
                <div key={room.room_id} className='room-card'>
                  <div className='room-info'>
                    <h2>
                      <Link to={`/roomManager/${room.room_id}`}>
                        {room.room_name}
                      </Link>
                    </h2>
                    <p
                      style={{
                        color: room.is_blocked ? 'red' : 'black',
                        fontSize: '20px',
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
                            handleEdit(room.room_id, room.room_name)
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
          initialValues={selectedRoom ? { ...selectedRoom } : ({} as Room)}
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
        <FormAddRoom onFinish={handleAddRoom} onCancel={handleCancel} />
      </Modal>
    </div>
  );
};

export default Rooms;
