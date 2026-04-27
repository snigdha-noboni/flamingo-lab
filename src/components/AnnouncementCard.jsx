import Card from "./Card";

function AnnouncementCard({ title, description, date, tag }) {
  return (
    <Card className="announcement-card" interactive>
      <div className="announcement-top">
        <p className="tag">{tag}</p>
        <p className="text-muted">{date}</p>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Card>
  );
}

export default AnnouncementCard;
