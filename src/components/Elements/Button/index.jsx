const Button = (props) => {
  const { children, variant = "bg-black", className = "" } = props;
  return (
    <button
      className={`h-10 px-6 rounded-2xl ${variant} text-white ${className}`}
      type="submit"
    >
      {children}
    </button>
  );
};

export default Button;
