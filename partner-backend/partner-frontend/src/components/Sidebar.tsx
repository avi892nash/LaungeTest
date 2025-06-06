import React from 'react';

type ViewName = 'integrate' | 'view_partners' | 'add_offer'; // Renamed view_merchants

interface SidebarProps {
  setCurrentView: (view: ViewName) => void;
  currentView: ViewName;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentView, currentView }) => {
  return (
    <nav id="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li>
          <a
            href="#"
            id="navIntegrateOffer"
            className={currentView === 'integrate' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('integrate');
            }}
          >
            Integrate New Partner 
          </a>
        </li>
        <li>
          <a
            href="#"
            id="navViewPartners" 
            className={currentView === 'view_partners' ? 'active' : ''} 
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('view_partners'); 
            }}
          >
            View Partners & Offers 
          </a>
        </li>
        <li>
          <a
            href="#"
            id="navAddOffer"
            className={currentView === 'add_offer' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('add_offer');
            }}
          >
            Add New Offer
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
