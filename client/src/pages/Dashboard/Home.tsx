import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import apiClient from "../../api/apiClient";
import Button from "../../components/ui/button/Button";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category?: string;
}

export default function Dashboard() {
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const fetchDashboard = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiClient.get({
        url: "/users.php",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        setCreatedEvents(res.data.created || []);
        setRegisteredEvents(res.data.registered || []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (eventId: number) => {
    if (!token) return;
    try {
      await apiClient.delete({
        url: `/users.php?event_id=${eventId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDashboard(); // refresh after cancel
    } catch (err) {
      console.error(err);
      alert("Failed to cancel registration.");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-700 dark:text-gray-300">
        Loading dashboard...
      </div>
    );

  return (
    <div className="flex flex-col flex-1 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
        My Dashboard
      </h1>

      {/* Created Events */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4 text-gray-700 dark:text-gray-200">
          Events You Created
        </h2>
        {createdEvents.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You haven&apos;t created any events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdEvents.map((e) => (
              <div
                key={e.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {e.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(e.date).toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300">{e.location}</p>
                {e.category && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {e.category}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Registered Events */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4 text-gray-700 dark:text-gray-200">
          Events You Registered For
        </h2>
        {registeredEvents.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You haven&apos;t registered for any events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredEvents.map((e) => (
              <div
                key={e.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {e.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(e.date).toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300">{e.location}</p>
                {e.category && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {e.category}
                  </p>
                )}
                <Button
                  onClick={() => cancelRegistration(e.id)}
                  className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Cancel Registration
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8">
        <Link
          to="/events"
          className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
        >
          Browse All Events
        </Link>
      </div>
    </div>
  );
}
