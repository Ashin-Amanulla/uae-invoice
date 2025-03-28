import Label from "./Label";
import Input from "./Input";

const FormField = ({
  label,
  name,
  type = "text",
  required = false,
  error = null,
  tooltip = null,
  register = () => ({}),
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center">
          <Label htmlFor={name} required={required}>
            {label}
          </Label>
          {tooltip && (
            <div className="relative ml-1 group">
              <div className="cursor-help text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-.75 3a.75.75 0 100 1.5.75.75 0 000-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      )}
      <Input
        id={name}
        type={type}
        error={!!error}
        {...register(name)}
        {...props}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
