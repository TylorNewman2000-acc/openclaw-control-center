export function Input({ 
  label, 
  error, 
  helperText,
  className = '', 
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300' : 'border-zinc-300'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-zinc-500">{helperText}</p>
      )}
    </div>
  );
}

export function Textarea({ 
  label, 
  error, 
  helperText,
  className = '', 
  rows = 4,
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300' : 'border-zinc-300'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-zinc-500">{helperText}</p>
      )}
    </div>
  );
}
