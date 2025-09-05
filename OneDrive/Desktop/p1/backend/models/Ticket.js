const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low","Medium","High","Critical"], default: "Low" },
    status: { type: String, enum: ["Open","In Progress","Resolved","Closed"], default: "Open" },
    category: { type: String, enum: ["Hardware","Software","Network","Access","Other"], default: "Other" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    resolvedAt: { type: Date },
    // SLA tracking fields
    sla: { type: mongoose.Schema.Types.ObjectId, ref: "SLA" },
    responseDeadline: { type: Date },
    resolutionDeadline: { type: Date },
    escalationDeadline: { type: Date },
    respondedAt: { type: Date },
    slaBreached: { type: Boolean, default: false },
    escalated: { type: Boolean, default: false },
    escalationLevel: { type: Number, default: 0 },
    // Additional ServiceNow-like fields
    impact: { type: String, enum: ["Low","Medium","High"], default: "Low" },
    urgency: { type: String, enum: ["Low","Medium","High"], default: "Low" },
    businessService: { type: String },
    location: { type: String },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    history: [{
        action: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        details: String
    }],
    attachments: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model("Ticket", TicketSchema);
