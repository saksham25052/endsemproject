import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, Settings, Trash2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, eventsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/users', { headers }),
          axios.get('http://localhost:3000/api/admin/events/stats', { headers })
        ]);

        setUsers(usersRes.data);
        setEvents(eventsRes.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:3000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/admin/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state by removing the deleted event
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      setError('Failed to delete event');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Users Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Users Management</h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Add action buttons here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Events Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Events Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow p-6 relative">
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteEvent(event._id)}
                className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Event"
              >
                <Trash2 size={20} />
              </button>

              <h3 className="font-semibold mb-2">{event.title}</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Created by: {event.userId.username}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Time: {event.time}
                </p>
                <p className="text-sm text-gray-600">
                  Venue: {event.venue}
                </p>
                <p className="text-sm text-gray-600">
                  Price: Rs. {event.price}
                </p>
                <p className="text-sm text-gray-600">
                  Tickets Available: {event.availableTickets}/{event.totalTickets}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center shadow-lg">
          <AlertCircle className="mr-2" />
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;