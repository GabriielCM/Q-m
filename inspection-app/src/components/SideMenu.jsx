import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wrench, ChevronsLeft, ChevronsRight } from 'lucide-react';

const NavItem = ({ to, icon: Icon, text, isCollapsed }) => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center h-12 rounded-lg transition-colors duration-200 relative ${ 
      isCollapsed ? 'justify-center' : 'px-4'
    } ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <li className="group">
      <NavLink to={to} className={navLinkClasses} end={to === '/'}>
        <Icon className={`w-6 h-6 flex-shrink-0 ${!isCollapsed && 'mr-3'}`} />
        {!isCollapsed && (
          <span className="whitespace-nowrap">{text}</span>
        )}
        {isCollapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 rounded-md bg-slate-900 text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {text}
          </div>
        )}
      </NavLink>
    </li>
  );
};

const SideMenu = ({ isCollapsed, toggleSidebar }) => {
  return (
    <aside
      className={`flex-shrink-0 bg-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        <div className={`flex items-center justify-center h-20 border-b border-slate-700 overflow-hidden`}>
          <Wrench className={`w-10 h-10 text-blue-500 flex-shrink-0 transition-transform duration-300 ${isCollapsed ? 'rotate-12' : ''}`} />
          {!isCollapsed && (
            <span className={`ml-3 text-2xl font-bold text-white whitespace-nowrap`}>
              AutoInspect
            </span>
          )}
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem to="/" icon={LayoutDashboard} text="Dashboard" isCollapsed={isCollapsed} />
            <NavItem to="/inspection" icon={Wrench} text="Inspeção" isCollapsed={isCollapsed} />
            {/* Futuros links de módulos podem ser adicionados aqui */}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center h-12 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
        >
          {isCollapsed ? <ChevronsRight className="w-6 h-6" /> : <ChevronsLeft className="w-6 h-6" />}
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;