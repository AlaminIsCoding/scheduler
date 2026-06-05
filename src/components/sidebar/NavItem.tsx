import type { LucideIcon } from 'lucide-react';
import type { ActivePage } from '../../store/useNavigationStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  page: ActivePage;
  active: boolean;
  onClick: (page: ActivePage) => void;
}

export function NavItem({ icon: Icon, label, page, active, onClick }: NavItemProps) {
  const buttonContent = (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:justify-start",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={() => onClick(page)}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );

  return (
    <div className="w-full">
      <div className="hidden lg:block">
        {buttonContent}
      </div>
      <div className="block lg:hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
