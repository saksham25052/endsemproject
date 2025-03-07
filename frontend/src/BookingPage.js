import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, Users, CreditCard, AlertCircle, CheckCircle2, Menu, Home, Ticket, Heart, Settings, LogOut, Bell, Search } from 'lucide-react';

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [ticketError, setTicketError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:3000/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUserData(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      const response = await axios.post(
        'http://localhost:3000/api/bookings/create',
        {
          eventId,
          userId: userData._id,
          numberOfTickets: ticketCount,
          totalAmount: event.price * ticketCount
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setIsSuccess(true);
      setStatusMessage(response.data.message);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketChange = (e) => {
    const value = Number(e.target.value);
    if (value > 4) {
      setTicketError('Maximum 4 tickets allowed per booking');
      setTicketCount(4);
    } else if (value < 1) {
      setTicketError('Minimum 1 ticket required');
      setTicketCount(1);
    } else {
      setTicketError('');
      setTicketCount(value);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-900 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            {isSidebarOpen && <h2 className="text-xl font-bold">CountMeIn!</h2>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-indigo-800 rounded-lg">
              <Menu size={24} />
            </button>
          </div>
        </div>
        <nav className="mt-8">
          <SidebarItem icon={<Home size={20} />} text="Dashboard" isOpen={isSidebarOpen} path="/dashboard" />
          <SidebarItem icon={<Ticket size={20} />} text="My Tickets" isOpen={isSidebarOpen} path="/" />
          <SidebarItem icon={<Calendar size={20} />} text="Events" isOpen={isSidebarOpen} path="/create" />
          <SidebarItem icon={<Heart size={20} />} text="Wishlist" isOpen={isSidebarOpen} path="/" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" isOpen={isSidebarOpen} path="/" />
          <SidebarItem icon={<LogOut size={20} />} text="Logout" isOpen={isSidebarOpen} path="/logout" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={userData?.avatar || "/default-avatar.svg"}
                  alt={userData?.username || "Profile"}
                  className="w-8 h-8 rounded-full bg-indigo-600 text-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                  }}
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">
                    {userData ? userData.username : 'Loading...'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {userData ? userData.email : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Existing Content */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            {/* Your existing content here */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Event Image */}
              <div className="relative h-64">
                <img
                  src={event.image?.url || "https://via.placeholder.com/800x400"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h1>

                {/* Event Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="col-span-2">
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="w-5 h-5 mr-2" />
                      <span>Price per ticket: Rs. {event.price}</span>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">About this event</h2>
                  <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
                </div>

                {/* Status Message */}
                {statusMessage && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center ${
                    isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {isSuccess ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                    <p>{statusMessage}</p>
                  </div>
                )}

                {/* Booking Form */}
                <form onSubmit={handleBooking} className="space-y-6">
                  <div>
                    <label htmlFor="ticketCount" className="block text-sm font-medium text-gray-700">
                      Number of Tickets (Max. 4)
                    </label>
                    <input
                      type="number"
                      id="ticketCount"
                      min="1"
                      max="4"
                      value={ticketCount}
                      onChange={handleTicketChange}
                      className={`mt-1 block w-full border ${
                        ticketError ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {ticketError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {ticketError}
                      </p>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>Rs. {event.price * ticketCount}</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 rounded-md text-white ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add SidebarItem component
function SidebarItem({ icon, text, isOpen, path }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-800 hover:text-white transition-colors cursor-pointer"
    >
      <span className="inline-flex">{icon}</span>
      {isOpen && <span className="ml-3">{text}</span>}
    </div>
  );
}

export default BookingPage;