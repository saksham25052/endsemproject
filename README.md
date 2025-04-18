# CountMeIn! 🎟️

CountMeIn! is a MERN (MongoDB, Express, React, Node.js) stack-based event ticketing platform that allows users to register, book tickets for events, and manage their bookings. It also includes an admin dashboard for managing users and events.

---

## Features

### User Features
- **User Registration & Login**: Secure user authentication with email verification.
- **Event Browsing**: View upcoming events with details like date, time, venue, and ticket availability.
- **Ticket Booking**: Book tickets for events with a maximum limit of 4 tickets per booking.
- **Booking Confirmation**: Receive a confirmation email with a QR code for event entry.
- **Profile Management**: Update personal details like username, email, and phone number.
- **My Tickets**: View and manage all your bookings in one place.

### Admin Features
- **Admin Login**: Restricted access for administrators.
- **User Management**: View, update roles, or delete users.
- **Event Management**: Create, update, or delete events.
- **Event Statistics**: View detailed stats for all events.

---

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **React Router**: For routing and navigation.
- **Axios**: For making API requests.
- **Tailwind CSS**: For styling the application.
- **Lucide Icons**: For modern and customizable icons.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **MongoDB**: For database management.
- **Mongoose**: For MongoDB object modeling.
- **Nodemailer**: For sending emails with booking confirmations.
- **QRCode**: For generating QR codes for event tickets.

---

## Installation

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or cloud instance)
- A `.env` file with the following variables:
  ```env
  MONGO_URI=<your_mongo_connection_string>
  JWT_SECRET=<your_jwt_secret>
  MAILSLURP_EMAIL=<your_email>
  MAILSLURP_PASSWORD=<your_email_password>
  CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
  CLOUDINARY_API_KEY=<your_cloudinary_api_key>
  CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
