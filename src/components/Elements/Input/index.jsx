const InputForm = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  autoComplete,
  error,
  disabled,
  rightIcon,
}) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-slate-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder:opacity-50 outline-none transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed
            ${rightIcon ? "pr-10" : ""}
            ${error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-blue-500"
            }`}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputForm;
