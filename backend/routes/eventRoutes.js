const express = require('express');
const router = express.Router();
const Event = require('../models/events'); // Import the Event model

// POST route to create a new event
router.post('/create', async (req, res) => {
  const { title, description, date, time, venue, price, totalTickets } = req.body;

  // Validation - Check if required fields are provided
  if (!title || !description || !date || !time || !venue || !price || !totalTickets) {
    return res.status(400).json({ message: 'Please fill in all the required fields.' });
  }

  try {
    // Create a new event object
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      price,
      totalTickets,
      availableTickets: totalTickets, // Initially available tickets will be the same as total tickets
    });

    // Save the event to the database
    await newEvent.save();

    // Return the created event as a response
    res.status(201).json({ message: 'Event created successfully!', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});

module.exports = router;
