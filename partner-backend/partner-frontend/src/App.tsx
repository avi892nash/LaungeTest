import { useState } from 'react';
import './App.css'; // We might create this later for App-specific styles
import Sidebar from './components/Sidebar';
import IntegrateOfferForm from './components/IntegrateOfferForm';
import ViewMerchants from './components/ViewMerchants';
import AddOfferForm from './components/AddOfferForm'; // Import AddOfferForm

type ViewName = 'integrate' | 'view_merchants' | 'add_offer'; // Add 'add_offer'

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('integrate');

  const renderView = () => {
    switch (currentView) {
      case 'integrate':
        return <IntegrateOfferForm />;
      case 'view_merchants':
        return <ViewMerchants />;
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
