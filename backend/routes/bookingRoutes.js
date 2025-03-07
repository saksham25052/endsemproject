const express = require('express');
const router = express.Router();
const authLib = require('../library/authLib');
const Event = require('../models/events');
const Booking = require('../models/booking');
const User = require('../models/user')
const { sendBookingConfirmation } = require('../library/mail');

router.post('/create', authLib, async (req, res) => {
  try {
    const { eventId, userId, numberOfTickets, totalAmount } = req.body;

    // Fetch the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if enough tickets are available
    if (event.availableTickets < numberOfTickets) {
      return res.status(400).json({ 
        message: 'Not enough tickets available' 
      });
    }

    // Check if number of tickets is valid (1-4)
    if (numberOfTickets < 1 || numberOfTickets > 4) {
      return res.status(400).json({ 
        message: 'Invalid number of tickets. Maximum 4 tickets allowed per booking.' 
      });
    }

    // Update available tickets
    event.availableTickets -= numberOfTickets;
    await event.save();

    // Create booking record
    const booking = await Booking.create({
      eventId,
      userId,
      numberOfTickets,
      totalAmount,
      bookingDate: new Date(),
      status: 'confirmed'
    });

    // Send confirmation email
    try {
      const user = await User.findById(userId);
      await sendBookingConfirmation(user.email, {
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        venue: event.venue,
        numberOfTickets,
        totalAmount
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with booking confirmation even if email fails
    }

    res.status(201).json({
      message: 'Booking successful! Check your email for confirmation.',
      booking,
      remainingTickets: event.availableTickets
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      message: 'Booking failed', 
      error: error.message 
    });
  }
});

// Get user's bookings
router.get('/user-bookings', authLib, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('eventId')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch bookings',
      error: error.message 
    });
  }
});

// Get specific booking details
router.get('/:bookingId', authLib, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('eventId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the requesting user
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch booking details',
      error: error.message 
    });
  }
});

module.exports = router;