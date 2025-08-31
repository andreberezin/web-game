export class NotificationService {
    #notifications = [];

    constructor() {
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showPowerupNotification(powerupType) {
        const notification = this.createNotificationElement(powerupType);
        const container = document.getElementById('notification-container');

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            this.removeNotification(notification);
        }, 3000);
    }

    createNotificationElement(powerupType) {
        const notification = document.createElement('div');
        notification.classList.add('powerup-notification');

        const { message, icon, color } = this.getPowerupNotificationData(powerupType);

        notification.innerHTML = `
            <div class="notification-icon" style="color: ${color}">
                ${icon}
            </div>
            <div class="notification-message">
                ${message}
            </div>
        `;

        return notification;
    }

    getPowerupNotificationData(powerupType) {
        switch (powerupType) {
            case 0:
                return {
                    message: '+1 Life!',
                    icon: '❤️',
                    color: '#ff4444'
                };
            case 1:
                return {
                    message: 'Damage Boost!',
                    icon: '⚔️',
                    color: '#ffa500'
                };
            default:
                return {
                    message: 'Power Up!',
                    icon: '⭐',
                    color: '#4CAF50'
                };
        }
    }

    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}
