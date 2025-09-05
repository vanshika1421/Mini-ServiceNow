import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.notifications = [];
        this.listeners = new Map();
    }

    connect(userId) {
        if (this.socket) {
            this.disconnect();
        }

        this.socket = io('http://localhost:3011', {
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
            
            // Join user-specific room
            if (userId) {
                this.socket.emit('join', userId);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
        });

        this.socket.on('notification', (notification) => {
            this.handleNotification(notification);
        });

        this.socket.on('ticket_list_update', (update) => {
            this.emit('ticket_list_update', update);
        });

        this.socket.on('dashboard_update', (data) => {
            this.emit('dashboard_update', data);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    handleNotification(notification) {
        // Add to notifications array
        this.notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        // Emit to listeners
        this.emit('notification', notification);

        // Show browser notification if permission granted
        this.showBrowserNotification(notification);
    }

    showBrowserNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const options = {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: notification.type,
                requireInteraction: notification.priority === 'high'
            };

            const browserNotification = new Notification(notification.title, options);
            
            browserNotification.onclick = () => {
                window.focus();
                // You can add navigation logic here
                browserNotification.close();
            };

            // Auto-close after 5 seconds for normal priority
            if (notification.priority !== 'high') {
                setTimeout(() => {
                    browserNotification.close();
                }, 5000);
            }
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            return Notification.requestPermission();
        }
        return Promise.resolve(Notification.permission);
    }

    // Event listener management
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in socket listener:', error);
                }
            });
        }
    }

    // Get all notifications
    getNotifications() {
        return this.notifications;
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    }

    // Clear all notifications
    clearNotifications() {
        this.notifications = [];
    }

    // Get unread count
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
