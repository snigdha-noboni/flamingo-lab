import { Link } from "react-router-dom";

function Button({
  children,
  variant = "primary",
  className = "",
  to,
  type = "button",
  ...props
}) {
  const classes = `button ${variant === "ghost" ? "button-ghost" : ""} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
