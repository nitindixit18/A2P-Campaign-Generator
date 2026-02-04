
import React from 'react';
import { CampaignData, BusinessInfo, OptInMethod } from '../types';
import { OPT_IN_METHODS } from '../constants';
import { ChevronLeft, ChevronRight, MousePointer2, Smartphone, Globe, Clipboard } from 'lucide-react';

interface OptInSetupFormProps {
  business: BusinessInfo;
  campaign: CampaignData;
  update: (data: Partial<CampaignData>) => void;
  onNext: () => void;
  onBack: () => void;
  onToast: (msg: string) => void;
}

const OptInSetupForm: React.FC<OptInSetupFormProps> = ({ business, campaign, update, onNext, onBack, onToast }) => {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onToast(`${label} copied!`);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Opt-In Configuration</h2>
        <p className="text-slate-500">How do your customers agree to receive messages? TCR requires explicit, verifiable consent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Consent Method</label>
            <div className="grid grid-cols-2 gap-2">
              {OPT_IN_METHODS.map(m => (
                <button
                  key={m}
                  onClick={() => update({ optInMethod: m })}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                    campaign.optInMethod === m 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Opt-In Flow Description</label>
            <textarea
              value={campaign.optInFlow}
              onChange={e => update({ optInFlow: e.target.value })}
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm leading-relaxed"
              placeholder="Explain step-by-step how users provide their number and consent..."
            />
          </div>

          {campaign.optInMethod === OptInMethod.KEYWORD && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Opt-In Keywords</label>
              <input
                type="text"
                value={campaign.keywords}
                onChange={e => update({ keywords: e.target.value })}
                placeholder="START, JOIN, YES"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-indigo-900 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Smartphone className="w-24 h-24" />
             </div>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <Globe className="w-5 h-5" />
               Consent Language (Checkbox)
             </h3>
             <div className="bg-indigo-800/50 p-4 rounded-xl border border-indigo-700 mb-4">
               <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded border-2 border-indigo-400 flex-shrink-0" />
                  <p className="text-sm leading-relaxed text-indigo-100 italic">"{campaign.consentMessage}"</p>
               </div>
             </div>
             <button 
              onClick={() => handleCopy(campaign.consentMessage, "Consent language")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               <Clipboard className="w-4 h-4" />
               Copy Checkbox Language
             </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <MousePointer2 className="w-24 h-24" />
             </div>
             <h3 className="text-lg font-bold mb-4">Opt-In Confirmation</h3>
             <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 mb-4">
                <p className="text-sm leading-relaxed text-slate-200 font-mono">"{campaign.confirmationMessage}"</p>
             </div>
             <button 
               onClick={() => handleCopy(campaign.confirmationMessage, "Confirmation text")}
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               <Clipboard className="w-4 h-4" />
               Copy Confirmation Text
             </button>
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
          Review Summary
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default OptInSetupForm;
