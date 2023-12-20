import { Button, Popover } from 'antd';
import { ActionBookingType } from '../../constant/constant';

const ActionBooking: React.FC<ActionBookingType> = ({
  is_accepted,
  action,
  loading,
  visible,
}) => {
  return is_accepted ? (
    <>
      <Popover content='Edit'>
        <Button onClick={() => visible('edit', true)}>Edit</Button>
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
        <Button
          type='primary'
          loading={loading}
          onClick={() => action('accept')}
        >
          Accepted
        </Button>
      </Popover>
      <Popover content='Rejected'>
        <Button danger loading={loading} onClick={() => action('reject')}>
          Rejected
        </Button>
      </Popover>
    </>
  );
};

export default ActionBooking;
