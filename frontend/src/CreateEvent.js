import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Ticket, 
  FileText, 
  Type,
  CheckCircle2,
  AlertCircle,
  PartyPopper
} from 'lucide-react';

const EventForm = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    price: '',
    totalTickets: '',
    userId: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setEventData({ ...eventData, userId: userData._id });
    }
  }, []);
  const handleChange = (e) => {

    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('');
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:3000/api/events/create', eventData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setIsSuccess(true);
        setStatusMessage('Event created successfully!');
        setEventData({
          title: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          price: '',
          totalTickets: '',
          userId: '',
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setStatusMessage('Failed to create event. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="px-8 py-6 text-center border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <PartyPopper className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create New Event</h2>
          <p className="mt-2 text-sm text-gray-600">Fill in the details to create your event</p>
        </div>

        {statusMessage && (
          <div className={`mx-8 mt-6 p-4 rounded-lg flex items-center ${
            isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <p>{statusMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter event title"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Event Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your event"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter venue location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Price ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Tickets
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ticket className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="totalTickets"
                    name="totalTickets"
                    value={eventData.totalTickets}
                    onChange={handleChange}
                    required
                    min="1"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Number of tickets"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;