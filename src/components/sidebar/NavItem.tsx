import type { LucideIcon } from 'lucide-react';
import type { ActivePage } from '../../store/useNavigationStore';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  page: ActivePage;
  active: boolean;
  onClick: (page: ActivePage) => void;
}

export function NavItem({ icon: Icon, label, page, active, onClick }: NavItemProps) {
  const activeClasses = active
    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
    : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900';

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-3 border-l-4 px-4 py-3 text-sm font-medium transition-colors lg:justify-start ${activeClasses}`}
      onClick={() => onClick(page)}
      aria-current={active ? 'page' : undefined}
      title={label}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
