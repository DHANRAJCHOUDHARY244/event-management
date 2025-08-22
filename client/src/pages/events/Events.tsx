import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import useAuthStore from "../../store/authStore";
import DatePicker from "../../components/form/date-picker";
import { Link } from "react-router";

interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  category: string;
  description?: string;
  image?: string;
}

export default function EventsPage() {
  const { user, token } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (category) params.append("category", category);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("sort", sortBy);

      const res: any = await apiClient.get({
        url: `/search_events.php?${params.toString()}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setEvents(res.data.events || []);
      setTotal(res.data.total || 0);
    } catch {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await apiClient.delete({
        url: `/events.php?id=${id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchEvents();
    } catch {
      alert("Failed to delete event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, category, startDate, endDate, sortBy, page]);

  return (
    <div>
      <PageMeta title="Events | Dashboard" description="Manage events in the dashboard" />
      <PageBreadcrumb pageTitle="Events" />
      <div className="max-w-6xl mx-auto mt-6">
        <ComponentCard title="Events List">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1"
            />
            <Input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <DatePicker
              id="startDate"
              label="Start Date"
              defaultDate={startDate || undefined}
              onChange={(dates) => setStartDate(dates[0]?.toISOString().slice(0, 10) || "")}
            />
            <DatePicker
              id="endDate"
              label="End Date"
              defaultDate={endDate || undefined}
              onChange={(dates) => setEndDate(dates[0]?.toISOString().slice(0, 10) || "")}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 rounded-lg border px-4"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Name</option>
            </select>
            <Button onClick={fetchEvents} disabled={loading}>
              {loading ? "Loading..." : "Filter"}
            </Button>
          </div>

          {error && <p className="text-error-500 mb-4">{error}</p>}
          {loading && <p>Loading events...</p>}
          {!loading && events.length === 0 && <p>No events found.</p>}

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.map((event) => (
    <div
      key={event.id}
      className="border rounded-lg shadow p-4 relative bg-white dark:bg-gray-900"
    >
      {/* Event Image */}
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-40 object-cover rounded"
        />
      )}

      {/* Event Title */}
      <h2 className="text-lg font-semibold mt-2">{event.title}</h2>

      {/* Event Category */}
      {event.category && (
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mt-1">
          {event.category}
        </span>
      )}

      {/* Event Date & Venue */}
      <p className="text-gray-500 text-sm mt-2">
        {new Date(event.date).toLocaleString()} - {event.venue}
      </p>

      {/* Event Description */}
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        {event.description?.slice(0, 100)}...
      </p>

      {/* Admin Delete Button */}
      {user?.role === "admin" && (
        <Button
          onClick={() => handleDelete(event.id)}
          className="absolute top-2 right-2 bg-error-500 hover:bg-error-600 text-white"
        >
          Delete
        </Button>
      )}
      <Link to={`/events/${event.id}`} >View</Link>
    </div>
  ))}
</div>


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <Button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
                Prev
              </Button>
              <span className="text-gray-700 dark:text-gray-300">Page {page} of {totalPages}</span>
              <Button onClick={() => setPage((prev) => prev + 1)} disabled={page === totalPages}>
                Next
              </Button>
              <Input
                type="number"
                min={1 as any}
                max={totalPages as any}
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="w-20 text-center"
              />
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
