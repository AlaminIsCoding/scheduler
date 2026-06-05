import { CalendarDays, CalendarRange, Settings, BookOpen, Github, Mail } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NavItem } from './NavItem';

import { TooltipProvider } from '../ui/tooltip';

export function Sidebar() {
  const activePage = useNavigationStore((state) => state.activePage);
  const setActivePage = useNavigationStore((state) => state.setActivePage);

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed z-20 flex border-border bg-background shadow-sm
        inset-x-0 top-0 h-16 flex-row items-center gap-2 border-b px-3
        lg:inset-y-0 lg:left-0 lg:h-full lg:w-64 lg:flex-col lg:items-stretch lg:border-r lg:border-b-0 lg:px-0">
        <div className="flex h-9 shrink-0 items-center justify-center gap-3 px-2 lg:h-16 lg:w-full lg:justify-start lg:border-b lg:border-border lg:px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shrink-0">
            SC
          </div>
          <span className="hidden text-lg font-semibold text-foreground tracking-tight lg:inline">
            Scheduler
          </span>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-1.5 lg:flex-col lg:items-stretch lg:justify-start lg:p-3" aria-label="Primary navigation">
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
          <NavItem
            icon={Settings}
            label="Settings"
            page="settings"
            active={activePage === 'settings'}
            onClick={setActivePage}
          />
          <NavItem
            icon={BookOpen}
            label="Usage Guide"
            page="usage"
            active={activePage === 'usage'}
            onClick={setActivePage}
          />
        </nav>

        <div className="hidden space-y-1 p-3 lg:block">
          <a
            href="https://github.com/AlaminIsCoding/scheduler"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Github className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden lg:inline">Source Code</span>
          </a>
          <a
            href="mailto:contact@alamin.work"
            className="flex w-full items-center justify-center gap-3 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden lg:inline">Contact Me</span>
          </a>
        </div>
      </aside>
    </TooltipProvider>
  );
}
