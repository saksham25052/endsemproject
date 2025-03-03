// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uri = "mongodb+srv://sakshambahuguna25052:LNEYiwgJSG6n7e9o@cluster0.nkdyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/users', userRoutes); // Use the user route
app.use('/api/events', eventRoutes); //Use events route
app.use('/api/admin', adminRoutes); //Use the admin route


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
