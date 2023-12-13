import { Modal } from "antd";

const ConfirmAction = (
  key: string,
  isModalAction: boolean,
  message: string,
  handleAction: (key: string) => Promise<void>
) => {
  if (key !== null) {
    Modal.confirm({
      title: key,
      content: message,
      okText: key,
      open: isModalAction,
      onOk: async () => {
        await handleAction(key);
      },
    });
  }
};

export default ConfirmAction;
