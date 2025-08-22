type Props = {
  type?: "text" | "number" | "email" | "password";
  value?: string;
  name?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  max?: number;
  min?: number;
  dataTestId?: string;
};

const Input: React.FC<Props> = ({
  type = "text",
  value,
  name,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = "",
  dataTestId,
}) => {
  return (
    <input
      type={type}
      value={value}
      name={name}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`my-2 w-full rounded-lg border border-gray-300 bg-white p-2 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
      data-testid={dataTestId}
    />
  );
};

export default Input;
