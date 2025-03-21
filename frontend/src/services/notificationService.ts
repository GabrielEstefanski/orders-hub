import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';

class NotificationService {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.initConnection();
  }

  private initConnection() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost';
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/notifications`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
            return null;
          }

          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupConnectionEvents();
    this.startConnection();
  }

  private setupConnectionEvents() {
    if (!this.connection) return;

    this.connection.onreconnecting(error => {
      console.log('Tentando reconectar ao hub de notificações...', error);
      this.reconnectAttempts++;
    });

    this.connection.onreconnected(() => {
      console.log('Reconectado ao hub de notificações');
      this.reconnectAttempts = 0;
      toast.success('Conexão com o servidor restaurada');
    });

    this.connection.onclose(error => {
      console.log('Conexão com o hub de notificações fechada', error);
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Não foi possível reconectar ao servidor. Recarregue a página.');
      }
    });

    this.connection.on('OrderCreated', (data) => {
      this.notifyListeners('OrderCreated', data);
      toast.success(`Novo pedido criado: ${data.produto}`);
    });

    this.connection.on('OrderUpdated', (data) => {
      this.notifyListeners('OrderUpdated', data);
      toast.info(`Pedido atualizado: ${data.produto}`);
    });

    this.connection.on('OrderStatusUpdated', (data) => {
      this.notifyListeners('OrderStatusUpdated', data);
      toast.info(`Status do pedido atualizado: ${data.produto} - ${data.status}`);
    });

    this.connection.on('OrderDeleted', (orderId) => {
      this.notifyListeners('OrderDeleted', orderId);
      toast.warning(`Pedido removido: ${orderId}`);
    });
  }

  private async startConnection() {
    if (!this.connection) return;

    try {
      await this.connection.start();
      console.log('Conectado ao hub de notificações');
      this.reconnectAttempts = 0;
    } catch (err) {
      console.error('Erro ao conectar ao hub de notificações:', err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public addListener(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  public removeListener(event: string, callback: (data: any) => void) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback);
    }
  }

  private notifyListeners(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erro ao executar listener para ${event}:`, error);
        }
      });
    }
  }

  public disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }

  public reconnect() {
    this.disconnect();
    this.initConnection();
  }
}

export default new NotificationService(); 