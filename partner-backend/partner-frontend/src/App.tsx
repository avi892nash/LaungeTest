import { useState } from 'react';
import './App.css'; // We might create this later for App-specific styles
import Sidebar from './components/Sidebar';
import IntegrateOfferForm from './components/IntegrateOfferForm';
import ViewPartners from './components/ViewPartners'; // Renamed import
import AddOfferForm from './components/AddOfferForm'; // Import AddOfferForm

type ViewName = 'integrate' | 'view_partners' | 'add_offer'; // Renamed view_merchants

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('integrate');

  const renderView = () => {
    switch (currentView) {
      case 'integrate':
        return <IntegrateOfferForm />;
      case 'view_partners': // Renamed case
        return <ViewPartners />; // Renamed component
      case 'add_offer': // Add case for AddOfferForm
        return <AddOfferForm selectedPartnerId={null} />;
      default:
        return <IntegrateOfferForm />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
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
