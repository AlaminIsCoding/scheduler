import { CalendarDays, CalendarRange } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NavItem } from './NavItem';

import { TooltipProvider } from '../ui/tooltip';

export function Sidebar() {
  const activePage = useNavigationStore((state) => state.activePage);
  const setActivePage = useNavigationStore((state) => state.setActivePage);

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed inset-y-0 left-0 z-20 flex w-16 flex-col border-r border-border bg-background shadow-sm lg:w-64">
        <div className="flex h-16 items-center justify-center border-b border-border px-4 lg:justify-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            RB
          </div>
          <span className="ml-3 hidden text-lg font-semibold text-foreground tracking-tight lg:inline">
            Routine Builder
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 p-3" aria-label="Primary navigation">
          <NavItem
            icon={CalendarDays}
            label="Today"
            page="today"
            active={activePage === 'today'}
            onClick={setActivePage}
          />
          <NavItem
            icon={CalendarRange}
            label="Weekly"
            page="weekly"
            active={activePage === 'weekly'}
            onClick={setActivePage}
          />
        </nav>
      </aside>
    </TooltipProvider>
  );
}
