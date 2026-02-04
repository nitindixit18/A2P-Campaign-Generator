
import React from 'react';
import { CampaignData, BusinessInfo } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

interface CampaignContentFormProps {
  business: BusinessInfo;
  campaign: CampaignData;
  update: (data: Partial<CampaignData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CampaignContentForm: React.FC<CampaignContentFormProps> = ({ business, campaign, update, onNext, onBack }) => {
  const charCount = campaign.description.length;
  const isOptimalLength = charCount >= 150 && charCount <= 500;

  const brandName = business.dbaName || business.legalName;
  const sample1HasBrand = campaign.sample1.toLowerCase().includes(brandName.toLowerCase());
  const sample2HasBrand = campaign.sample2.toLowerCase().includes(brandName.toLowerCase());
  const hasOptOut = campaign.sample1.toLowerCase().includes('stop') || campaign.sample2.toLowerCase().includes('stop');

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-slate-900">Campaign Content</h2>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI Assisted
          </div>
        </div>
        <p className="text-slate-500">Review and refine your campaign details. These must perfectly align with your business type.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-700">Campaign Description</label>
          <span className={`text-xs font-bold ${isOptimalLength ? 'text-emerald-600' : 'text-amber-600'}`}>
            {charCount}/500 chars (150-500 recommended)
          </span>
        </div>
        <textarea
          value={campaign.description}
          onChange={e => update({ description: e.target.value })}
          className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
        />
        {charCount < 150 && (
          <div className="flex items-center gap-2 text-amber-600 text-xs font-medium">
            <AlertCircle className="w-4 h-4" />
            Description is too short. Vetting agents prefer more detail about your audience and message frequency.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-900">
            <MessageSquare className="w-5 h-5" />
            <label className="block text-sm font-bold">Sample Message 1</label>
          </div>
          <textarea
            value={campaign.sample1}
            onChange={e => update({ sample1: e.target.value })}
            className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <div className="flex flex-wrap gap-2">
            {!sample1HasBrand && (
              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded uppercase">Missing Brand Name</span>
            )}
            {sample1HasBrand && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">Brand Included</span>
            )}
            {campaign.sample1.toLowerCase().includes('stop') && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">Opt-out Included</span>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-900">
            <MessageSquare className="w-5 h-5" />
            <label className="block text-sm font-bold">Sample Message 2</label>
          </div>
          <textarea
            value={campaign.sample2}
            onChange={e => update({ sample2: e.target.value })}
            className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <div className="flex flex-wrap gap-2">
            {!sample2HasBrand && (
              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded uppercase">Missing Brand Name</span>
            )}
            {sample2HasBrand && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">Brand Included</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          Configure Opt-In
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CampaignContentForm;
