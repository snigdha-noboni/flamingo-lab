function Card({ children, className = "", interactive = false }) {
  const classes = `card ${interactive ? "card-interactive" : ""} ${className}`.trim();
  return <article className={classes}>{children}</article>;
}

export default Card;
