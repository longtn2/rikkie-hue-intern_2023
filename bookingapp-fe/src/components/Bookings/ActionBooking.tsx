import { Button, Popover } from 'antd';
import { ActionBooking } from '../../constant/constant';

const ActionBooking: React.FC<ActionBooking> = ({
  is_accepted,
  visible,
}) => {
  return (
    is_accepted ? (
      <>
        <Popover content='Edit'>
          <Button onClick={() => visible('add', true)}>Edit</Button>
        </Popover>
        <Popover content='Delete'>
          <Button danger onClick={() => visible('delete', true)}>
            Delete
          </Button>
        </Popover>
      </>
    ) : (
      <>
        <Popover content='Accepted'>
          <Button type='primary'>Accepted</Button>
        </Popover>
        <Popover content='Rejected'>
          <Button danger>Rejected</Button>
        </Popover>
      </>
    )
  );
};

export default ActionBooking;