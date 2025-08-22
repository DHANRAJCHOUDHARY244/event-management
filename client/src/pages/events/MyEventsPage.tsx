import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router";

interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  category?: string;
  description?: string;
  image?: string;
}

export default function MyEventsPage() {
  const user = useAuthStore((state) => state.user);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiClient.get({ url: "/user_events.php" });
      if (res.data.status === "success") {
        setCreatedEvents(res.data.createdEvents || []);
        setRegisteredEvents(res.data.registeredEvents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: number) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return;

    try {
      const res = await apiClient.delete({
        url: "/user_events.php",
        data: { event_id: eventId },
      });

      if (res.data.status === "success") {
        setRegisteredEvents((prev) => prev.filter((e) => e.id !== eventId));
        alert(res.data.message);
      } else {
        alert(res.data.message || "Failed to cancel registration");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  if (!user) return <p className="p-6">Please login to view your events.</p>;
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <PageMeta title="My Events | Dashboard" description="View your events" />

      <section>
        <h2 className="text-xl font-bold mb-2">Created Events</h2>
        {createdEvents.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <ul className="space-y-2">
            {createdEvents.map((e) => (
              <li key={e.id} className="border rounded p-3 flex justify-between items-center">
                <span>{e.title} - {new Date(e.date).toLocaleString()}</span>
                <Button className="bg-red-500 text-white">  <Link to={`/events/${e.id}`} >View</Link></Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2 mt-6">Registered Events</h2>
        {registeredEvents.length === 0 ? (
          <p>No registered events.</p>
        ) : (
          <ul className="space-y-2">
            {registeredEvents.map((e) => (
              <li key={e.id} className="border rounded p-3 flex justify-between items-center">
                <span>{e.title} - {new Date(e.date).toLocaleString()}</span>
                <Button
                  onClick={() => handleCancelRegistration(e.id)}
                  className="bg-red-500 text-white"
                >
                  Cancel Registration
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
