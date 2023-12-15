import { Modal, Button, Typography } from 'antd';
import { ReactNode } from 'react';

interface ModalConfirmProps {
  title: string | ReactNode;
  visible: boolean;
  onCancel: () => void;
  footer: ReactNode;
  children: ReactNode;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  title,
  visible,
  onCancel,
  footer,
  children,
}) => {
  return (
    <Modal
      title={
        <div className='title-modal'>
          {typeof title === 'string' ? (
            <Typography.Title level={2} className='container-show-list-title'>
              {title}
            </Typography.Title>
          ) : (
            title
          )}
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={footer}
    >
      {children}
    </Modal>
  );
};

export default ModalConfirm;
