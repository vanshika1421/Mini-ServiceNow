const mongoose = require("mongoose");

const SLASchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
    responseTime: { type: Number, required: true }, // in minutes
    resolutionTime: { type: Number, required: true }, // in minutes
    escalationTime: { type: Number, required: true }, // in minutes
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update the updatedAt field
SLASchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("SLA", SLASchema);
