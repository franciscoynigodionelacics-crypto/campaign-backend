import React, { useState, useRef } from 'react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
  const [campaignName, setCampaignName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [beneficiaryDetails, setBeneficiaryDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!campaignName.trim() || !beneficiaryDetails.trim() || !targetAmount) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Map frontend fields to match your 'hc_campaigns' schema
      const payload = {
        title: campaignName,
        target_amount: parseFloat(targetAmount),
        description: beneficiaryDetails,
        collected_amount: 0,
        status: 'pending', // Default status for new campaigns
        cover_image_key: selectedFile ? selectedFile.name : 'default_cover.jpg', // Placeholder logic for now
      };

      const response = await fetch('http://localhost:3001/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      // Success
      if (onSuccess) onSuccess();
      
      // Reset state
      setCampaignName('');
      setTargetAmount('');
      setBeneficiaryDetails('');
      setSelectedFile(null);
      onClose();
      alert('Campaign created successfully!');

    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to backend. Ensure cm-backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#E7D6D3] rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl relative border border-white/20">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-8 text-gray-500 hover:text-black text-2xl"
          disabled={isSubmitting}
        >
          ✕
        </button>
        
        <h2 className="text-[#62312A] text-3xl font-bold text-center mb-8">Create New Campaign</h2>
        
        <div className="space-y-5">
          {/* Upload Section */}
          <div>
            <label className="block text-[#62312A] font-bold mb-2">Upload Campaign Cover Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-[#A7413E]/30 bg-white/50 rounded-2xl p-8 flex flex-col items-center justify-center transition-all hover:bg-white hover:border-[#A7413E]"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div className="text-[#A7413E] mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-[#62312A] font-bold text-lg">
                {selectedFile ? selectedFile.name : 'Drag & Drop or Click to Upload'}
              </p>
              <p className="text-gray-500 text-sm">Support for image files only</p>
            </div>
          </div>

          {/* Campaign Name */}
          <div>
            <label className="block text-[#62312A] font-bold mb-1">Campaign Name</label>
            <input 
              type="text" 
              placeholder="Enter campaign name" 
              value={campaignName} 
              onChange={(e) => setCampaignName(e.target.value)} 
              disabled={isSubmitting}
              className="w-full bg-white text-[#62312A] p-4 rounded-xl border-none focus:ring-2 focus:ring-[#A7413E] shadow-sm" 
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-[#62312A] font-bold mb-1">Target Amount</label>
            <input 
              type="number" 
              placeholder="Enter target amount" 
              value={targetAmount} 
              onChange={(e) => setTargetAmount(e.target.value)} 
              disabled={isSubmitting}
              className="w-full bg-white text-[#62312A] p-4 rounded-xl border-none focus:ring-2 focus:ring-[#A7413E] shadow-sm" 
            />
          </div>

          {/* Beneficiary Details */}
          <div>
            <label className="block text-[#62312A] font-bold mb-1">Beneficiary Details</label>
            <textarea 
              placeholder="Enter beneficiary details" 
              rows={3} 
              value={beneficiaryDetails} 
              onChange={(e) => setBeneficiaryDetails(e.target.value)} 
              disabled={isSubmitting}
              className="w-full bg-white text-[#62312A] p-4 rounded-xl border-none focus:ring-2 focus:ring-[#A7413E] shadow-sm resize-none" 
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="flex-1 bg-[#DDE2E7] text-[#62312A] font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-1 bg-[#A7413E] text-white font-bold py-4 rounded-2xl hover:bg-[#8e3532] shadow-lg shadow-[#A7413E]/30 transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}