const Button = (props) => {
  const { children, variant = "bg-black", className = "", disabled, type = "submit" } = props;
  return (
    <button
      type={type}
      disabled={disabled}
      className={`h-10 px-6 rounded-2xl ${variant} text-white ${className} 
        disabled:opacity-60 disabled:cursor-not-allowed transition-opacity`}
    >
      {children}
    </button>
  );
};

export default Button;