
import React from 'react';
import { Lightbulb, AlertCircle, CheckSquare, ExternalLink } from 'lucide-react';

interface HelpSidebarProps {
  step: number;
}

const HelpSidebar: React.FC<HelpSidebarProps> = ({ step }) => {
  const content = [
    {
      title: "Business Vetting",
      tips: [
        "Your legal name must match your EIN exactly.",
        "Choosing the right industry helps the AI generate context-aware samples.",
        "Your website MUST be public and have a Privacy Policy."
      ],
      warning: "Mismatching brand names is the #1 cause of rejection."
    },
    {
      title: "Choosing a Use Case",
      tips: [
        "Select 'Marketing' if you send promotions.",
        "Low Volume Mixed is best for small businesses sending multiple message types.",
        "If using Mixed, you must select 2-5 specific intents."
      ],
      warning: "Incorrect use cases lead to immediate campaign failure."
    },
    {
      title: "Sample Messages",
      tips: [
        "Always identify your business in the message.",
        "Include opt-out instructions (STOP) in at least one.",
        "For Mixed campaigns, ensure samples show different use cases."
      ],
      warning: "Vetting agents need to see actual realistic examples."
    },
    {
      title: "Opt-In Proof",
      tips: [
        "Website opt-in must have a clear checkbox.",
        "The checkbox must be UNCHECKED by default.",
        "Include rate and frequency disclosures."
      ],
      warning: "Mobile operators are strict about verifiable consent."
    },
    {
      title: "Before Submitting",
      tips: [
        "Double check for typos in the EIN.",
        "Verify all links in your messages work.",
        "Check your website Privacy Policy for SMS clauses."
      ],
      warning: "Rejections can take another 7 days to clear."
    }
  ];

  const current = content[step] || content[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
          <Lightbulb className="w-5 h-5" />
          <h3 className="font-bold text-slate-900">Expert Guidance</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-xl">
             <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">{current.title}</h4>
             <ul className="space-y-3">
               {current.tips.map((tip, i) => (
                 <li key={i} className="flex gap-2 text-sm text-slate-700 leading-relaxed">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                   {tip}
                 </li>
               ))}
             </ul>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-xs font-medium text-amber-800 leading-normal">{current.warning}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          Requirements Check
        </h3>
        <div className="space-y-3">
          {[
            "Privacy Policy on website",
            "Terms of Service on website",
            "Mobile number collection form",
            "Opt-out language in text"
          ].map((req, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
               <div className="w-4 h-4 rounded border border-slate-300" />
               {req}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
        <h3 className="font-bold mb-2">Need Help?</h3>
        <p className="text-sm text-indigo-100 mb-4 leading-relaxed">Refer to official TCR guidelines for the most up-to-date compliance standards.</p>
        <a 
          href="https://www.campaignregistry.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all font-medium text-sm"
        >
          TCR Documentation
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default HelpSidebar;
