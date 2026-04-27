import Card from "./Card";

function StatCard({ label, value }) {
  return (
    <Card className="stat-card" interactive>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </Card>
  );
}

export default StatCard;
