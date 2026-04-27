import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { addMeeting, fetchMeetings } from "../data/mockApi";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    async function load() {
      const data = await fetchMeetings();
      setMeetings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.date || !form.time || !form.location.trim()) return;

    const newMeeting = await addMeeting({
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      description: form.description.trim(),
    });

    setMeetings((prev) => [...prev, newMeeting]);
    setForm({ title: "", date: "", time: "", location: "", description: "" });
    setIsModalOpen(false);
  };

  const now = new Date();
  const upcomingMeetings = meetings
    .filter((meeting) => new Date(`${meeting.date}T${meeting.time}`) >= now)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const pastMeetings = meetings
    .filter((meeting) => new Date(`${meeting.date}T${meeting.time}`) < now)
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Meetings</p>
          <h2>Schedule</h2>
          <p className="text-muted">Plan collaborative sessions and track past discussions.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Meeting</Button>
      </header>

      {loading ? (
        <p className="text-muted">Loading meetings...</p>
      ) : (
        <>
          <section className="page-stack-sm">
            <div className="section-heading">
              <h3>Upcoming Meetings</h3>
            </div>
            {!upcomingMeetings.length ? (
              <Card className="empty-state-card">
                <p className="text-muted">No upcoming meetings yet.</p>
              </Card>
            ) : (
              upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="meeting-card" interactive>
                  <div className="meeting-card-top">
                    <h3>{meeting.title}</h3>
                    <span className="meeting-time">
                      {new Date(`${meeting.date}T${meeting.time}`).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-muted">
                    {new Date(meeting.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {meeting.location}
                  </p>
                  <p>{meeting.description || "No description provided."}</p>
                </Card>
              ))
            )}
          </section>

          <section className="page-stack-sm">
            <div className="section-heading">
              <h3>Past Meetings</h3>
            </div>
            {pastMeetings.map((meeting) => (
              <Card key={meeting.id} className="meeting-card">
                <div className="meeting-card-top">
                  <h3>{meeting.title}</h3>
                  <span className="meeting-time">
                    {new Date(`${meeting.date}T${meeting.time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-muted">
                  {new Date(meeting.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · {meeting.location}
                </p>
                <p>{meeting.description || "No description provided."}</p>
              </Card>
            ))}
          </section>
        </>
      )}

      <Modal isOpen={isModalOpen} title="Add Meeting" onClose={() => setIsModalOpen(false)}>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label htmlFor="meeting-title">Title</label>
          <input
            id="meeting-title"
            className="input"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Product planning sync"
          />
          <label htmlFor="meeting-date">Date</label>
          <input
            id="meeting-date"
            className="input"
            type="date"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          />
          <label htmlFor="meeting-time">Time</label>
          <input
            id="meeting-time"
            className="input"
            type="time"
            value={form.time}
            onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
          />
          <label htmlFor="meeting-location">Location</label>
          <input
            id="meeting-location"
            className="input"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Remote or meeting room"
          />
          <label htmlFor="meeting-description">Description</label>
          <textarea
            id="meeting-description"
            className="input"
            rows="4"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Agenda and outcomes..."
          />
          <Button type="submit">Save Meeting</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Meetings;
