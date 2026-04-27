import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { addNote, fetchNotes } from "../data/mockApi";

const categories = ["All", "Technical", "Career", "Personal", "General", "Shared"];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "General",
    visibility: "Shared",
    author: "",
  });

  useEffect(() => {
    async function load() {
      const data = await fetchNotes();
      setNotes(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const body = form.body.trim();
    if (!title || !body) return;

    const newNote = await addNote({
      title,
      body,
      category: form.category,
      visibility: form.visibility,
      author: form.author.trim() || "Anonymous",
    });
    setNotes((prev) => [newNote, ...prev]);
    setForm({
      title: "",
      body: "",
      category: "General",
      visibility: "Shared",
      author: "",
    });
    setIsModalOpen(false);
  };

  const filteredNotes = notes.filter((note) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Shared") return note.visibility === "Shared";
    return note.category === activeCategory;
  });

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Notes</p>
          <h2>Team Notes</h2>
          <p className="text-muted">Capture structured notes and share context with your team.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ New Note</Button>
      </header>

      <div className="filter-row">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className={`chip ${activeCategory === category ? "chip-active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Loading notes...</p>
      ) : (
        <section className="grid cols-2">
          {filteredNotes.map((note) => (
            <Card key={note.id} interactive className="note-card">
              <h3>{note.title}</h3>
              <p>{note.body}</p>
              <div className="note-meta">
                <span>{note.author}</span>
                <span>
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="tag-row">
                <span className="tag">{note.category}</span>
                <span className="tag tag-muted">{note.visibility}</span>
              </div>
            </Card>
          ))}
          {!filteredNotes.length && (
            <Card className="empty-state-card">
              <p className="text-muted">No notes found in this category.</p>
            </Card>
          )}
        </section>
      )}

      <Modal isOpen={isModalOpen} title="Create a Note" onClose={() => setIsModalOpen(false)}>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            className="input"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Weekly strategy notes"
          />
          <label htmlFor="note-content">Body</label>
          <textarea
            id="note-content"
            className="input"
            rows="5"
            value={form.body}
            onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
            placeholder="Write your note..."
          />
          <label htmlFor="note-category">Category</label>
          <select
            id="note-category"
            className="input"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          >
            <option value="Technical">Technical</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
            <option value="General">General</option>
          </select>
          <label htmlFor="note-visibility">Visibility</label>
          <select
            id="note-visibility"
            className="input"
            value={form.visibility}
            onChange={(event) => setForm((prev) => ({ ...prev, visibility: event.target.value }))}
          >
            <option value="Shared">Shared</option>
            <option value="Private">Private</option>
          </select>
          <label htmlFor="note-author">Author</label>
          <input
            id="note-author"
            className="input"
            value={form.author}
            onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
            placeholder="Your name"
          />
          <Button type="submit">
            Save Note
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default Notes;
