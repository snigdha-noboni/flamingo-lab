import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { addAnswer, addQuestion, fetchQuestions } from "../data/mockApi";

function QA() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState({});
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({ text: "", author: "" });

  useEffect(() => {
    async function load() {
      const data = await fetchQuestions();
      setQuestions(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    const text = questionForm.text.trim();
    if (!text) return;

    const newQuestion = await addQuestion({
      text,
      author: questionForm.author.trim() || "Anonymous",
    });

    setQuestions((prev) => [newQuestion, ...prev]);
    setQuestionForm({ text: "", author: "" });
    setIsModalOpen(false);
  };

  const handleAnswerSubmit = async (event, questionId) => {
    event.preventDefault();
    const draft = (answerDrafts[questionId] || "").trim();
    if (!draft) return;

    const newAnswer = await addAnswer(questionId, { text: draft, author: "Anonymous" });
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, answers: [...question.answers, newAnswer] }
          : question
      )
    );
    setAnswerDrafts((prev) => ({ ...prev, [questionId]: "" }));
    setExpandedIds((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">QA</p>
          <h2>Question Board</h2>
          <p className="text-muted">Track team questions and keep answers in shared context.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Ask a Question</Button>
      </header>

      {loading ? (
        <p className="text-muted">Loading questions...</p>
      ) : (
        <section className="page-stack-sm">
          {questions.map((item) => {
            const isExpanded = Boolean(expandedIds[item.id]);
            return (
              <Card key={item.id} className="qa-card" interactive>
                <div className="qa-card-top">
                  <h3>{item.text}</h3>
                  <Button
                    variant="ghost"
                    className="chip"
                    onClick={() =>
                      setExpandedIds((prev) => ({ ...prev, [item.id]: !isExpanded }))
                    }
                  >
                    {isExpanded ? "Hide Answers" : "View Answers"}
                  </Button>
                </div>
                <p className="text-muted">
                  {item.author} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · {item.answers.length} answers
                </p>

                {isExpanded && (
                  <div className="answer-list">
                    {item.answers.map((answer) => (
                      <div key={answer.id} className="answer-item">
                        <p>{answer.text}</p>
                        <p className="text-muted">{answer.author}</p>
                      </div>
                    ))}
                    <form
                      className="form-inline"
                      onSubmit={(event) => handleAnswerSubmit(event, item.id)}
                    >
                      <input
                        className="input"
                        value={answerDrafts[item.id] || ""}
                        onChange={(event) =>
                          setAnswerDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))
                        }
                        placeholder="Write an answer..."
                      />
                      <Button type="submit">Reply</Button>
                    </form>
                  </div>
                )}
              </Card>
            );
          })}
        </section>
      )}

      <Modal isOpen={isModalOpen} title="Ask a Question" onClose={() => setIsModalOpen(false)}>
        <form className="form-stack" onSubmit={handleQuestionSubmit}>
          <label htmlFor="question-text">Question</label>
          <textarea
            id="question-text"
            className="input"
            rows="4"
            value={questionForm.text}
            onChange={(event) => setQuestionForm((prev) => ({ ...prev, text: event.target.value }))}
            placeholder="Describe your question..."
          />
          <label htmlFor="question-author">Author</label>
          <input
            id="question-author"
            className="input"
            value={questionForm.author}
            onChange={(event) => setQuestionForm((prev) => ({ ...prev, author: event.target.value }))}
            placeholder="Your name (optional)"
          />
          <Button type="submit">Post Question</Button>
        </form>
      </Modal>
    </div>
  );
}

export default QA;
