'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    setEvents(data);
  }

  const uniqueCategories = ['All', ...new Set(events.map((e) => e.category).filter(Boolean))];
  const uniqueLocations = ['All', ...new Set(events.map((e) => e.location).filter(Boolean))];

  const filteredEvents = events.filter((event) => {
    const matchCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchLocation = selectedLocation === 'All' || event.location === selectedLocation;
    const matchDate = selectedDate === '' || event.event_date === selectedDate;
    return matchCategory && matchLocation && matchDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative bg-indigo-900 text-white rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/event.png"
            alt="Hero Image"
            width={1600}
            height={600}
            className="w-full h-80 md:h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-transparent to-transparent opacity-80"></div>
          <div className="absolute inset-0 px-6 md:px-12 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold">PMMR CHURCH EVENT IN 2025</h1>
            <p className="mt-2 text-lg">Powered by PMMR SIB Keliangau</p>
          </div>
        </div>

        {/* Header + Filter Row */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm focus:ring-indigo-500"
            >
              {uniqueLocations.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm focus:ring-indigo-500"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Events Section */}
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 overflow-hidden"
              >
                <div className="relative">
                  {event.image_url && (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <span className="absolute top-3 right-3 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {event.mode}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-indigo-700 mb-1 hover:underline line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 flex-wrap">
                    <span>📍 {event.location}</span>
                    <span>🗓️ {event.event_date}</span>
                  </div>
                  <div className="text-xs bg-gray-100 text-gray-700 inline-block px-2 py-0.5 rounded-full font-medium mb-2">
                    {event.category}
                  </div>
                  <p className="text-sm text-gray-700">
                    {expandedId === event.id ? event.description : `${event.description.slice(0, 120)}...`}
                    {event.description.length > 120 && (
                      <button
                        onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                        className="text-blue-600 text-xs ml-2 hover:underline"
                      >
                        {expandedId === event.id ? 'Lihat Ringkas' : 'Lihat Lagi'}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
