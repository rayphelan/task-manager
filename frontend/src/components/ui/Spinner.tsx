export function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <span
      aria-label="loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
