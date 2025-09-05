class NotificationService {
    constructor(io) {
        this.io = io;
    }

    // Send notification to specific user
    notifyUser(userId, notification) {
        this.io.to(`user_${userId}`).emit('notification', {
            id: Date.now(),
            timestamp: new Date(),
            ...notification
        });
    }

    // Send notification to all users
    notifyAll(notification) {
        this.io.emit('notification', {
            id: Date.now(),
            timestamp: new Date(),
            ...notification
        });
    }

    // Ticket-related notifications
    ticketCreated(ticket, assignedUserId) {
        const notification = {
            type: 'ticket_created',
            title: 'New Ticket Created',
            message: `Ticket #${ticket.ticketNumber} has been created`,
            data: { ticketId: ticket._id, ticket },
            priority: ticket.priority === 'Critical' ? 'high' : 'normal'
        };

        if (assignedUserId) {
            this.notifyUser(assignedUserId, notification);
        } else {
            // Notify all admins/agents
            this.notifyAll(notification);
        }
    }

    ticketUpdated(ticket, updatedBy, changes) {
        const notification = {
            type: 'ticket_updated',
            title: 'Ticket Updated',
            message: `Ticket #${ticket.ticketNumber} has been updated`,
            data: { ticketId: ticket._id, ticket, changes },
            priority: 'normal'
        };

        // Notify assigned user and reporter
        if (ticket.assignedTo && ticket.assignedTo.toString() !== updatedBy) {
            this.notifyUser(ticket.assignedTo, notification);
        }
        if (ticket.createdBy && ticket.createdBy.toString() !== updatedBy) {
            this.notifyUser(ticket.createdBy, notification);
        }
    }

    ticketAssigned(ticket, assignedUserId, assignedBy) {
        const notification = {
            type: 'ticket_assigned',
            title: 'Ticket Assigned',
            message: `You have been assigned ticket #${ticket.ticketNumber}`,
            data: { ticketId: ticket._id, ticket },
            priority: ticket.priority === 'Critical' ? 'high' : 'normal'
        };

        this.notifyUser(assignedUserId, notification);
    }

    ticketStatusChanged(ticket, oldStatus, newStatus, changedBy) {
        const notification = {
            type: 'ticket_status_changed',
            title: 'Ticket Status Changed',
            message: `Ticket #${ticket.ticketNumber} status changed from ${oldStatus} to ${newStatus}`,
            data: { ticketId: ticket._id, ticket, oldStatus, newStatus },
            priority: newStatus === 'Resolved' ? 'high' : 'normal'
        };

        // Notify all relevant users
        if (ticket.assignedTo && ticket.assignedTo.toString() !== changedBy) {
            this.notifyUser(ticket.assignedTo, notification);
        }
        if (ticket.createdBy && ticket.createdBy.toString() !== changedBy) {
            this.notifyUser(ticket.createdBy, notification);
        }
    }

    commentAdded(ticket, comment, addedBy) {
        const notification = {
            type: 'comment_added',
            title: 'New Comment',
            message: `New comment added to ticket #${ticket.ticketNumber}`,
            data: { ticketId: ticket._id, ticket, comment },
            priority: 'normal'
        };

        // Notify assigned user and reporter (except the commenter)
        if (ticket.assignedTo && ticket.assignedTo.toString() !== addedBy) {
            this.notifyUser(ticket.assignedTo, notification);
        }
        if (ticket.createdBy && ticket.createdBy.toString() !== addedBy) {
            this.notifyUser(ticket.createdBy, notification);
        }
    }

    slaBreached(ticket, slaType) {
        const notification = {
            type: 'sla_breach',
            title: 'SLA Breach Alert',
            message: `SLA breach detected for ticket #${ticket.ticketNumber} (${slaType})`,
            data: { ticketId: ticket._id, ticket, slaType },
            priority: 'high'
        };

        // Notify all admins and assigned user
        this.notifyAll(notification);
    }

    escalationTriggered(ticket, escalationLevel) {
        const notification = {
            type: 'escalation',
            title: 'Ticket Escalated',
            message: `Ticket #${ticket.ticketNumber} has been escalated to level ${escalationLevel}`,
            data: { ticketId: ticket._id, ticket, escalationLevel },
            priority: 'high'
        };

        this.notifyAll(notification);
    }

    // System notifications
    systemMaintenance(message, scheduledTime) {
        const notification = {
            type: 'system_maintenance',
            title: 'System Maintenance',
            message,
            data: { scheduledTime },
            priority: 'normal'
        };

        this.notifyAll(notification);
    }

    // Live updates for dashboard
    dashboardUpdate(data) {
        this.io.emit('dashboard_update', data);
    }

    // Live ticket list updates
    ticketListUpdate(action, ticket) {
        this.io.emit('ticket_list_update', {
            action, // 'create', 'update', 'delete'
            ticket,
            timestamp: new Date()
        });
    }
}

module.exports = NotificationService;
