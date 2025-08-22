import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "../../api/apiClient";
import DatePicker from "../../components/form/date-picker";


interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  category?: string;
  description?: string;
  image?: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get({ url: "/search_events.php" });
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter by selected date
  const filteredEvents = selectedDate
    ? events.filter(
        (e) => new Date(e.date).toDateString() === selectedDate.toDateString()
      )
    : events;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <PageMeta title="Home | Upcoming Events" description="Explore upcoming events" />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Upcoming Events
      </h1>

      {/* Date Filter */}
      <div className="mb-6 max-w-sm">
        <DatePicker
          id="filter-date"
          placeholder="Select date to filter"
          defaultDate={selectedDate || undefined}
          onChange={(dates: Date[]) => setSelectedDate(dates[0] || null)}
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found for the selected date.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group border rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h2>
                {event.category && (
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mt-1">
                    {event.category}
                  </span>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(event.date).toLocaleString()} <br /> {event.venue}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                  {event.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
