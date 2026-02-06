const Button = (props) => {
  const { children, variant = "bg-black", className = "", onClick } = props;
  return (
    <button
      className={`h-10 px-6 rounded-2xl ${variant} text-white ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
