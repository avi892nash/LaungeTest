import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react'; // Use type-only import

// Construct the API path. If VITE_API_BASE_URL is defined, use it as a prefix for /api.
// Otherwise, assume /api is a relative path (e.g., for proxy or same-origin deployment).
const API_PREFIX = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

// Define the structure for partner-specific form data
interface PartnerFormDataState { // Renamed
  partnerId: string; // Renamed
  partnerName: string; // Renamed
  // bankName: string; // Removed as per user feedback
  // bankLogo will be handled via FormData API
}

// Initial state for the partner form data
const initialPartnerFormData: PartnerFormDataState = { // Renamed
  partnerId: '', // Renamed
  partnerName: '', // Renamed
  // bankName: '', // Removed as per user feedback
};

const IntegrateOfferForm: React.FC = () => {
  const [formData, setFormData] = useState<PartnerFormDataState>(initialPartnerFormData); // Renamed
  const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Ref for bankLogo file input
  const bankLogoInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponseMessage(null);

    const formPayload = new FormData();

    // Map frontend state to backend expected field names
    formPayload.append('id', formData.partnerId); // Renamed formData property
    formPayload.append('name', formData.partnerName); // Renamed formData property
    // bankName is now optional on the backend and not sent from frontend

    // Append bankLogo file
    if (bankLogoInputRef.current?.files?.[0]) {
      formPayload.append('bankLogo', bankLogoInputRef.current.files[0]);
    }
    
    try {
      const response = await fetch(`${API_PREFIX}/integrate-partner`, { // Renamed endpoint
        method: 'POST',
        body: formPayload, 
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage({ type: 'success', message: result.message || 'Partner integrated successfully!' }); // Renamed
        setFormData(initialPartnerFormData); // Reset form fields, Renamed
        if (bankLogoInputRef.current) bankLogoInputRef.current.value = '';
      } else {
        setResponseMessage({ type: 'error', message: result.message || 'Failed to integrate partner.' }); // Renamed
      }
    } catch (error) {
      console.error('Error submitting partner:', error); // Renamed
      setResponseMessage({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  return (
    <section id="integratePartnerSection" className="content-section"> {/* Renamed id */}
      <h2>Integrate New Partner</h2> {/* Renamed text */}
      <p>Use this form to integrate new partners onto the platform.</p> {/* Renamed text */}
      <form id="partnerForm" onSubmit={handleSubmit}> {/* Renamed id */}
        <h3>Partner Details</h3> {/* Renamed text */}
        
        {/* Using a table for layout */}
        <table className="form-table" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td><label htmlFor="partnerId">Partner ID (Unique):*</label></td> {/* Renamed htmlFor, text */}
              <td><input type="text" id="partnerId" name="partnerId" value={formData.partnerId} onChange={handleInputChange} required style={{ width: '100%' }} /></td> {/* Renamed id, name, value */}
            </tr>
            <tr>
              <td><label htmlFor="partnerName">Partner Name:*</label></td> {/* Renamed htmlFor, text */}
              <td><input type="text" id="partnerName" name="partnerName" value={formData.partnerName} onChange={handleInputChange} required style={{ width: '100%' }} /></td> {/* Renamed id, name, value */}
            </tr>
            {/* Bank Name row removed as per user feedback */}
            <tr>
              <td><label htmlFor="bankLogo">Partner/Bank Logo:*</label></td>
              <td><input type="file" id="bankLogo" name="bankLogo" accept="image/*" ref={bankLogoInputRef} required style={{ width: '100%' }} /></td>
            </tr>
          </tbody>
        </table>

        <button type="submit" className="submit-button" style={{ marginTop: '20px' }}>Integrate Partner</button> {/* Renamed text */}
      </form>
      {responseMessage && (
        <div 
          id="responseMessage" 
          className={`form-response-message ${responseMessage.type}`}
        >
          {responseMessage.message}
        </div>
      )}
    </section>
  );
};

export default IntegrateOfferForm;
