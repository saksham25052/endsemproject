const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  availableTickets: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    url: {
      type: String,
      default: 'https://via.placeholder.com/400x200'  // Default image if none provided
    },
    publicId: {
      type: String  // For Cloudinary public ID
    },
    altText: {
      type: String,
      default: 'Event image'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
