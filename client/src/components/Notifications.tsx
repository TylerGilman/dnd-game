import { useNotification } from '../context/NotificationContext';

export const Notifications = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`mb-2 p-4 rounded shadow-lg max-w-xs ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}
          onClick={() => removeNotification(notification.id)}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};
