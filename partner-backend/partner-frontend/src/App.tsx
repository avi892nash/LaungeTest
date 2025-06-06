import { useState } from 'react';
import './App.css'; // We might create this later for App-specific styles
import Sidebar from './components/Sidebar';
import IntegrateOfferForm from './components/IntegrateOfferForm';
import ViewPartners from './components/ViewPartners'; // Renamed import
import AddOfferForm from './components/AddOfferForm'; // Import AddOfferForm

type ViewName = 'integrate' | 'view_partners' | 'add_offer'; // Renamed view_merchants

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('integrate');
  const [selectedPartnerIdForNewOffer, setSelectedPartnerIdForNewOffer] = useState<string | null>(null);

  const handleSetCurrentView = (view: ViewName) => {
    // If navigating away from a view that uses selectedPartnerId, reset it
    if (view !== 'add_offer' && view !== 'view_partners') {
      setSelectedPartnerIdForNewOffer(null);
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'integrate':
        return <IntegrateOfferForm />;
      case 'view_partners': // Renamed case
        return <ViewPartners setCurrentView={handleSetCurrentView} setSelectedPartnerIdForNewOffer={setSelectedPartnerIdForNewOffer} />; 
      case 'add_offer': // Add case for AddOfferForm
        return <AddOfferForm selectedPartnerId={selectedPartnerIdForNewOffer} />;
      default:
        return <IntegrateOfferForm />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar setCurrentView={handleSetCurrentView} currentView={currentView} />
      <main id="mainContentArea">
        <header>
          <h1>Partner Offer Management</h1>
        </header>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
