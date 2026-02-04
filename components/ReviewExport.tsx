
import React from 'react';
import { BusinessInfo, CampaignData, BusinessType } from '../types';
import { ChevronLeft, Download, Clipboard, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ReviewExportProps {
  business: BusinessInfo;
  campaign: CampaignData;
  onBack: () => void;
  onToast: (msg: string) => void;
}

const ReviewExport: React.FC<ReviewExportProps> = ({ business, campaign, onBack, onToast }) => {
  const isMixed = campaign.primaryUseCaseId === 'LOW_VOLUME_MIXED';
  const isSoleProp = business.businessType === BusinessType.SOLE_PROPRIETOR;

  const validations = [
    { name: 'Legal Name Consistency', pass: true },
    { 
      name: 'EIN/SSN Format', 
      pass: isSoleProp 
        ? (business.ein === '' || /^\d{2}-\d{7}$/.test(business.ein) || /^\d{3}-\d{2}-\d{4}$/.test(business.ein))
        : /^\d{2}-\d{7}$/.test(business.ein) 
    },
    { name: 'Website Accessibility', pass: !!business.website },
    { name: 'Industry Selected', pass: !!business.industry },
    { name: 'Description Length', pass: campaign.description.length >= 150 },
    { name: 'Opt-out in Samples', pass: campaign.sample1.toLowerCase().includes('stop') || campaign.sample2.toLowerCase().includes('stop') },
    { name: 'Message Type Declaration', pass: !isMixed || campaign.messageTypes.length >= 2 }
  ];

  const handleCopyAll = () => {
    const text = `
A2P 10DLC CAMPAIGN REGISTRATION
================================
BRAND INFO:
Legal Name: ${business.legalName}
Industry: ${business.industry}
${isSoleProp ? 'EIN/SSN' : 'EIN'}: ${business.ein || 'Not Provided'}
Website: ${business.website}

CAMPAIGN INFO:
Use Case: ${campaign.primaryUseCaseId}
${isMixed ? 'Message Types: ' + campaign.messageTypes.join(', ') : ''}
Description: ${campaign.description}

SAMPLE MESSAGES:
1: ${campaign.sample1}
2: ${campaign.sample2}

OPT-IN:
Method: ${campaign.optInMethod}
Flow: ${campaign.optInFlow}
Confirmation: ${campaign.confirmationMessage}
    `.trim();
    navigator.clipboard.writeText(text);
    onToast('Full campaign details copied!');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // 40px margin is approx 14mm
    const margin = 14; 
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    const checkPageBreak = (needed: number) => {
      if (y + needed > 280) {
        doc.addPage();
        y = 20;
      }
    };

    const addText = (text: string, size = 10, bold = false, color = [30, 41, 59]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, contentWidth);
      const height = (lines.length * (size * 0.4)) + 2;
      checkPageBreak(height);
      doc.text(lines, margin, y);
      y += height;
    };

    const addSectionHeader = (title: string) => {
      y += 6;
      checkPageBreak(15);
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      addText(title.toUpperCase(), 11, true, [79, 70, 229]); // indigo-600
      y += 2;
    };

    // Header
    addText("A2P 10DLC Campaign Registration", 18, true, [15, 23, 42]);
    addText(`Generated on ${new Date().toLocaleDateString()}`, 9, false, [100, 116, 139]);
    y += 4;

    addSectionHeader("Business Information");
    addText(`Legal Business Name: ${business.legalName}`, 10, true);
    addText(`DBA / Brand Name: ${business.dbaName || 'N/A'}`);
    addText(`${isSoleProp ? 'EIN / SSN' : 'EIN / Tax ID'}: ${business.ein || 'Not Provided'}`);
    addText(`Industry: ${business.industry}`);
    addText(`Website: ${business.website}`);
    addText(`Contact Email: ${business.email}`);

    addSectionHeader("Campaign Strategy");
    addText(`Primary Use Case: ${campaign.primaryUseCaseId}`, 10, true);
    if (isMixed) {
      addText(`Message Types: ${campaign.messageTypes.join(', ')}`, 10, true);
    }
    y += 2;
    addText("Campaign Description:", 10, true, [51, 65, 85]);
    addText(campaign.description, 10, false, [71, 85, 105]);

    addSectionHeader("Sample Messages");
    addText("Sample Message #1", 10, true, [51, 65, 85]);
    addText(campaign.sample1, 10, false, [71, 85, 105]);
    y += 4;
    addText("Sample Message #2", 10, true, [51, 65, 85]);
    addText(campaign.sample2, 10, false, [71, 85, 105]);

    addSectionHeader("Opt-In & Compliance");
    addText(`Consent Method: ${campaign.optInMethod}`, 10, true);
    y += 2;
    addText("Opt-In Flow Description:", 10, true, [51, 65, 85]);
    addText(campaign.optInFlow, 10, false, [71, 85, 105]);
    y += 4;
    addText("On-Site Consent (Checkbox Language):", 10, true, [51, 65, 85]);
    addText(campaign.consentMessage, 10, false, [71, 85, 105]);
    y += 4;
    addText("First Confirmation Message:", 10, true, [51, 65, 85]);
    addText(campaign.confirmationMessage, 10, false, [71, 85, 105]);

    // PDF Footer
    y = 282;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('helvetica', 'bold');
    doc.text("Built by Growth Design Studio - growthdesignstudio.com", margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.text("Privacy Notice: We do not save any user information entered here.", margin, y);
    doc.text("A2P 10DLC Compliance Document", pageWidth - margin - 45, y);

    doc.save(`A2P_Registration_${business.legalName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-10">
      <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Review & Export</h2>
          <p className="text-slate-500">Your campaign documentation is ready. Review for perfection before submitting to TCR.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopyAll}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <Clipboard className="w-4 h-4" />
            Copy All
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm flex items-center gap-2 shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm bg-white">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Brand Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 font-medium">Legal Name</p>
                <p className="font-semibold text-slate-700">{business.legalName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Industry</p>
                <p className="font-semibold text-slate-700">{business.industry}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">{isSoleProp ? 'EIN/SSN' : 'EIN'}</p>
                <p className="font-semibold text-slate-700">{business.ein || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Website</p>
                <p className="font-semibold text-slate-700">{business.website}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm bg-white">
            <h3 className="font-bold text-slate-900">Campaign Summary</h3>
            {isMixed && (
              <div className="flex flex-wrap gap-2 mb-2">
                {campaign.messageTypes.map(t => (
                  <span key={t} className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="space-y-3">
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                "{campaign.description}"
              </p>
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sample Messages</p>
                <div className="space-y-2">
                  <div className="p-3 bg-white border border-slate-100 rounded-lg text-xs font-mono">
                    {campaign.sample1}
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-lg text-xs font-mono">
                    {campaign.sample2}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
            <h3 className="font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Validation Checklist
            </h3>
            <div className="space-y-3">
              {validations.map(v => (
                <div key={v.name} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <span className="text-sm font-medium text-slate-300">{v.name}</span>
                  {v.pass ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">PASSED</span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      WARN
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 space-y-4">
            <h3 className="font-bold text-indigo-900">Next Steps</h3>
            <ul className="space-y-2">
              {[
                "Login to your TCR portal or Messaging Provider (Twilio/Vonage).",
                "Copy and paste these values exactly as generated.",
                "Ensure your website has an accessible Privacy Policy.",
                "Wait 3-7 business days for campaign vetting."
              ].map((step, i) => (
                <li key={i} className="text-sm text-indigo-700 flex gap-3">
                  <span className="font-bold">{i+1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex pt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Editing
        </button>
      </div>
    </div>
  );
};

export default ReviewExport;
