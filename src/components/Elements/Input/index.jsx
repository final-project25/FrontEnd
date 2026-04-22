const InputForm = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  autoComplete,
  error,
}) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-slate-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder:opacity-50 outline-none transition-colors
          ${error
            ? "border-red-500 focus:border-red-500"
            : "border-slate-300 focus:border-blue-500"
          }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputForm;