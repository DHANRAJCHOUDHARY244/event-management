import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./auth/ProtectedRoute";
import AddEventPage from "./pages/events/AddEvent";
import Events from "./pages/events/Events";
import EventDetailsPage from "./pages/events/EventDetailsPage";
import AboutPage from "./pages/About";
import MyEventsPage from "./pages/events/MyEventsPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="add-event" element={<AddEventPage />} />
            <Route path="events" element={<Events />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/my-events" element={<MyEventsPage />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
