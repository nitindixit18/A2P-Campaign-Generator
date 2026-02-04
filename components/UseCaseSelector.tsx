
import React, { useState } from 'react';
import { USE_CASES, MIXED_MESSAGE_TYPES } from '../constants';
import { Shield, Megaphone, HeartHandshake, Truck, PackageCheck, Search, Info, Check, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface UseCaseSelectorProps {
  onSelect: (id: string) => void;
  currentId: string;
  selectedTypes: string[];
  onMessageTypesChange: (types: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, any> = {
  '2FA': Shield,
  'MARKETING': Megaphone,
  'CUSTOMER_CARE': HeartHandshake,
  'DELIVERY': Truck,
  'LOW_VOLUME_MIXED': PackageCheck
};

const UseCaseSelector: React.FC<UseCaseSelectorProps> = ({ onSelect, currentId, selectedTypes, onMessageTypesChange, onNext, onBack }) => {
  const [search, setSearch] = useState('');

  const filtered = USE_CASES.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onMessageTypesChange(selectedTypes.filter(t => t !== type));
    } else if (selectedTypes.length < 5) {
      onMessageTypesChange([...selectedTypes, type]);
    }
  };

  const isMixedSelected = currentId === 'LOW_VOLUME_MIXED';
  const isMixedValid = selectedTypes.length >= 2 && selectedTypes.length <= 5;
  const canContinue = currentId && (!isMixedSelected || isMixedValid);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Campaign Use Case</h2>
        <p className="text-slate-500">Select the primary reason for sending messages. Your choice determines the compliance requirements.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search use cases..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(uc => {
          const Icon = ICON_MAP[uc.id] || Info;
          const isSelected = currentId === uc.id;

          return (
            <button
              key={uc.id}
              onClick={() => onSelect(uc.id)}
              className={`group flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50 shadow-md ring-4 ring-indigo-50' 
                  : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-3 rounded-xl transition-colors ${
                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{uc.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    uc.category === 'Standard' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {uc.category}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{uc.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {isMixedSelected && (
        <div className="mt-8 p-6 rounded-2xl bg-indigo-50 border-2 border-indigo-100 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Check className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-bold text-indigo-900">Declare Message Intents</h3>
                <p className="text-sm text-indigo-700">Select 2-5 categories of messages you intend to send.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MIXED_MESSAGE_TYPES.map(type => {
              const isSelected = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-indigo-600 bg-white text-indigo-900 shadow-sm' 
                      : 'border-white bg-white/50 hover:bg-white text-slate-600'
                  }`}
                >
                  <span className="font-semibold text-xs">{type}</span>
                  {isSelected ? (
                    <div className="bg-indigo-600 rounded-full p-1">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-200" />
                  )}
                </button>
              );
            })}
          </div>

          {!isMixedValid && (
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              Please select at least 2 and at most 5 intents.
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          disabled={!canContinue}
          onClick={onNext}
          className={`flex-1 md:flex-none px-8 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
            canContinue 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Generate Campaign Content
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UseCaseSelector;
