import { CalendarDays, CalendarRange } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NavItem } from './NavItem';

export function Sidebar() {
  const activePage = useNavigationStore((state) => state.activePage);
  const setActivePage = useNavigationStore((state) => state.setActivePage);

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-16 flex-col border-r border-slate-200 bg-white shadow-sm lg:w-64">
      <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4 lg:justify-start">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
          RB
        </div>
        <span className="ml-3 hidden text-lg font-semibold text-slate-900 lg:inline">
          Routine Builder
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 py-4" aria-label="Primary navigation">
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
  );
}
