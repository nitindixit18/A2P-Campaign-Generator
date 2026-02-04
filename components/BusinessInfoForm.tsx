
import React from 'react';
import { BusinessInfo, BusinessType } from '../types';
import { BUSINESS_TYPES, INDUSTRIES } from '../constants';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface BusinessInfoFormProps {
  data: BusinessInfo;
  update: (data: Partial<BusinessInfo>) => void;
  onNext: () => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ data, update, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isSoleProp = data.businessType === BusinessType.SOLE_PROPRIETOR;
  const domainMismatch = data.email && data.website && !data.email.toLowerCase().includes(data.website.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').split('/')[0]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="border-b border-slate-100 pb-6 mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Business Information</h2>
        <p className="text-slate-500">Provide the official details for your brand registration. Accuracy here is critical for TCR vetting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Legal Business Name <span className="text-rose-500">*</span></label>
          <input
            required
            type="text"
            value={data.legalName}
            onChange={e => update({ legalName: e.target.value })}
            placeholder="e.g., Acme Corp LLC"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <p className="text-[11px] text-slate-400">Must match your official tax records exactly.</p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">DBA / Brand Name</label>
          <input
            type="text"
            value={data.dbaName}
            onChange={e => update({ dbaName: e.target.value })}
            placeholder="e.g., Acme Solutions"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Business Industry / Niche <span className="text-rose-500">*</span></label>
          <select
            required
            value={data.industry}
            onChange={e => update({ industry: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          >
            <option value="">Select Industry...</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            {isSoleProp ? 'EIN or SSN' : 'EIN / Tax ID'} {!isSoleProp && <span className="text-rose-500">*</span>}
          </label>
          <input
            required={!isSoleProp}
            type="text"
            pattern={isSoleProp ? "(\\d{2}-\\d{7}|\\d{3}-\\d{2}-\\d{4})?" : "\\d{2}-\\d{7}"}
            value={data.ein}
            onChange={e => update({ ein: e.target.value })}
            placeholder={isSoleProp ? "XX-XXXXXXX or XXX-XX-XXXX" : "XX-XXXXXXX"}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <p className="text-[11px] text-slate-400">
            {isSoleProp ? 'Optional for Sole Proprietors. Use EIN or SSN format.' : 'Required for business entities. Format: XX-XXXXXXX.'}
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Business Type <span className="text-rose-500">*</span></label>
          <select
            required
            value={data.businessType}
            onChange={e => update({ businessType: e.target.value as any })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          >
            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Business Website URL <span className="text-rose-500">*</span></label>
          <input
            required
            type="url"
            value={data.website}
            onChange={e => update({ website: e.target.value })}
            placeholder="https://acme.com"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">Contact Email <span className="text-rose-500">*</span></label>
          <input
            required
            type="email"
            value={data.email}
            onChange={e => update({ email: e.target.value })}
            placeholder="admin@acme.com"
            className={`w-full px-4 py-2.5 rounded-lg border ${domainMismatch ? 'border-amber-400' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
          />
          {domainMismatch && (
            <div className="flex items-center gap-1.5 mt-1 text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium leading-none">Email domain mismatch with website URL</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          Select Campaign Type
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default BusinessInfoForm;
