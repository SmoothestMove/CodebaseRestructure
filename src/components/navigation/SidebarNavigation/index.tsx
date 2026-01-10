import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

// Primary navigation - main features
const primaryNavItems: NavItem[] = [
  { path: '/app', label: 'Dashboard', icon: 'dashboard' },
  { path: '/app/boxes', label: 'Manifest', icon: 'inventory_2' },
  { path: '/app/scan', label: 'Quick Scan', icon: 'qr_code_scanner' },
  { path: '/app/truck-load', label: 'Truck Load', icon: 'local_shipping' },
];

// Planning & Organization
const planningNavItems: NavItem[] = [
  { path: '/app/budget', label: 'Budget', icon: 'account_balance_wallet' },
  { path: '/app/planner', label: 'Planner', icon: 'task_alt' },
  { path: '/app/calendar', label: 'Calendar', icon: 'calendar_month' },
];

// Management
const managementNavItems: NavItem[] = [
  { path: '/app/owners', label: 'Owners', icon: 'group' },
  { path: '/app/spaces', label: 'Spaces', icon: 'home' },
];

// Tools
const toolsNavItems: NavItem[] = [
  { path: '/app/marvin', label: 'MARVIN', icon: 'mic' },
];

/**
 * Sidebar navigation for tablet/desktop screens (md+).
 * Contains all navigation links from the original Navbar.
 * Hidden on mobile, visible via hidden md:flex pattern.
 */
export function SidebarNavigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  const NavSection = ({ items, title }: { items: NavItem[]; title?: string }) => (
    <div className="mb-4">
      {title && (
        <div className="px-6 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
          {title}
        </div>
      )}
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={`
            flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors
            ${isActive(item.path)
              ? 'bg-accent/10 text-accent'
              : 'text-text-secondary hover:bg-surface-elevated hover:text-text-main'
            }
          `}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{
              fontVariationSettings: isActive(item.path)
                ? "'FILL' 1"
                : "'FILL' 0",
            }}
          >
            {item.icon}
          </span>
          <span className={`font-medium ${isActive(item.path) ? 'text-accent' : ''}`}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border min-h-screen fixed left-0 top-0 z-40">
      {/* Logo/Brand area */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="material-symbols-outlined text-accent text-2xl mr-2">
          local_shipping
        </span>
        <span className="font-semibold text-lg text-text-main">Smooth Moves</span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <NavSection items={primaryNavItems} />
        <NavSection items={planningNavItems} title="Planning" />
        <NavSection items={managementNavItems} title="Manage" />
        <NavSection items={toolsNavItems} title="Tools" />
      </nav>

      {/* Bottom section - Settings link */}
      <div className="border-t border-border py-4">
        <NavLink
          to="/app/settings"
          className={`
            flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors
            ${location.pathname === '/app/settings'
              ? 'bg-accent/10 text-accent'
              : 'text-text-secondary hover:bg-surface-elevated hover:text-text-main'
            }
          `}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{
              fontVariationSettings: location.pathname === '/app/settings'
                ? "'FILL' 1"
                : "'FILL' 0",
            }}
          >
            settings
          </span>
          <span className={`font-medium ${location.pathname === '/app/settings' ? 'text-accent' : ''}`}>
            Settings
          </span>
        </NavLink>
      </div>
    </aside>
  );
}

export default SidebarNavigation;

