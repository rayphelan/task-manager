export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full md:overflow-hidden md:rounded-md md:border md:border-gray-200 md:dark:border-gray-700">
      <div className="w-full md:divide-y md:divide-gray-200 md:dark:divide-gray-700">
        {children}
      </div>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden w-full bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-300 md:block">
      {children}
    </div>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-transparent dark:bg-transparent space-y-3 md:space-y-0 md:bg-white md:dark:bg-gray-900">
      {children}
    </div>
  );
}

export function TRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="grid w-full grid-cols-12 items-start gap-3 px-3 py-3 rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 transition-colors md:rounded-none md:border-0 md:shadow-none md:hover:bg-gray-50 md:dark:hover:bg-gray-800 md:items-center md:gap-2 md:py-2"
    >
      {children}
    </div>
  );
}

function colSpanClass(span: number): string {
  switch (span) {
    case 1:
      return 'col-span-1';
    case 2:
      return 'col-span-2';
    case 3:
      return 'col-span-3';
    case 4:
      return 'col-span-4';
    case 5:
      return 'col-span-5';
    case 6:
      return 'col-span-6';
    case 7:
      return 'col-span-7';
    case 8:
      return 'col-span-8';
    case 9:
      return 'col-span-9';
    case 10:
      return 'col-span-10';
    case 11:
      return 'col-span-11';
    case 12:
      return 'col-span-12';
    default:
      return 'col-span-3';
  }
}

export function TCell({
  children,
  span = 3,
  className = '',
}: {
  children: React.ReactNode;
  span?: number;
  className?: string;
}) {
  return <div className={`${colSpanClass(span)} ${className}`}>{children}</div>;
}
