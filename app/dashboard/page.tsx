'use client';

import { useState, useEffect } from 'react';
import { Campaign } from '../../types/campaign';
import CampaignCard from '../../components/CampaignCard';
import CreateCampaignModal from '../../components/CreateCampaignModal';
import AdminApprovalModal from '../../components/AdminApprovalModal';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch from our NestJS bridge
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/campaigns');
      if (!response.ok) throw new Error('Backend failed to respond');
      
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    setIsAdminOpen(true);
    fetchCampaigns(); // Re-fetch from Supabase through the backend
  };

  return (
    <div 
      className="min-h-screen bg-[#F2EBED] bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <header className="bg-[#F2EBED]/90 border-b border-[#E7D6D3] p-6 flex justify-between items-center">
        <img src="/images/logo_h.png" alt="Logo" className="h-10 w-10 object-contain" />
        <button 
          onClick={() => setIsCreateOpen(true)} 
          className="bg-[#A7413E] text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:opacity-90"
        >
          + Create New Campaign
        </button>
      </header>

      <main className="p-10 max-w-7xl mx-auto">
        <div className="bg-[#E7D6D3] rounded-2xl p-10 mb-10 shadow-sm">
          <h1 className="text-[#62312A] text-4xl font-extrabold mb-1">My Campaigns</h1>
          <p className="text-[#62312A]">Live data from Supabase</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#62312A] animate-pulse">Connecting to Supabase...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20 text-[#62312A] bg-white/30 rounded-3xl border-2 border-dashed border-[#A7413E]">
            Your Supabase table is currently empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {campaigns.map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        )}
      </main>

      <CreateCampaignModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={handleCreateSuccess} 
      />
      
      <AdminApprovalModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
}