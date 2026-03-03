import Navbar from './Navbar';
import ChatAssistant from './common/ChatAssistant';
import PageLoader from './PageLoader';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PageLoader />
      <Navbar />
      <ChatAssistant />

      {/* ================= Main Content ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="page-transition">
          {children}
        </div>
      </main>

      {/* ================= Footer ================= */}
      <footer className="border-t py-6 text-center text-xs">
        <p>© {new Date().getFullYear()} LawMate. Legal information is for educational purposes only.</p>
      </footer>
    </div>
  );
}
