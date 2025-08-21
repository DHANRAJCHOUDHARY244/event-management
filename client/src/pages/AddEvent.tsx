import { useState } from "react";
import apiClient from "../api/apiClient";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Button from "../components/ui/button/Button";
export default function AddEventPage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.date.trim()) newErrors.date = "Date is required";
    if (!form.venue.trim()) newErrors.venue = "Venue is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await apiClient.post({
        url: "/events.php",
        data: form,
      });

      if (res.data.status === "success") {
        alert("Event created successfully with ID: " + res.data.event_id);
        setForm({ title: "", date: "", venue: "", description: "", image: "" });
      } else {
        alert(res.data.message || "Failed to create event");
      }
    } catch (err: any) {
        console.log(err);
        
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Add Event | Dashboard"
        description="Create a new event from the dashboard"
      />
      <PageBreadcrumb pageTitle="Add Event" />
      <div className="max-w-3xl mx-auto mt-6">
        <ComponentCard title="Create New Event">
          <form className="space-y-6">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter event title"
                value={form.title}
                onChange={handleChange}
                error={!!errors.title}
                hint={errors.title}
              />
            </div>

            <div>
              <Label htmlFor="date">Event Date</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                error={!!errors.date}
                hint={errors.date}
              />
            </div>

            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                type="text"
                placeholder="Enter event venue"
                value={form.venue}
                onChange={handleChange}
                error={!!errors.venue}
                hint={errors.venue}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <TextArea
                rows={4}
                placeholder="Enter event description"
                value={form.description}
                onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="text"
                placeholder="Enter image URL"
                value={form.image}
                onChange={handleChange}
              />
            </div>

            <div>
              <Button onClick={handleSubmit as any} className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
