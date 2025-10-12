import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
  // If true, hide breadcrumb on mobile and show from md+
  hideOnMobile?: boolean;
}

export function Breadcrumb({ items, homeLabel, hideOnMobile }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={hideOnMobile ? 'hidden md:block' : ''}>
      {/*
        Mobile UX tweaks:
        - Hide intermediate crumbs on small screens to avoid wrapping.
        - Keep Home + current page only on mobile.
        - Truncate the current page title with ellipsis.
      */}
      <ol className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap min-w-0">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="size-4" />
            <span className="sr-only">{homeLabel || 'Home'}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className={
                // Hide non-last items on small screens, show from md
                (isLast ? 'flex' : 'hidden md:flex') + ' items-center gap-2 min-w-0'
              }
            >
              <ChevronRight className="size-4" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                // Last page: truncate to keep one line on small screens
                <span
                  className={
                    'text-foreground/60 font-medium inline-block truncate max-w-[70vw] md:max-w-none'
                  }
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
