const InputForm = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  required,
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
        required={required}
        className="text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder:opacity-50"
      />
    </div>
  );
};

export default InputForm;
