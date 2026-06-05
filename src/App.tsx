import { useState } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { TodayPage } from './pages/TodayPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { SettingsPage } from './pages/SettingsPage';
import { UsageGuidePage } from './pages/UsageGuidePage';
import { Toaster } from './components/ui/sonner';
import { useNavigationStore } from './store/useNavigationStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export function App() {
  const activePage = useNavigationStore((state) => state.activePage);
  const [dismissed, setDismissed] = useState(false);
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <Sidebar />
      <main className="min-h-screen pl-16 lg:pl-64 flex flex-col">
        {!dismissed && (
          <div className="lg:hidden flex items-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800">
            <span className="flex-1">Scheduler is optimized for desktop — some features may not work on mobile.</span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="shrink-0 rounded p-0.5 text-amber-600 hover:text-amber-900"
              aria-label="Dismiss notice"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}
        <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          {activePage === 'today' && <TodayPage />}
          {activePage === 'weekly' && <WeeklyPage />}
          {activePage === 'settings' && <SettingsPage />}
          {activePage === 'usage' && <UsageGuidePage />}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
