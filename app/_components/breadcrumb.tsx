import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: any;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex flex-wrap items-center text-xs sm:text-sm text-gray-300", className)}>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && <ChevronRight className="mx-1 sm:mx-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-2"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-400 whitespace-nowrap flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
} 