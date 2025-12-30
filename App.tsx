import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';
import AllNews from './pages/AllNews';
import { NewsProvider } from './context/NewsContext';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-dark-bg text-white font-sans selection:bg-primary selection:text-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-news" element={<AllNews />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <NewsProvider>
      <Router>
        <Layout />
      </Router>
    </NewsProvider>
  );
}