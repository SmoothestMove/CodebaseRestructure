
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; 
import { IconHome, IconListBullet, IconSmoothMovesLogo, IconSettings } from '@/lib/config/constants'; 
import { FaTruck, FaSearch, FaToolbox, FaClipboardList } from 'react-icons/fa'; 
import { FaUserGroup, FaHouseUser, FaLandmark } from 'react-icons/fa6';
import { BsQrCodeScan } from 'react-icons/bs';
import { Mic, Calendar, MapPin } from 'lucide-react';
import GlobalSearch from '@/components/search/GlobalSearch';
import Button from '@/components/common/Button';
import CategorySubNavigation from './CategorySubNavigation'; 

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Desktop navigation remains unchanged for compatibility
  const desktopNavLinks = [
    { to: "/app", label: "Dashboard", icon: IconHome },
    { to: "/app/boxes", label: "Manifest", icon: IconListBullet }, 
    { to: "/app/budget", label: "Budget", icon: FaLandmark },
    { to: "/app/planner", label: "Planner", icon: MapPin },
    { to: "/app/calendar", label: "Calendar", icon: Calendar },
    { to: "/app/marvin", label: "MARVIN", icon: Mic },
    { to: "/app/owners", label: "Owners", icon: FaUserGroup },
    { to: "/app/spaces", label: "Spaces", icon: FaHouseUser }, 
    { to: "/app/truck-load", label: "Truck Load", icon: FaTruck }, 
    { to: "/app/scan", label: "Quick Scan", icon: BsQrCodeScan, state: { isQuickScanMode: true } }, 
    { to: "/app/settings", label: "Settings", icon: IconSettings },
  ];

  // New categorical structure for mobile
  const mobileCategories = [
    {
      id: 'home',
      label: 'Home',
      icon: IconHome,
      primary: '/app',
      items: [
        { to: '/app', label: 'Dashboard', icon: IconHome },
        { to: '/app/settings', label: 'Settings', icon: IconSettings }
      ]
    },
    {
      id: 'track',
      label: 'Track',
      icon: FaClipboardList,
      primary: '/app/boxes',
      items: [
        { to: '/app/boxes', label: 'Boxes', icon: IconListBullet },
        { to: '/app/truck-load', label: 'Truck Load', icon: FaTruck }
      ]
    },
    {
      id: 'scan',
      label: 'Scan',
      icon: BsQrCodeScan,
      primary: '/app/scan',
      special: true,
      items: [
        { to: '/app/scan', label: 'Quick Scan', icon: BsQrCodeScan, state: { isQuickScanMode: true } }
      ]
    },
    {
      id: 'plan',
      label: 'Plan',
      icon: MapPin,
      primary: '/app/planner',
      items: [
        { to: '/app/planner', label: 'Planner', icon: MapPin },
        { to: '/app/calendar', label: 'Calendar', icon: Calendar }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: FaToolbox,
      primary: '/app/budget',
      items: [
        { to: '/app/budget', label: 'Budget', icon: FaLandmark },
        { to: '/app/marvin', label: 'MARVIN', icon: Mic },
        { to: '/app/owners', label: 'Owners', icon: FaUserGroup },
        { to: '/app/spaces', label: 'Spaces', icon: FaHouseUser }
      ]
    }
  ];

  // Get current category based on location
  const getCurrentCategory = () => {
    return mobileCategories.find(cat => 
      cat.items.some(item => item.to === location.pathname) || cat.primary === location.pathname
    )?.id || null;
  };

  const currentCategory = getCurrentCategory();

  // Ensure all links start with /app
  const desktopNavLinksUpdated = desktopNavLinks.map(link => ({
    ...link,
    to: link.to.startsWith('/app') ? link.to : `/app${link.to === '/' ? '' : link.to}`
  }));

  const desktopLinkClass = "flex items-center px-3 py-3 rounded-lg text-base font-medium text-brand-light-gray dark:text-slate-300 hover:bg-brand-primary-dark dark:hover:bg-slate-700 hover:text-white dark:hover:text-slate-100 transition-all duration-150 ease-in-out w-full transform hover:scale-105";
  const desktopActiveLinkClass = "bg-brand-tertiary dark:bg-orange-500 text-white dark:text-white shadow-md scale-105";

  // Handler for category selection
  const handleCategorySelect = (categoryId: string, event?: React.MouseEvent) => {
    const category = mobileCategories.find(cat => cat.id === categoryId);
    
    if (category?.special) {
      // Special case for scan - direct navigation
      return;
    }
    
    if (category?.items.length === 1) {
      // Single item - navigate directly
      return;
    }
    
    if (selectedCategory === categoryId) {
      // Same category clicked - close sub-nav
      setSelectedCategory(null);
    } else if (currentCategory === categoryId && location.pathname === category?.primary) {
      // Already on primary page - show sub-nav
      setSelectedCategory(categoryId);
    } else {
      // Different category - navigate to primary then show sub-nav
      setSelectedCategory(categoryId);
    }
    
    if (event) {
      event.preventDefault();
    }
  };


  return (
    <>
      {/* --- Desktop Sidebar (Fixed) --- */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-brand-primary dark:bg-slate-800 text-white dark:text-slate-100 fixed h-full top-0 left-0 z-50 shadow-xl p-5 space-y-4">
        <NavLink 
          to="/app"
          className="flex items-center text-white dark:text-slate-100 font-bold text-2xl hover:opacity-80 transition-opacity pt-2 pb-4 mb-2 border-b border-brand-primary-dark/50 dark:border-slate-700/50"
          end
        >
          <IconSmoothMovesLogo className="h-10 w-10 mr-3 text-brand-tertiary dark:text-orange-400" />
          Smooth Moves
        </NavLink>

        <nav className="flex-grow space-y-2">
          {/* Global Search Button */}
          <Button
            variant="ghost"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center w-full justify-start px-3 py-3 rounded-lg text-base font-medium text-brand-light-gray dark:text-slate-300 hover:bg-brand-primary-dark dark:hover:bg-slate-700 hover:text-white dark:hover:text-slate-100 transition-all duration-150 ease-in-out"
            leftIcon={<FaSearch className="mr-3 w-6 h-6 flex-shrink-0" />}
          >
            Search
          </Button>

          {desktopNavLinksUpdated.map((linkInfo) => {
            const LinkIcon = linkInfo.icon;
            return (
              <NavLink
                key={linkInfo.label}
                to={linkInfo.to}
                end={linkInfo.to === "/app" || linkInfo.to === "/app/"}
                state={linkInfo.state} 
                className={({ isActive }) => `${desktopLinkClass} ${isActive ? desktopActiveLinkClass : ''}`}
              >
                <LinkIcon className="mr-3 w-6 h-6 flex-shrink-0" />
                {linkInfo.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* --- Mobile Top Bar (Sticky, for branding only) --- */}
      <nav className="bg-brand-primary dark:bg-slate-800 shadow-lg sticky top-0 z-30 md:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink 
              to="/app"
              className="flex items-center text-white dark:text-slate-100 font-bold text-xl hover:opacity-80 transition-opacity touch-manipulation min-h-[44px]"
              aria-label="Smooth Moves Home"
            >
              <IconSmoothMovesLogo className="h-8 w-8 mr-2 text-brand-tertiary dark:text-orange-400" />
              Smooth Moves
            </NavLink>
            
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-white dark:text-slate-100 hover:bg-brand-primary-dark dark:hover:bg-slate-700 min-w-[44px] min-h-[44px]"
              ariaLabel="Open search"
            >
              <FaSearch className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Bottom Navigation Bar (Fixed) --- */}
      <div className="md:hidden h-20"></div> {/* Spacer for fixed bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-1px_3px_rgba(0,0,0,0.07)] dark:shadow-[0_-1px_3px_rgba(255,255,255,0.05)] touch-manipulation">
        <div className="flex justify-around items-end h-20 px-2">
          {mobileCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isActive = currentCategory === category.id;
            const isSelected = selectedCategory === category.id;
            
            if (category.special) {
              // Special scan button (center, elevated)
              return (
                <NavLink
                  key={category.id}
                  to={category.primary}
                  state={category.items[0]?.state}
                  className="flex flex-col items-center justify-center text-xs pt-2 pb-2 min-w-[44px] min-h-[44px] flex-1 focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50 rounded-lg transition-all duration-200"
                  style={{ overflow: 'visible' }}
                  aria-label={category.label}
                >
                  <div 
                    className={`w-14 h-14 ${isActive ? 'bg-brand-tertiary dark:bg-orange-500' : 'bg-brand-tertiary/80 dark:bg-orange-500/80'} rounded-full flex items-center justify-center shadow-lg border-3 border-white dark:border-slate-800 mb-1 transition-all duration-150 ease-out hover:shadow-xl hover:bg-brand-tertiary-dark dark:hover:bg-orange-600 active:scale-95`}
                    style={{ transform: 'translateY(-16px)' }}
                  >
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[10px] ${isActive ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}`}>
                    {category.label}
                  </span>
                </NavLink>
              );
            }
            
            // Regular category buttons
            return (
              <div key={category.id} className="flex flex-col items-center flex-1">
                {category.items.length === 1 ? (
                  // Single item - direct navigation
                  <NavLink
                    to={category.primary}
                    className={`flex flex-col items-center justify-center text-xs pt-3 pb-2 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50 rounded-lg transition-all duration-200 active:scale-95 ${
                      isActive ? 'text-brand-tertiary dark:text-orange-400 font-medium' : 'text-brand-secondary dark:text-slate-400 hover:text-brand-tertiary/80 dark:hover:text-orange-400/80'
                    }`}
                    aria-label={category.label}
                  >
                    <CategoryIcon className={`w-5 h-5 mb-1 ${isActive ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}`} />
                    <span className={`text-[10px] ${isActive ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}`}>
                      {category.label}
                    </span>
                  </NavLink>
                ) : (
                  // Multiple items - show category with sub-navigation
                  <button
                    onClick={(e) => handleCategorySelect(category.id, e)}
                    className={`flex flex-col items-center justify-center text-xs pt-3 pb-2 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50 rounded-lg transition-all duration-200 active:scale-95 ${
                      isActive || isSelected ? 'text-brand-tertiary dark:text-orange-400 font-medium' : 'text-brand-secondary dark:text-slate-400 hover:text-brand-tertiary/80 dark:hover:text-orange-400/80'
                    }`}
                    aria-label={category.label}
                  >
                    <CategoryIcon className={`w-5 h-5 mb-1 ${isActive || isSelected ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}`} />
                    <span className={`text-[10px] ${isActive || isSelected ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}`}>
                      {category.label}
                    </span>
                    {(isActive || isSelected) && category.items.length > 1 && (
                      <div className="absolute -top-1 right-1/2 transform translate-x-1/2">
                        <div className="w-2 h-2 bg-brand-tertiary dark:bg-orange-400 rounded-full"></div>
                      </div>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Sub-Navigation Modal */}
      {selectedCategory && (
        <CategorySubNavigation
          category={mobileCategories.find(cat => cat.id === selectedCategory)}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          currentPath={location.pathname}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;