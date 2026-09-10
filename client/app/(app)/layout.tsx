import Sidebar from '../../components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen text-stone-900">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}

