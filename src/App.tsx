import { Sidebar } from './components/sidebar/Sidebar';
import { TodayPage } from './pages/TodayPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { useNavigationStore } from './store/useNavigationStore';

export function App() {
  const activePage = useNavigationStore((state) => state.activePage);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-h-screen pl-16 lg:pl-64">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {activePage === 'today' ? <TodayPage /> : <WeeklyPage />}
        </div>
      </main>
    </div>
  );
}
