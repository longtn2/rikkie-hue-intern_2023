import { Modal, Typography } from 'antd';
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
      bodyStyle={{
        border: '1px solid #d6e4ec',
        borderRadius: '5px',
        boxShadow: '2px 2px 4px 2px rgba(0, 0, 0, 0.3)',
        padding: '20px',
      }}
      onCancel={onCancel}
      footer={footer}
    >
      {children}
    </Modal>
  );
};

export default ModalConfirm;
