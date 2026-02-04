
import React from 'react';
import { MIXED_MESSAGE_TYPES } from '../constants';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

interface MessageTypesSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const MessageTypesSelector: React.FC<MessageTypesSelectorProps> = ({ selectedTypes, onChange, onNext, onBack }) => {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else if (selectedTypes.length < 5) {
      onChange([...selectedTypes, type]);
    }
  };

  const isValid = selectedTypes.length >= 2 && selectedTypes.length <= 5;

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Message Intent</h2>
        <p className="text-slate-500">For mixed campaigns, you must declare the types of messages you intend to send. Select 2-5 categories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MIXED_MESSAGE_TYPES.map(type => {
          const isSelected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
              }`}
            >
              <span className="font-semibold text-sm">{type}</span>
              {isSelected ? (
                <div className="bg-indigo-600 rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-200" />
              )}
            </button>
          );
        })}
      </div>

      {!isValid && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          Please select between 2 and 5 message types for your Mixed campaign.
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
          disabled={!isValid}
          onClick={onNext}
          className={`flex-1 md:flex-none px-8 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
            isValid 
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

export default MessageTypesSelector;
