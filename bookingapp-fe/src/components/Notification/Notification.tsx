import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { onMessageListener } from './Firebase';
import { handleError } from '../../ultils/ultilsApi';

interface NotificationType {
  title: string;
  body: string;
}

const Notification = () => {
  const [notificationData, setNotificationData] = useState<
    NotificationType | undefined
  >();
  const [isListerning, setIsListerning] = useState<boolean>(false);
  const unsubscribe = () => {
    onMessageListener()
      .then((payload: any) => {
        setNotificationData({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
      })
      .catch((error: any) => handleError(error))
      .finally(() => {
        setIsListerning(true);
      });
  };

  useEffect(() => {
    unsubscribe();
    if (notificationData) {
      notification.open({
        message: notificationData.title,
        description: notificationData.body,
        placement: 'bottomRight',
      });
    }
  }, [notificationData, isListerning]);

  return null;
};

export default Notification;
