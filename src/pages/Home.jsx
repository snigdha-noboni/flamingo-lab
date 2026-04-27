import { useEffect, useMemo, useState } from "react";
import AnnouncementCard from "../components/AnnouncementCard";
import Button from "../components/Button";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import { fetchDashboardData } from "../data/mockApi";

function Home() {
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchDashboardData();
      setStats(data.stats);
      setAnnouncements(data.announcements);
    }
    load();
  }, []);

  const today = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    []
  );

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">{today}</p>
          <h2>Welcome back</h2>
        </div>
        <p className="text-muted">
          Flamingo Lab keeps your team notes, meetings, questions, and ideas in one calm workspace.
        </p>
      </header>

      <section className="page-stack-sm">
        <div className="section-heading">
          <h3>Team Snapshot</h3>
        </div>
        <div className="grid cols-4">
          <StatCard label="Members" value={stats?.members ?? "--"} />
          <StatCard label="Notes" value={stats?.notes ?? "--"} />
          <StatCard label="Questions" value={stats?.questions ?? "--"} />
          <StatCard label="Ideas" value={stats?.ideas ?? "--"} />
        </div>
      </section>

      <section className="page-stack-sm">
        <div className="section-heading">
          <h3>Quick Actions</h3>
        </div>
        <Card className="quick-actions">
          <Button to="/notes">New Note</Button>
          <Button to="/meetings" variant="ghost">
            View Meetings
          </Button>
          <Button to="/qa" variant="ghost">
            Ask a Question
          </Button>
          <Button to="/ideas">Post an Idea</Button>
        </Card>
      </section>

      <section className="page-stack-sm">
        <div className="section-heading">
          <h3>Announcements</h3>
        </div>
        <div className="grid cols-3">
          {announcements.map((item) => (
            <AnnouncementCard
              key={item.id}
              title={item.title}
              description={item.description}
              date={new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              tag={item.tag}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
