import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Alert,
  Form,
  Input,
  Space,
  Popover,
  List,
  Spin,
  Typography,
  AutoComplete,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {  EditOutlined } from '@ant-design/icons';
import getCookie from '../route/Cookie';
import { url } from '../../ultils/apiUrl';
import { handleErrorShow, handleSuccessShow } from '../../ultils/apiUltils';
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
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const token = getCookie('token');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'any',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Ngrok-Trace-Id': 'bc47d5235e969cbcdd63082f9efdeb9c',
          Server: 'Werkzeug/3.0.0 Python/3.12.0',
          'cache-control': 'no-cache,private',
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalRooms(response.data.data.total_items);
      setRooms(response.data.data.rooms);
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
      const response =  await axios.post(
        `${url}/v1/rooms`,
        {
          room_name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleSuccessShow(response);
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
        const response =  await axios.put(
          `${url}/v1/rooms/${selectedRoom.room_id}`,
          { room_name: values.room_name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        handleSuccessShow(response);
        handleCloseEditModal();
        fetchData();
      }
    } catch (error: any) {
        handleErrorShow(error)
    }
    setLoading(false);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const fetchSearch = async (value: string) => {
    const requestUrl = `${url}/v1/rooms/search`;
    await axios
      .get(requestUrl, {
        params: {
          name: value,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true,
        },
      })
      .then(response => {
        setRooms(response.data.data.rooms);
        setCurrentPage(response.data.data.total_items);
      })
      .catch(error => {
        handleErrorShow(error);
      });
  };

  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      fetchData();
    } else {
      fetchSearch(value);
    }
  };
  return (
    <>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Space
          style={{
            marginBottom: 20,
            justifyContent: 'space-between',
            columnGap: 20,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Button
              onClick={handleShowAdd}
              type='primary'
              style={{
                marginTop: '10px',
                borderRadius: '10px',
              }}
            >
              Add Room
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Search
              placeholder='Search...'
              enterButton={<SearchOutlined />}
              style={{ width: 300 }}
              onSearch={handleSearch}
            />
          </div>
        </Space>
        <div className='action'>

          {loading ? (
            <Spin
              size='large'
              tip='Loading...'
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                color: '#ff0000',
              }}
            />
          ) : (
            <div
              className='card-group'
              style={{
                width: '100%',
                height: '80%',
                padding: '10px 0px 10px 80px',
              }}
            >
              <List
                dataSource={rooms}
                grid={{ gutter: 20, column: 3 }}
                pagination={pagination}
                renderItem={room => (
                  <List.Item
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      minWidth: '100px',
                      minHeight: '80px',
                      maxHeight: '370px',
                      maxWidth: '280px',
                      padding: '20px 0',
                    }}
                  >
                    <div
                      key={room.room_id}
                      className='room-card'
                      style={{
                        width: '100%',
                        height: '100%',
                        border: '2px solid #dadada',
                        borderRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
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
                        <Space style={{ marginBottom: '10px' }}>
                          <Popover content='Edit Room'>
                            <EditOutlined
                              style={{ justifyContent: 'flex-end' }}
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
          )}
        </div>

        <Modal
          title={
            <div style={{ marginBottom: '10px' }}>
              <Typography.Title level={2} style={{ textAlign: 'center' }}>
                Edit Room Meeting
              </Typography.Title>
            </div>
          }
          visible={showEditModal}
          onCancel={handleCloseEditModal}
          footer={null}
        >
          <Form form={form} onFinish={handleUpdate}>
            <Form.Item name='room_name'>
              <Input
                type='text'
                style={{ padding: '10px 20px', fontSize: '16px' }}
              />
            </Form.Item>
            <Form.Item name='description'>
              <Input 
                type='text'
                style={{ padding: '10px 20px', fontSize: '16px' }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                style={{ marginRight: '5px' }}
              >
                Save Changes
              </Button>
              <Button
                htmlType='button'
                onClick={event => {
                  event.preventDefault();
                  setShowEditModal(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title='Add Room'
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} onFinish={handleAddRoom} preserve={false}>
            <Form.Item
              name='room_name'
              label='Room Name:'
              rules={[
                {
                  required: true,
                  message: 'Room not empty',
                },
              ]}
            >
              <Input type='text' />
            </Form.Item>
            <Form.Item
              name='description'
              label='Description:'
              rules={[
                {
                  required: true,
                  message: 'Room not empty',
                },
              ]}
            >
              <Input type='text' />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                style={{ marginRight: '5px' }}
              >
                Add
              </Button>
              <Button
                htmlType='button'
                onClick={event => {
                  event.preventDefault();
                  handleCancel();
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Rooms;
