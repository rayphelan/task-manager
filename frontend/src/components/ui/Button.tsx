import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    danger:
      'bg-red-600 text-white hover:bg-red-500 focus:ring-red-400 dark:bg-red-600 dark:hover:bg-red-500',
    ghost:
      'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-100 dark:hover:bg-gray-800',
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
