import { Card, Typography } from 'antd';
const { Text } = Typography;

interface RoomManager {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

interface RoomModalContentProps {
  room: RoomManager | null;
}

const RoomModalContent: React.FC<RoomModalContentProps> = ({ room }) => {
  return (
    <Card className='card'>
      <div className='text'>
        <Text strong>Room ID: {room?.room_id}</Text>
      </div>
      <div className='text'>
        <Text strong>Status: {room?.is_blocked ? 'Active' : 'Inactive'}</Text>
      </div>
      <div className='text'>
        <Text strong>Description:</Text> {room?.description}
      </div>
    </Card>
  );
};

export default RoomModalContent;
