import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wrench, ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { navLinks, modulePermissions } from '../config/permissions';

const icons = {
  LayoutDashboard,
  Wrench,
};

const SideMenu = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const allowedRoutes = user ? modulePermissions[user.role] : [];
  const filteredNavLinks = navLinks.filter(link => allowedRoutes.includes(link.path));

  return (
    <aside
      className={`flex-shrink-0 bg-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        <div className="flex items-center justify-center h-20 border-b border-slate-700">
          <Wrench size={32} className="text-blue-500 flex-shrink-0" />
          {!isCollapsed && <h1 className="text-xl font-bold ml-2">AutoInspect</h1>}
        </div>
        <nav className="mt-4">
          <ul>
            {filteredNavLinks.map((link) => {
              const Icon = icons[link.icon];
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `flex items-center py-3 px-6 my-1 transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:bg-slate-700'
                      }`
                    }
                  >
                    {Icon && <Icon className="flex-shrink-0" />}
                    {!isCollapsed && <span className="ml-4">{link.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-700 p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && user && (
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">{user.name}</span>
                <span className="text-slate-400 text-xs">{user.role}</span>
              </div>
            )}
            <button onClick={logout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                <LogOut size={20} />
            </button>
        </div>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center mt-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
        >
          <ChevronLeft size={20} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;