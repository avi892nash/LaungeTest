import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react'; // Use type-only import

const API_URL = 'http://localhost:3001/api'; // Ensure this matches your backend

// Define the structure for merchant-specific form data
interface MerchantFormDataState {
  merchantId: string;
  merchantName: string;
  bankName: string;
  // bankLogo will be handled via FormData API
}

// Initial state for the merchant form data
const initialMerchantFormData: MerchantFormDataState = {
  merchantId: '',
  merchantName: '',
  bankName: '',
};

const IntegrateOfferForm: React.FC = () => {
  const [formData, setFormData] = useState<MerchantFormDataState>(initialMerchantFormData);
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
    formPayload.append('id', formData.merchantId);
    formPayload.append('name', formData.merchantName);
    formPayload.append('bankName', formData.bankName);

    // Append bankLogo file
    if (bankLogoInputRef.current?.files?.[0]) {
      formPayload.append('bankLogo', bankLogoInputRef.current.files[0]);
    }
    
    try {
      const response = await fetch(`${API_URL}/integrate-offer`, {
        method: 'POST',
        body: formPayload, 
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage({ type: 'success', message: result.message || 'Merchant integrated successfully!' });
        setFormData(initialMerchantFormData); // Reset form fields
        if (bankLogoInputRef.current) bankLogoInputRef.current.value = '';
      } else {
        setResponseMessage({ type: 'error', message: result.message || 'Failed to integrate merchant.' });
      }
    } catch (error) {
      console.error('Error submitting merchant:', error);
      setResponseMessage({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  return (
    <section id="integrateMerchantSection" className="content-section">
      <h2>Integrate New Merchant</h2>
      <p>Use this form to integrate new merchants onto the platform.</p>
      <form id="merchantForm" onSubmit={handleSubmit}>
        <h3>Merchant Details</h3>
        
        {/* Using a table for layout */}
        <table className="form-table" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td><label htmlFor="merchantId">Merchant ID (Unique):*</label></td>
              <td><input type="text" id="merchantId" name="merchantId" value={formData.merchantId} onChange={handleInputChange} required style={{ width: '100%' }} /></td>
            </tr>
            <tr>
              <td><label htmlFor="merchantName">Merchant Name:*</label></td>
              <td><input type="text" id="merchantName" name="merchantName" value={formData.merchantName} onChange={handleInputChange} required style={{ width: '100%' }} /></td>
            </tr>
            <tr>
              <td><label htmlFor="bankName">Associated Partner/Bank Name:*</label></td>
              <td><input type="text" id="bankName" name="bankName" value={formData.bankName} onChange={handleInputChange} required style={{ width: '100%' }} /></td>
            </tr>
            <tr>
              <td><label htmlFor="bankLogo">Partner/Bank Logo:*</label></td>
              <td><input type="file" id="bankLogo" name="bankLogo" accept="image/*" ref={bankLogoInputRef} required style={{ width: '100%' }} /></td>
            </tr>
          </tbody>
        </table>

        <button type="submit" className="submit-button" style={{ marginTop: '20px' }}>Integrate Merchant</button>
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
