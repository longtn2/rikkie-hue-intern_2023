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
import { handleSuccessShow, handleErrorShow } from '../../ultils/apiUltils';
import { url } from '../../ultils/apiUrl';
import CustomModal from './Modal';
import RoomModalContent from './ContentModal';
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
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomId(roomId);
    setOpen(Boolean(id));
  }, []);

  const fetchRoomId = async (roomId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/v1/rooms/${roomId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoom(response.data.data);
    } catch (error: any) {
      handleErrorShow(error);
    } finally{
      setLoading(false);
    }
  };

  console.log(room?.is_blocked);
  
  const handleModal = (isOpen: boolean, roomDescription: string, modalType: 'look' | 'open') => {
    const formInstance = modalType === 'look' ? form : form1;
    const setIsModalVisible = modalType === 'look' ? setIsLookModalVisible : setIsOpenModalVisible;
    formInstance.setFieldsValue({ description: roomDescription });
    setIsModalVisible(isOpen);
  };

  const handleModalClose = () => {
    setOpen(false);
    navigate('/roomManager');
  };

  const handleLookRoom = async (values: { description: string }) => {
    try {
    setLoading(true);
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
      handleModal(false,"","look");
    } catch (error: any) {
      handleErrorShow(error);
    }finally{
      setLoading(false);
    }
  };
  const handleOpenLookRoom = async (values: { description: string }) => {
    try {
      setLoading(true);
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
      handleModal(false,"","open");
      handleSuccessShow(response);
    } catch (error: any) {
      handleErrorShow(error);
    }
    finally{
      setLoading(false);
    }
  };

  const lookFormConfig = [
    {
      name: 'description',
      label: 'Description',
    },
  ];

  const openFormConfig = [
    {
      name: 'description',
      label: 'Description',
    },
  ];

  return (
    <>
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
        {room?.is_blocked ? (
        <Result
          status='error'
          title='Phòng bị khóa'
          subTitle={
            <div>
              <Text>Description: {room?.description}</Text>
            </div>
          }
          extra={
            <div>
              <Text>Bạn có muốn mở lại phòng này không</Text>
              <Button
                onClick={() => handleModal(true, room?.description,'look')}
                style={{ marginLeft: '10px' }}
                type='primary'
              >
                Opened
              </Button>
            </div>
          }
        />
      ) : (
        <Modal
          title={
            <div style={{ textAlign: 'center', width: '100%', borderBottom: '2px solid black' }}>
              <Title level={4}>{room?.room_name}</Title>
            </div>
          }
          visible={open}
          onOk={() => handleModal(true,room!.description,"open")}
          okText='Look'
          onCancel={handleModalClose}
          cancelText='Cancel'
        >
          <RoomModalContent room={room} />
        </Modal>
      )}
      <CustomModal
        title='Look Rooms'
        visible={isLookModalVisible} 
        onCancel={() => handleModal(false,"","look")}
        formId='lookForm'
        formConfig={lookFormConfig}
        onFinish={handleLookRoom}
      />

      <CustomModal
        title='Open Rooms'
        visible={isOpenModalVisible}
        onCancel={() => handleModal(false,"","open")}
        formId='openForm'
        formConfig={openFormConfig}
        onFinish={handleOpenLookRoom}
      />
    </>
  );
}
export default RoomDetails;
