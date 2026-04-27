import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { addIdea, fetchIdeas, likeIdea } from "../data/mockApi";

function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedIdeaIds, setLikedIdeaIds] = useState({});

  useEffect(() => {
    async function load() {
      const data = await fetchIdeas();
      setIdeas(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    const author = form.author.trim();
    if (!title || !description) return;

    const idea = await addIdea({ title, description, author });
    setIdeas((prev) => [idea, ...prev]);
    setForm({ title: "", description: "", author: "" });
    setIsModalOpen(false);
  };

  const handleLike = async (ideaId) => {
    if (likedIdeaIds[ideaId]) return;
    const updated = await likeIdea(ideaId);
    setIdeas((prev) => prev.map((idea) => (idea.id === ideaId ? updated : idea)));
    setLikedIdeaIds((prev) => ({ ...prev, [ideaId]: true }));
  };

  const topIdeaId = ideas.reduce(
    (currentTopId, currentIdea) => {
      if (!currentTopId) return currentIdea.id;
      const topIdea = ideas.find((idea) => idea.id === currentTopId);
      return (topIdea?.likes ?? 0) >= currentIdea.likes ? currentTopId : currentIdea.id;
    },
    null
  );

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Ideas</p>
          <h2>Idea Garden</h2>
          <p className="text-muted">Share concepts, discover momentum, and surface high-value proposals.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Post Idea</Button>
      </header>

      {loading ? (
        <p className="text-muted">Loading ideas...</p>
      ) : (
        <section className="grid cols-2 ideas-grid">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              interactive
              className={`idea-card ${topIdeaId === idea.id ? "top-idea" : ""}`}
            >
              {topIdeaId === idea.id && <p className="top-idea-badge">Top Idea</p>}
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <p className="text-muted">
                {idea.author} ·{" "}
                {new Date(idea.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <div className="idea-footer">
                <span className="tag">{idea.likes} likes</span>
                <Button
                  variant="ghost"
                  className={`chip ${likedIdeaIds[idea.id] ? "chip-active" : ""}`}
                  onClick={() => handleLike(idea.id)}
                >
                  {likedIdeaIds[idea.id] ? "Liked" : "Like"}
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}

      <Modal isOpen={isModalOpen} title="Post an Idea" onClose={() => setIsModalOpen(false)}>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label htmlFor="idea-title">Idea title</label>
          <input
            id="idea-title"
            className="input"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="AI summary card for meetings"
          />
          <label htmlFor="idea-description">Description</label>
          <textarea
            id="idea-description"
            className="input"
            rows="4"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Describe your concept..."
          />
          <label htmlFor="idea-author">Author</label>
          <input
            id="idea-author"
            className="input"
            value={form.author}
            onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
            placeholder="Your name (optional)"
          />
          <Button type="submit">Publish Idea</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Ideas;
