const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { calculateSLADeadlines } = require("./slaController");
const nodemailer = require('nodemailer');

const addComment = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        
        const comment = { user: req.user.id, text: req.body.text, createdAt: new Date() };
        ticket.comments.push(comment);
        ticket.history.push({ action: 'Comment added', user: req.user.id });
        await ticket.save();

        // Populate ticket for notifications
        await ticket.populate('assignedTo', 'name email');
        await ticket.populate('createdBy', 'name email');

        // Real-time notifications
        if (req.notificationService) {
            req.notificationService.commentAdded(ticket, comment, req.user.id);
            req.notificationService.ticketListUpdate('update', ticket);
        }

        res.json(ticket.comments);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getHistory = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket.history);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const createTicket = async (req, res) => {
    const { title, description, priority, category, impact, urgency, assignedTo, dueDate, businessService, location } = req.body;
    try {
        const ticketData = {
            title,
            description,
            priority,
            category: category || "Other",
            impact: impact || "Low",
            urgency: urgency || "Low",
            assignedTo,
            createdBy: req.user.id,
            dueDate,
            businessService,
            location
        };

        // Calculate SLA deadlines
        const slaDeadlines = await calculateSLADeadlines({ priority, createdAt: new Date() });
        if (slaDeadlines) {
            Object.assign(ticketData, slaDeadlines);
        }

        const ticket = await Ticket.create(ticketData);
        
        // Add creation to history
        ticket.history.push({
            action: 'Ticket Created',
            user: req.user.id,
            details: `Priority: ${priority}, Category: ${category}`
        });
        await ticket.save();

        // Populate ticket for notifications
        await ticket.populate('assignedTo', 'name email');
        await ticket.populate('createdBy', 'name email');

        // Real-time notifications
        if (req.notificationService) {
            req.notificationService.ticketCreated(ticket, assignedTo);
            req.notificationService.ticketListUpdate('create', ticket);
        }

        // Email notification to assigned user
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            if (assignedUser) {
                sendEmail(assignedUser.email, 'New Ticket Assigned', `Ticket: ${title}`);
            }
        }
        res.status(201).json(ticket);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getTickets = async (req, res) => {
    try {
        let query = {};
        if (req.user.role && req.user.role === 'admin') {
            // admin sees all
            query = {};
        } else {
            // all other users see only their own
            query = { createdBy: req.user._id };
        }
        const tickets = await Ticket.find(query).populate("assignedTo","name email").populate("createdBy","name email");
        // Mark SLA breach
        const now = new Date();
        tickets.forEach(ticket => {
            if (ticket.dueDate && ticket.status !== 'Closed' && new Date(ticket.dueDate) < now) {
                ticket.slaBreached = true;
            } else {
                ticket.slaBreached = false;
            }
        });
        res.json(tickets);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        
        const prevStatus = ticket.status;
        const prevAssignedTo = ticket.assignedTo;
        const changes = {};
        
        // Track changes for notifications
        Object.keys(req.body).forEach(key => {
            if (ticket[key] !== req.body[key]) {
                changes[key] = { from: ticket[key], to: req.body[key] };
            }
        });

        Object.assign(ticket, req.body);
        await ticket.save();

        // Populate ticket for notifications
        await ticket.populate('assignedTo', 'name email');
        await ticket.populate('createdBy', 'name email');

        // Real-time notifications
        if (req.notificationService) {
            // General update notification
            req.notificationService.ticketUpdated(ticket, req.user.id, changes);
            
            // Specific notifications for different types of changes
            if (req.body.status && req.body.status !== prevStatus) {
                req.notificationService.ticketStatusChanged(ticket, prevStatus, req.body.status, req.user.id);
            }
            
            if (req.body.assignedTo && req.body.assignedTo !== prevAssignedTo?.toString()) {
                req.notificationService.ticketAssigned(ticket, req.body.assignedTo, req.user.id);
            }

            // Update ticket list in real-time
            req.notificationService.ticketListUpdate('update', ticket);
        }

        // Email notification on status change
        if (req.body.status && req.body.status !== prevStatus && ticket.assignedTo) {
            const assignedUser = await User.findById(ticket.assignedTo);
            if (assignedUser) {
                sendEmail(assignedUser.email, 'Ticket Status Updated', `Ticket: ${ticket.title}, Status: ${ticket.status}`);
            }
        }
        
        res.json(ticket);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Analytics: Average resolution time, top issues
const analytics = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        // Average resolution time
        const resolved = tickets.filter(t => t.status === 'Resolved' && t.resolvedAt);
        let avgResolution = null;
        if (resolved.length > 0) {
            const total = resolved.reduce((sum, t) => sum + (t.resolvedAt - t.createdAt), 0);
            avgResolution = total / resolved.length / (1000*60*60); // hours
        }
        // Top issues
        const issueCounts = {};
        tickets.forEach(t => {
            issueCounts[t.title] = (issueCounts[t.title] || 0) + 1;
        });
        const topIssues = Object.entries(issueCounts).sort((a,b) => b[1]-a[1]).slice(0,3).map(([title]) => title);
        res.json({ avgResolution, topIssues });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Email notification helper
function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text }, (err, info) => {
        if (err) console.error('Email error:', err);
    });
}

module.exports = {
    addComment,
    getHistory,
    createTicket,
    getTickets,
    updateTicket,
    analytics
};
