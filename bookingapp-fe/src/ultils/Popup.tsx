import { Modal } from 'antd';

type PopUpType = {
  status: boolean;
  visible: boolean;
  onClose: () => void;
  message: string;
  style?: React.CSSProperties;
};

export const PopUpCustom: React.FC<PopUpType> = ({
  status,
  visible,
  onClose,
  message,
}) => {
  const handleModalClose = () => {
    onClose();
  };

  if (!status || !visible) {
    return null;
  }

  if (status) {
    Modal.success({
      content: message,
      onOk: handleModalClose,
    });
  } else {
    Modal.error({
      content: message,
      onOk: handleModalClose,
    });
  }

  return null;
};
