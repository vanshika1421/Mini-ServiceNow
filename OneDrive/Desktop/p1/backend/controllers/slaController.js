const SLA = require("../models/SLA");
const Ticket = require("../models/Ticket");

// Create default SLAs
const createDefaultSLAs = async () => {
    try {
        const existingSLAs = await SLA.find();
        if (existingSLAs.length === 0) {
            const defaultSLAs = [
                {
                    name: "Critical Priority SLA",
                    description: "SLA for critical priority incidents",
                    priority: "Critical",
                    responseTime: 15, // 15 minutes
                    resolutionTime: 240, // 4 hours
                    escalationTime: 30 // 30 minutes
                },
                {
                    name: "High Priority SLA",
                    description: "SLA for high priority incidents",
                    priority: "High",
                    responseTime: 60, // 1 hour
                    resolutionTime: 480, // 8 hours
                    escalationTime: 120 // 2 hours
                },
                {
                    name: "Medium Priority SLA",
                    description: "SLA for medium priority incidents",
                    priority: "Medium",
                    responseTime: 240, // 4 hours
                    resolutionTime: 1440, // 24 hours
                    escalationTime: 480 // 8 hours
                },
                {
                    name: "Low Priority SLA",
                    description: "SLA for low priority incidents",
                    priority: "Low",
                    responseTime: 480, // 8 hours
                    resolutionTime: 2880, // 48 hours
                    escalationTime: 960 // 16 hours
                }
            ];
            
            await SLA.insertMany(defaultSLAs);
            console.log("Default SLAs created successfully");
        }
    } catch (error) {
        console.error("Error creating default SLAs:", error);
    }
};

// Get all SLAs
const getSLAs = async (req, res) => {
    try {
        const slas = await SLA.find({ isActive: true });
        res.json(slas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new SLA
const createSLA = async (req, res) => {
    try {
        const sla = new SLA(req.body);
        await sla.save();
        res.status(201).json(sla);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update SLA
const updateSLA = async (req, res) => {
    try {
        const sla = await SLA.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sla) {
            return res.status(404).json({ message: "SLA not found" });
        }
        res.json(sla);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Calculate SLA deadlines for a ticket
const calculateSLADeadlines = async (ticket) => {
    try {
        const sla = await SLA.findOne({ priority: ticket.priority, isActive: true });
        if (!sla) return null;

        const createdAt = new Date(ticket.createdAt);
        
        return {
            sla: sla._id,
            responseDeadline: new Date(createdAt.getTime() + sla.responseTime * 60000),
            resolutionDeadline: new Date(createdAt.getTime() + sla.resolutionTime * 60000),
            escalationDeadline: new Date(createdAt.getTime() + sla.escalationTime * 60000)
        };
    } catch (error) {
        console.error("Error calculating SLA deadlines:", error);
        return null;
    }
};

// Check for SLA breaches
const checkSLABreaches = async () => {
    try {
        const now = new Date();
        
        // Find tickets with breached response SLA
        const responseBreaches = await Ticket.find({
            status: { $in: ["Open"] },
            responseDeadline: { $lt: now },
            respondedAt: null,
            slaBreached: false
        });

        // Find tickets with breached resolution SLA
        const resolutionBreaches = await Ticket.find({
            status: { $in: ["Open", "In Progress"] },
            resolutionDeadline: { $lt: now },
            resolvedAt: null,
            slaBreached: false
        });

        // Update breached tickets
        const allBreaches = [...responseBreaches, ...resolutionBreaches];
        for (const ticket of allBreaches) {
            ticket.slaBreached = true;
            ticket.history.push({
                action: "SLA Breach",
                timestamp: now,
                details: "SLA deadline exceeded"
            });
            await ticket.save();
        }

        return {
            responseBreaches: responseBreaches.length,
            resolutionBreaches: resolutionBreaches.length,
            totalBreaches: allBreaches.length
        };
    } catch (error) {
        console.error("Error checking SLA breaches:", error);
        return null;
    }
};

// Get SLA metrics
const getSLAMetrics = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total tickets in last 30 days
        const totalTickets = await Ticket.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // SLA breached tickets
        const breachedTickets = await Ticket.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            slaBreached: true
        });

        // Tickets meeting response SLA
        const responseMetTickets = await Ticket.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            respondedAt: { $ne: null },
            $expr: { $lte: ["$respondedAt", "$responseDeadline"] }
        });

        // Tickets meeting resolution SLA
        const resolutionMetTickets = await Ticket.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            resolvedAt: { $ne: null },
            $expr: { $lte: ["$resolvedAt", "$resolutionDeadline"] }
        });

        const metrics = {
            totalTickets,
            breachedTickets,
            slaComplianceRate: totalTickets > 0 ? ((totalTickets - breachedTickets) / totalTickets * 100).toFixed(2) : 0,
            responseComplianceRate: totalTickets > 0 ? (responseMetTickets / totalTickets * 100).toFixed(2) : 0,
            resolutionComplianceRate: totalTickets > 0 ? (resolutionMetTickets / totalTickets * 100).toFixed(2) : 0
        };

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDefaultSLAs,
    getSLAs,
    createSLA,
    updateSLA,
    calculateSLADeadlines,
    checkSLABreaches,
    getSLAMetrics
};
