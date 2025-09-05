const mongoose = require("mongoose");

const KnowledgeBaseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ["Hardware", "Software", "Network", "Access", "General"], default: "General" },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Draft", "Published", "Archived"], default: "Draft" },
    views: { type: Number, default: 0 },
    helpful: { type: Number, default: 0 },
    notHelpful: { type: Number, default: 0 },
    relatedTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date }
});

// Pre-save middleware to update the updatedAt field
KnowledgeBaseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    if (this.status === 'Published' && !this.publishedAt) {
        this.publishedAt = Date.now();
    }
    next();
});

// Index for text search
KnowledgeBaseSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model("KnowledgeBase", KnowledgeBaseSchema);
