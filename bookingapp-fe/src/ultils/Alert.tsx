import { Alert } from 'antd';

type AlertProps = {
  status?: number;
  visible?: boolean;
  message?: string;
  error?: string;
  style?: React.CSSProperties;
};

const CustomAlert: React.FC<AlertProps> = ({
  status,
  visible,
  message,
  error,
  style,
}) => {
  return (
    <>
      {visible && (
        <Alert
          type={status === 200 ? 'success' : 'warning'}
          message={
            <>
              <h3>
                {message}: {error}
              </h3>
            </>
          }
          style={style}
        />
      )}
    </>
  );
};

export default CustomAlert;
