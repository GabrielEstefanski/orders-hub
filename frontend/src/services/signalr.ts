import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

let connection: HubConnection | null = null;

const startConnection = async () => {
  try {
    if (!connection) {
      connection = new HubConnectionBuilder()
        .withUrl('/api/notifications')
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
        })
        .build();

      await connection.start();
      console.log('Conexão SignalR estabelecida');
    }
  } catch (error) {
    console.error('Erro ao estabelecer conexão SignalR:', error);
  }
};

const subscribeToNotifications = (callback: (update: { orderId: string; orderName: string; status: number }) => void) => {
  if (connection) {
    connection.on('ReceiveNotification', (update: { orderId: string; orderName: string; status: number }) => {
      callback(update);
    });
  }
};

const stopConnection = async () => {
  if (connection) {
    await connection.stop();
  }
};

export { startConnection, subscribeToNotifications, stopConnection };
