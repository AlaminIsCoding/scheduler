import { Sidebar } from './components/sidebar/Sidebar';
import { TodayPage } from './pages/TodayPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { useNavigationStore } from './store/useNavigationStore';

export function App() {
  const activePage = useNavigationStore((state) => state.activePage);

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <Sidebar />
      <main className="min-h-screen pl-16 lg:pl-64 flex flex-col">
        <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          {activePage === 'today' ? <TodayPage /> : <WeeklyPage />}
        </div>
      </main>
    </div>
  );
}
