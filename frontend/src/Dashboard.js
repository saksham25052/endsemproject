import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Ticket, 
  Home, 
  Settings, 
  Bell, 
  User,
  Search,
  Heart,
  LogOut,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('API Response:', response.data); // Debug response
        setUserData(response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
        setIsLoading(false);
      } catch (error) {
        console.error('Error details:', error); // Debug error
        setError(error.response?.data?.message || 'Failed to fetch user data');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

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
          <SidebarItem icon={<Home size={20} />} text="Dashboard" isOpen={isSidebarOpen} path = "/dashboard" />
          <SidebarItem icon={<Ticket size={20} />} text="My Tickets" isOpen={isSidebarOpen} path = "/" />
          <SidebarItem icon={<Calendar size={20} />} text="Events" isOpen={isSidebarOpen} path = "/create"/>
          <SidebarItem icon={<Heart size={20} />} text="Wishlist" isOpen={isSidebarOpen} path = "/"/>
          <SidebarItem icon={<Settings size={20} />} text="Settings" isOpen={isSidebarOpen} path = "/"/>
          <SidebarItem icon={<LogOut size={20} />} text="Logout" isOpen={isSidebarOpen} path = "/logout" />

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

        {/* Dashboard Content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                eventId={event._id}  // Add this line
                image={event.image}
                title={event.title}
                date={new Date(event.date).toLocaleDateString()}
                time={event.time}
                location={event.venue}
                price={`Rs. ${event.price}`}
                availableTickets={event.availableTickets}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, isOpen, path }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-800 hover:text-white transition-colors"
    >
      <span className="inline-flex">{icon}</span>
      {isOpen && <span className="ml-3">{text}</span>}
    </div>
  );
}

function EventCard({ image, title, date, time, location, price, availableTickets, eventId }) {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/book/${eventId}`);
  };

  // Default event image URL - you can replace this with your own default image
  const defaultEventImage = "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img 
          src={image?.url || defaultEventImage} 
          alt={image?.altText || `${title} event`}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = defaultEventImage;
          }}
        />
        {!image?.url && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm">No image available</span>
          </div>
        )}
      </div>
      {/* Rest of the card content remains the same */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="mt-2 text-sm text-gray-600">
          <p>{date} at {time}</p>
          <p>{location}</p>
          <p className="text-sm text-gray-500">Available Tickets: {availableTickets}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">{price}</span>
          <button 
            onClick={handleBooking}
            className={`px-4 py-2 rounded-lg transition-colors ${
              availableTickets > 0 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={availableTickets === 0}
          >
            {availableTickets > 0 ? 'Book Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;