import { useState, useEffect } from 'react';
import { Typography, Result, Button, Spin, Modal, Form } from 'antd';
import axios from 'axios';
import { getCookie } from '../../helper/Cookie';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleSuccessShow, handleErrorShow } from '../../ultils/ultilsApi';
import { url } from '../../ultils/urlApi';
import CustomModal from './CustomModal';
import RoomModalContent from './ModalContent';
import { HEADER } from '../../constant/constant';
import { getHeaders } from '../../helper/Header';
const { Title, Text } = Typography;
interface RoomManager {
  room_id: number;
  room_name: string;
  status: boolean;
  description: string;
  is_blocked: boolean;
}

const RoomDetails = () => {
  let { id } = useParams();
  const roomId: number = parseInt(id as string);
  const [room, setRoom] = useState<RoomManager | null>(null);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [open, setOpen] = useState<boolean>(Boolean(id));
  const [isLookModalVisible, setIsLookModalVisible] = useState<boolean>(false);
  const [isOpenModalVisible, setIsOpenModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomId(roomId);
    setOpen(Boolean(id));

    return () => {
      id = '';
    };
  }, [open]);

  const fetchRoomId = async (roomId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/v1/rooms/${roomId}`, {
        withCredentials: true,
        headers: await getHeaders(),
      });
      if (response?.data?.data) {
        setRoom(response.data.data);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModal = (
    isOpen: boolean,
    roomDescription: string,
    modalType: 'look' | 'open'
  ) => {
    const formInstance = modalType === 'look' ? form : form1;
    const setIsModalVisible =
      modalType === 'look' ? setIsLookModalVisible : setIsOpenModalVisible;
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
          headers: await getHeaders(),
        }
      );
      if (response) {
        fetchRoomId(roomId);
        handleSuccessShow(response);
        handleModal(false, '', 'look');
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLookRoom = async (values: { description: string }) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${url}/v1/rooms/${id}/opened`,
        {
          description: values.description,
        },
        {
          headers: await getHeaders(),
        }
      );
      if (response) {
        fetchRoomId(roomId);
        handleSuccessShow(response);
        handleModal(false, '', 'look');
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
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
        spinning={loading}
        className='loading'
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
                onClick={() => handleModal(true, room?.description, 'open')}
                className='btnClick'
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
            <div>
              <Title level={4}>{room?.room_name}</Title>
            </div>
          }
          visible={open}
          onOk={() => handleModal(true, room!.description, 'look')}
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
        onCancel={() => handleModal(false, '', 'look')}
        formId='lookForm'
        formConfig={lookFormConfig}
        onFinish={handleLookRoom}
      />

      <CustomModal
        title='Open Rooms'
        visible={isOpenModalVisible}
        onCancel={() => handleModal(false, '', 'open')}
        formId='openForm'
        formConfig={openFormConfig}
        onFinish={handleOpenLookRoom}
      />
    </>
  );
};

export default RoomDetails;
