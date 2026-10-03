import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Leaf, BookOpen, Compass, Bookmark, UserRound } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const AppLayout: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#20221E] font-sans selection:bg-[#30483B]/10 selection:text-[#30483B]">
      {/* Navigation Header */}
      <header className="border-b border-[#E2DAD0] bg-[#F7F3EA]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo -> Leads to Landing Page */}
          <NavLink to="/landing" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#30483B]/10 text-[#30483B] flex items-center justify-center group-hover:bg-[#30483B] group-hover:text-[#F7F3EA] transition-colors">
              <Leaf size={16} strokeWidth={2} />
            </div>
            <span className="font-serif text-3xl font-normal tracking-tight text-[#30483B] lowercase">
              Folia<span className="text-[#B66F5C]">.</span>
            </span>
          </NavLink>

          {/* App Navigation */}
          <nav className="flex items-center gap-1 md:gap-2">
            {[
              { to: '/app', label: 'Read', icon: BookOpen, end: true },
              { to: '/app/discover', label: 'Discover', icon: Compass },
              { to: '/app/remember', label: 'Bookmark', icon: Bookmark },
              { to: '/app/me', label: 'Me', icon: UserRound },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-[#30483B] text-[#F7F3EA] shadow-sm'
                        : 'text-[#20221E]/70 hover:text-[#20221E] hover:bg-[#EFEAE1]'
                    }`
                  }
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Avatar Action -> Links directly to Profile (/app/me) */}
          <div className="flex items-center">
            <NavLink
              to="/app/me"
              className="w-8 h-8 rounded-full bg-[#30483B] text-[#F7F3EA] font-mono text-xs flex items-center justify-center font-medium hover:opacity-90 transition-opacity"
              title="View Profile"
            >
              {user.avatarInitial}
            </NavLink>
          </div>

        </div>
      </header>

      {/* Main View Area */}
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;