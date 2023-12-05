import { Card, Typography } from 'antd';
import { RoomManager } from '../../constant/constant';
const { Text } = Typography;

interface RoomModalContentProps {
  room: RoomManager | null;
}

const RoomModalContent: React.FC<RoomModalContentProps> = ({ room }) => {
  return (
    <Card
      style={{ width: '100%' }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <Text strong>Room ID:</Text> {room?.room_id}
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text strong>Status:</Text> {room?.status ? 'Active' : 'Inactive'}
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text strong>Description:</Text> {room?.description}
      </div>
    </Card>
  );
};

export default RoomModalContent;