import React from 'react';
import { Campaign } from '../types/campaign';

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  // Use optional chaining and default to 0 to prevent math errors
  const raised = campaign?.raised ?? 0;
  const goal = campaign?.goal ?? 0;
  const donors = campaign?.donors ?? 0;
  const status = campaign?.status ?? 'Pending';

  const progressPercentage = goal > 0 ? (raised / goal) * 100 : 0;

  // Safety check for status colors
  const statusColors: Record<string, string> = { 
    Active: 'bg-[#00D05C]', 
    Pending: 'bg-[#F2BA11]', 
    Completed: 'bg-[#6D7781]' 
  };

  return (
    <div className="bg-[#E7D6D3]/90 rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[#62312A] text-xl font-extrabold flex-1 mr-4">
          {campaign?.title || "Untitled Campaign"}
        </h3>
        <span className={`${statusColors[status] || 'bg-gray-400'} text-white text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap`}>
          {status}
        </span>
      </div>
      
      <p className="text-[#62312A] text-sm mb-6">
        Beneficiary: {campaign?.beneficiary || "Not specified"}
      </p>

      <div className="text-[#A7413E] text-sm mb-1.5 flex items-end">
        {/* Added safety to toLocaleString() */}
        <span className="text-3xl font-extrabold mr-1.5">
          ${raised.toLocaleString()}
        </span>
        <span>
          raised of ${goal.toLocaleString()}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
        <div 
          className="bg-[#A7413E] h-1 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        ></div>
      </div>

      <div className="flex items-center text-[#62312A] text-sm gap-2 mb-8">
        <span>👥 {donors} donors</span>
        <span className="ml-auto">📅 {campaign?.endDate || 'TBD'}</span>
      </div>

      <div className="flex gap-4 mt-auto">
        <button className="flex-1 bg-[#A7413E] text-white text-sm font-semibold py-3.5 rounded-xl transition hover:opacity-90">
          View Details
        </button>
        <button className="flex-1 bg-[#A4C0D4] text-[#62312A] text-sm font-semibold py-3.5 rounded-xl transition hover:opacity-90">
          Edit
        </button>
      </div>
    </div>
  );
}