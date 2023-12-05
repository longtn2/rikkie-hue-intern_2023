import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Result,
  Button,
  Spin,
  Modal,
  Form,
  Input,
} from 'antd';
import axios from 'axios';
import getCookie from '../route/Cookie';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../ultils/Alert';
import { handleSuccessShow, handleErrorShow } from '../../ultils/apiUltils';
import { url } from '../../ultils/apiUrl';


const { Title, Text } = Typography;

interface RoomManager {
  room_id: number;
  room_name: string;
  status: boolean;
  description: string;
  is_blocked: boolean;
}



const RoomDetails = () => {
  const { id } = useParams();
  const roomId: number = parseInt(id as string);
  const [room, setRoom] = useState<RoomManager | null>(null);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const token = getCookie('token');
  const [open, setOpen] = useState<boolean>(Boolean(id));
  const [isLookModalVisible, setIsLookModalVisible] = useState<boolean>(false);
  const [isOpenModalVisible, setIsOpenModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleModalClose = () => {
    setOpen(false);
    navigate('/roomManager');
  };


  const fetchRoomId = async (roomId: number) => {
    try {
      const response = await axios.get(`${url}/v1/rooms/${roomId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleSuccessShow(response);
    } catch (error: any) {
      handleErrorShow(error);
    }
  };

  useEffect(() => {
    fetchRoomId(roomId);
  }, [roomId]);

  const handleOpenModalLook = (roomDescription: string) => {
    form.setFieldValue('description', roomDescription);
    setIsLookModalVisible(true);
  };

  const handleCloseModalLook = () => {
    setIsLookModalVisible(false);
  };

  const handleOpenModalOpenLook = (roomDescription: string) => {
    form1.setFieldValue('description', roomDescription);
    setIsOpenModalVisible(true);
  };

  const handleCloseModalOpenLook = () => {
    setIsOpenModalVisible(false);
  };

  const handleLookRoom = async (values: { description: string }) => {
    try {
    const response = await axios.put(
        `${url}/v1/rooms/${id}/blocked`,
        {
          description: values.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRoomId(roomId);
      handleSuccessShow(response);
      handleCloseModalLook();
    } catch (error: any) {
      handleErrorShow(error);
    }
  };

  const handleOpenLookRoom = async (values: { description: string }) => {
    try {
      const response =  await axios.put(
        `${url}/v1/rooms/${id}/opened`,
        {
          description: values.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRoomId(roomId);
      handleCloseModalOpenLook();
      handleSuccessShow(response);
    } catch (error: any) {
      handleErrorShow(error);
    }
  };


  if (!room) {
    return (
      <Spin
        size='large'
        tip='Loading...'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
        }}
      />
    );
  }

  return (
    <>
      {room.is_blocked ? (
        <>
          <Result
            status='error'
            title='Phòng bị khóa'
            subTitle={
              <div>
                <Text>Description: {room.description}</Text>
              </div>
            }
            extra={
              <div>
                <Text>Bạn có muốn mở lại phòng này không</Text>
                <Button
                  onClick={() => handleOpenModalOpenLook(room.description)}
                  style={{ marginLeft: '10px' }}
                  type='primary'
                >
                  Opened
                </Button>
              </div>
            }
          />
        </>
      ) : (
        <>
          <Modal
            title={
              <div
                style={{textAlign:'center',width:"100%",borderBottom:'2px solid black'}}
              >
                <Title level={4}>{room.room_name}</Title>
              </div>
            }
            visible={open}
            onOk={() => handleOpenModalLook(room.description)}
            okText='Look'
            onCancel={handleModalClose}
            cancelText='Cancel'
          >
            <Card
              style={{ width: '100%' }}
              bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <Text strong>Room ID:</Text> {room.room_id}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Status:</Text>{' '}
                {room.status ? 'Active' : 'Inactive'}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Description:</Text> {room.description}
              </div>
            </Card>
          </Modal>
        </>
      )}

      <Modal
        title={<Title level={2}>Look Rooms</Title>}
        visible={isLookModalVisible}
        onCancel={handleCloseModalLook}
        footer={[
          <Button key='cancel' onClick={handleCloseModalLook}>
            Cancel
          </Button>,
          <Button key='look' type='default' form='lookForm' htmlType='submit'>
            Look
          </Button>,
        ]}
      >
        <Form form={form} id='lookForm' onFinish={handleLookRoom}>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input type='text' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={2}>Open Rooms</Title>}
        visible={isOpenModalVisible}
        onCancel={handleCloseModalOpenLook}
        footer={[
          <Button key='cancel' onClick={handleCloseModalOpenLook}>
            Cancel
          </Button>,
          <Button key='open' type='primary' form='openForm' htmlType='submit'>
            Open
          </Button>,
        ]}
      >
        <Form form={form1} id='openForm' onFinish={handleOpenLookRoom}>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input type='text' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoomDetails;
