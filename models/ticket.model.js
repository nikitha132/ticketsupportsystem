import mongoose from "mongoose";

// Schema for Conversation
const conversationSchema = new mongoose.Schema({
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User collection
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

// Schema for Ticket
const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        unique: true, // Ensure uniqueness of the ticketId
        validate: /^[A-Z0-9]{5}$/ // Validation pattern for five-character string (capital letters and numbers)
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User collection
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open',
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TicketType', // Reference to TicketType collection
    },
    defaultFields: {
        type: Map,
        of: String, // Customize the type as needed based on field types
        default: {},
    },
    conversations: [conversationSchema], // Array of Conversation Objects

    subject: {
        type: String,
        required: true, // Subject is required
    },

    // Additional Fields (for future requirements)
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User collection
    },
    attachments: [String], // Array of file URLs or paths
});

// Middleware to generate ticketId before saving
ticketSchema.pre('save', function (next) {
    if (!this.ticketId) {
        // Generate a five-character alphanumeric string for ticketId
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let generatedId = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            generatedId += characters.charAt(randomIndex);
        }

        this.ticketId = generatedId;
    }

    next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;