export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
      <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</div>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">{children}</div>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-gray-900">{children}</div>;
}

export function TRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="grid grid-cols-12 items-center gap-2 px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {children}
    </div>
  );
}

export function TCell({ children, span = 3, className = '' }: { children: React.ReactNode; span?: number; className?: string }) {
  return <div className={`col-span-${span} ${className}`}>{children}</div>;
}


