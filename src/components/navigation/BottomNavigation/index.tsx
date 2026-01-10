import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  iconFilled: string;
}

const navItems: NavItem[] = [
  {
    path: '/app',
    label: 'Dashboard',
    icon: 'dashboard',
    iconFilled: 'dashboard',
  },
  {
    path: '/app/boxes',
    label: 'Manifest',
    icon: 'inventory_2',
    iconFilled: 'inventory_2',
  },
  // Scanner is handled separately as center FAB
  {
    path: '/app/budget',
    label: 'Budget',
    icon: 'account_balance_wallet',
    iconFilled: 'account_balance_wallet',
  },
  {
    path: '/app/planner',
    label: 'Planner',
    icon: 'task_alt',
    iconFilled: 'task_alt',
  },
];

/**
 * Responsive bottom navigation bar.
 * - Mobile/Tablet: Fixed bottom navigation with Scanner FAB
 * - Desktop (lg+): Could be hidden or replaced with sidebar (future enhancement)
 */
export function BottomNavigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  return (
    // Mobile only - hidden on md+ where sidebar takes over
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-t border-border md:hidden">
      {/* Responsive container matching MobileAppShell */}
      <div className="w-full mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-around h-16">
          {/* Left nav items */}
          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full py-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors ${
                  isActive(item.path)
                    ? 'text-accent'
                    : 'text-text-secondary hover:text-text-main'
                }`}
                style={{
                  fontVariationSettings: isActive(item.path)
                    ? "'FILL' 1"
                    : "'FILL' 0",
                }}
              >
                {isActive(item.path) ? item.iconFilled : item.icon}
              </span>
              <span
                className={`text-xs mt-1 ${
                  isActive(item.path)
                    ? 'text-accent font-medium'
                    : 'text-text-secondary'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}

          {/* Center Scanner FAB */}
          <NavLink
            to="/app/scan"
            className="flex items-center justify-center -mt-6 mx-2"
          >
            <div
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
                shadow-lg transition-all transform hover:scale-105
                ${
                  isActive('/app/scan')
                    ? 'bg-accent ring-2 ring-accent/30'
                    : 'bg-accent hover:bg-accent-hover'
                }
              `}
            >
              <span
                className="material-symbols-outlined text-3xl text-background"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                qr_code_scanner
              </span>
            </div>
          </NavLink>

          {/* Right nav items */}
          {navItems.slice(2).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full py-2"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors ${
                  isActive(item.path)
                    ? 'text-accent'
                    : 'text-text-secondary hover:text-text-main'
                }`}
                style={{
                  fontVariationSettings: isActive(item.path)
                    ? "'FILL' 1"
                    : "'FILL' 0",
                }}
              >
                {isActive(item.path) ? item.iconFilled : item.icon}
              </span>
              <span
                className={`text-xs mt-1 ${
                  isActive(item.path)
                    ? 'text-accent font-medium'
                    : 'text-text-secondary'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default BottomNavigation;

