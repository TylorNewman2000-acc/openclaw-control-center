export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className={`inline-block ${sizes[size]} ${className}`}>
      <div className="h-full w-full border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-zinc-500">{message}</p>
    </div>
  );
}
