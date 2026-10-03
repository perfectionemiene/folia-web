import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import { BookProvider } from './context/BookContext';
import AppLayout from './components/layout/AppLayout';
import LandingView from './pages/LandingView';
import ReadView from './pages/ReadView';
import DiscoverView from './pages/DiscoverView';
import RememberView from './pages/RememberView';
import MeView from './pages/MeView';
import ReaderView from './pages/ReaderView';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BookProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<LandingView />} />
              <Route path="/landing" element={<LandingView />} />

              {/* Main App Layout */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<ReadView />} />
                <Route path="read" element={<ReadView />} />
                <Route path="discover" element={<DiscoverView />} />
                <Route path="remember" element={<RememberView />} />
                <Route path="me" element={<MeView />} />
              </Route>

              {/* Dedicated Fullscreen Reader */}
              <Route path="/app/read-book/:bookId" element={<ReaderView />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </BookProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;