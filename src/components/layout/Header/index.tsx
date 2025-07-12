
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; 
import { IconHome, IconListBullet, IconSmoothMovesLogo, IconSettings } from '@/lib/config/constants'; 
import { FaTruck } from 'react-icons/fa'; 
import { FaUserGroup, FaHouseUser } from 'react-icons/fa6';
import { BsQrCodeScan } from 'react-icons/bs'; 

const Navbar: React.FC = () => {
  const location = useLocation();
  const desktopNavLinks = [
    { to: "/app", label: "Dashboard", icon: IconHome },
    { to: "/app/boxes", label: "Manifest", icon: IconListBullet }, 
    { to: "/app/owners", label: "Owners", icon: FaUserGroup },
    { to: "/app/spaces", label: "Spaces", icon: FaHouseUser }, 
    { to: "/app/truck-load", label: "Truck Load", icon: FaTruck }, 
    { to: "/app/scan", label: "Quick Scan", icon: BsQrCodeScan, state: { isQuickScanMode: true } }, 
    { to: "/app/settings", label: "Settings", icon: IconSettings },
  ];

  // Ensure all links start with /app
  const desktopNavLinksUpdated = desktopNavLinks.map(link => ({
    ...link,
    to: link.to.startsWith('/app') ? link.to : `/app${link.to === '/' ? '' : link.to}`
  }));

  const desktopLinkClass = "flex items-center px-3 py-3 rounded-lg text-base font-medium text-brand-light-gray dark:text-slate-300 hover:bg-brand-primary-dark dark:hover:bg-slate-700 hover:text-white dark:hover:text-slate-100 transition-all duration-150 ease-in-out w-full transform hover:scale-105";
  const desktopActiveLinkClass = "bg-brand-tertiary dark:bg-orange-500 text-white dark:text-white shadow-md scale-105";

  const bottomNavLinks = [
    { to: "/app", label: "Dashboard", icon: IconHome },
    { to: "/app/truck-load", label: "Truck", icon: FaTruck }, 
    { to: "/app/scan", label: "Quick Scan", icon: BsQrCodeScan, special: true, state: { isQuickScanMode: true } }, 
    { to: "/app/owners", label: "Owners", icon: FaUserGroup },
    { to: "/app/spaces", label: "Spaces", icon: FaHouseUser }, 
  ];
  
  // Ensure all bottom nav links start with /app
  const uniqueBottomNavLinksUpdated = bottomNavLinks.map(link => ({
    ...link,
    to: link.to.startsWith('/app') ? link.to : `/app${link.to === '/' ? '' : link.to}`
  }));


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

      {/* --- Mobile Top Bar (Sticky, for branding when sidebar is hidden) --- */}
      <nav className="bg-brand-primary dark:bg-slate-800 shadow-lg sticky top-0 z-30 md:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center"> 
  
              <NavLink 
                to="/app"
                className="flex items-center text-white dark:text-slate-100 font-bold text-xl hover:opacity-80 transition-opacity"
              >
                <IconSmoothMovesLogo className="h-8 w-8 mr-2 text-brand-tertiary dark:text-orange-400" />
              </NavLink>
            </div>
            <div className="flex items-center">
              <NavLink 
                to="/app/settings" // Updated to /app/settings
                className="p-2 text-white dark:text-slate-200 hover:text-brand-tertiary dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 rounded-full transition-colors duration-150"
                aria-label="Settings"
              >
                <IconSettings className="h-6 w-6" />
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Bottom Navigation Bar (Fixed) --- */}
      <div className="md:hidden h-16"></div> {/* Spacer for fixed bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-1px_3px_rgba(0,0,0,0.07)] dark:shadow-[0_-1px_3px_rgba(255,255,255,0.05)]">
        <div className="flex justify-around items-end h-16 px-1 sm:px-2">
          {uniqueBottomNavLinksUpdated.map((linkInfo) => {
            const LinkIcon = linkInfo.icon;
            if (linkInfo.special) {
              return (
                <NavLink
                  key={linkInfo.label}
                  to={linkInfo.to}
                  state={linkInfo.state} 
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center text-xs pt-2 pb-1 w-1/${uniqueBottomNavLinksUpdated.length} focus:outline-none focus:opacity-100 transition-opacity ${
                      isActive ? 'text-brand-tertiary dark:text-orange-400 font-medium' : 'text-brand-secondary dark:text-slate-400 hover:text-brand-tertiary/80 dark:hover:text-orange-400/80'
                    }`
                  }
                  style={{ overflow: 'visible' }} 
                >
                  <div 
                    className={`w-16 h-16 ${linkInfo.to === location.pathname ? 'bg-brand-tertiary dark:bg-orange-500' : 'bg-brand-tertiary/80 dark:bg-orange-500/80'} rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 mb-0.5 transition-all duration-150 ease-out hover:shadow-xl hover:bg-brand-tertiary-dark dark:hover:bg-orange-600`}
                    style={{ transform: 'translateY(-20px)' }} 
                  >
                    <LinkIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <span className={`mt-0.5 ${linkInfo.to === location.pathname ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}`}>{linkInfo.label}</span>
                </NavLink>
              );
            }
            return (
              <NavLink
                key={linkInfo.label}
                to={linkInfo.to}
                end={linkInfo.to === "/app/"} // Add end prop for dashboard link
                state={linkInfo.state} 
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center text-xs pt-2 pb-1 w-1/${uniqueBottomNavLinksUpdated.length} focus:outline-none focus:opacity-100 transition-opacity ${ 
                    isActive ? 'text-brand-tertiary dark:text-orange-400 font-medium' : 'text-brand-secondary dark:text-slate-400 hover:text-brand-tertiary/80 dark:hover:text-orange-400/80'
                  }`
                }
              >
                <LinkIcon className={`w-6 h-6 mb-0.5 ${linkInfo.to === location.pathname ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}`} />
                <span className={linkInfo.to === location.pathname ? 'text-brand-tertiary dark:text-orange-400' : 'text-brand-secondary dark:text-slate-400'}>{linkInfo.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;