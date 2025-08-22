import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import { ChevronLeftIcon } from "../../icons";
import useAuthStore from "../../store/authStore";

interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  category?: string;
  description?: string;
  image?: string;
}

interface Registration {
  id: string;
  fullname: string;
  email: string;
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user); // <-- get current user
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [attendees, setAttendees] = useState<Registration[]>([]);
  const [registered, setRegistered] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get({ url: `/events.php?id=${id}` });
      if (res.data.status === "success") {
        setEvent(res.data.event || null);

        const regs: Registration[] = res.data.registrations || [];
        setAttendees(regs);

        // Check if current user is already registered
        if (user?.email) {
          const isReg = regs.some((r) => r.email === user.email);
          setRegistered(isReg);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!event || !user) return;
    setRegistering(true);

    try {
      const res = await apiClient.post({
        url: "/register_event.php",
        data: { event_id: event.id },
      });

      if (res.data.status === "success") {
        alert(res.data.message);

        // Add current user to attendees
        setAttendees((prev) => [
          ...prev,
          { id: "", fullname: user.fullname, email: user.email },
        ]);
        setRegistered(true);
      } else {
        alert(res.data.message || "Failed to register");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Server error");
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id, user]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return <p className="p-6">Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <PageMeta
        title={`${event.title} | Event Details`}
        description={event.description || ""}
      />

      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <ChevronLeftIcon className="size-5 mr-1" />
        Back to Home
      </Link>

      <div className="border rounded-lg shadow bg-white dark:bg-gray-900 overflow-hidden">
        {event.image && (
          <img src={event.image} alt={event.title} className="w-full h-64 object-cover" />
        )}
        <div className="p-6 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h1>

          {event.category && (
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
              {event.category}
            </span>
          )}

          <p className="text-gray-500 text-sm mt-2">
            {new Date(event.date).toLocaleString()} <br /> {event.venue}
          </p>

          <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {event.description}
          </p>

          <div className="mt-4">
            <Button
              onClick={handleRegister}
              disabled={registering || registered || !user}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {registered
                ? "Registered"
                : registering
                ? "Registering..."
                : user
                ? "Register / RSVP"
                : "Login to Register"}
            </Button>
          </div>

          {attendees.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Attendees</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                {attendees.map((attendee, idx) => (
                  <li key={idx}>{attendee.fullname}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
