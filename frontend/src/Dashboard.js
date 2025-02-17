import React, { useState } from 'react';
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


function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          <SidebarItem icon={<Home size={20} />} text="Dashboard" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Ticket size={20} />} text="My Tickets" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Calendar size={20} />} text="Events" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Heart size={20} />} text="Wishlist" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Settings size={20} />} text="Settings" isOpen={isSidebarOpen} />
          <SidebarItem icon={<LogOut size={20} />} text="Logout" isOpen={isSidebarOpen} />
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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-gray-700">TestUser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event Cards */}
            <EventCard
              image="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80"
              title="Malhar 2025"
              date="June 15, 2025"
              location="First Quad"
              price="Free"
            />
            <EventCard
              image="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80"
              title="Zeitgeist"
              date="July 10, 2025"
              location="XIMR Auditorium"
              price="Rs. 200"
            />
            <EventCard
              image="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80"
              title="Stand-up Comedy Night"
              date="May 25, 2025"
              location="College Hall"
              price="Rs. 500"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, isOpen }) {
  return (
    <a
      href="#"
      className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-800 hover:text-white transition-colors"
    >
      <span className="inline-flex">{icon}</span>
      {isOpen && <span className="ml-3">{text}</span>}
    </a>
  );
}

function EventCard({ image, title, date, location, price }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="mt-2 text-sm text-gray-600">
          <p>{date}</p>
          <p>{location}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">{price}</span>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;