
import React, { useState, useEffect } from 'react';
import { BusinessInfo, CampaignData, AppState, BusinessType, EntityType, OptInMethod } from './types';
import { STEPS, USE_CASES } from './constants';
import { generateCampaignContent } from './services/geminiService';
import BusinessInfoForm from './components/BusinessInfoForm';
import UseCaseSelector from './components/UseCaseSelector';
import CampaignContentForm from './components/CampaignContentForm';
import OptInSetupForm from './components/OptInSetupForm';
import ReviewExport from './components/ReviewExport';
import ProgressBar from './components/ProgressBar';
import HelpSidebar from './components/HelpSidebar';
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, Save, Check, Sparkles } from 'lucide-react';

const INITIAL_BUSINESS: BusinessInfo = {
  legalName: '',
  dbaName: '',
  ein: '',
  businessType: BusinessType.LLC,
  entityType: EntityType.PRIVATE,
  address: '',
  city: '',
  state: '',
  zip: '',
  website: '',
  email: '',
  phone: '',
  industry: ''
};

const INITIAL_CAMPAIGN: CampaignData = {
  primaryUseCaseId: '',
  messageTypes: [],
  description: '',
  sample1: '',
  sample2: '',
  optInMethod: OptInMethod.WEBSITE,
  optInFlow: '',
  consentMessage: '',
  confirmationMessage: '',
  keywords: ''
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('a2p_generator_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force isGenerating to false so user isn't stuck on refresh
        return { ...parsed, isGenerating: false };
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
    return {
      step: 0,
      business: { ...INITIAL_BUSINESS },
      campaign: { ...INITIAL_CAMPAIGN },
      isGenerating: false
    };
  });

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Persistent storage of form state
  useEffect(() => {
    localStorage.setItem('a2p_generator_state', JSON.stringify(state));
  }, [state]);

  const showToast = (message: string) => setToast(message);

  const updateBusiness = (data: Partial<BusinessInfo>) => {
    setState(prev => ({ ...prev, business: { ...prev.business, ...data } }));
  };

  const updateCampaign = (data: Partial<CampaignData>) => {
    setState(prev => ({ ...prev, campaign: { ...prev.campaign, ...data } }));
  };

  const isMixed = state.campaign.primaryUseCaseId === 'LOW_VOLUME_MIXED';

  const nextStep = () => {
    setState(prev => ({ ...prev, step: Math.min(prev.step + 1, STEPS.length - 1) }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
  };

  const handleReset = () => {
    if (confirm('Clear all progress and start over? This will reset all fields to blank.')) {
      localStorage.removeItem('a2p_generator_state');
      setState({
        step: 0,
        business: { ...INITIAL_BUSINESS },
        campaign: { ...INITIAL_CAMPAIGN },
        isGenerating: false
      });
      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  const handleGenerate = async () => {
    const useCase = USE_CASES.find(u => u.id === state.campaign.primaryUseCaseId);
    if (!useCase) return;

    if (isMixed && (state.campaign.messageTypes.length < 2 || state.campaign.messageTypes.length > 5)) {
      alert("Please select 2-5 message intents for Low Volume Mixed campaign.");
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      const aiContent = await generateCampaignContent(state.business, useCase, state.campaign);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        campaign: {
          ...prev.campaign,
          ...aiContent
        }
      }));
      nextStep();
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("AI Generation failed", error);
      setState(prev => ({ ...prev, isGenerating: false }));
      nextStep();
      window.scrollTo(0, 0);
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return <BusinessInfoForm data={state.business} update={updateBusiness} onNext={nextStep} />;
      case 1:
        return (
          <UseCaseSelector 
            onSelect={useCaseId => updateCampaign({ primaryUseCaseId: useCaseId })} 
            currentId={state.campaign.primaryUseCaseId}
            selectedTypes={state.campaign.messageTypes}
            onMessageTypesChange={types => updateCampaign({ messageTypes: types })}
            onNext={handleGenerate}
            onBack={prevStep}
          />
        );
      case 2:
        return <CampaignContentForm business={state.business} campaign={state.campaign} update={updateCampaign} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <OptInSetupForm business={state.business} campaign={state.campaign} update={updateCampaign} onNext={nextStep} onBack={prevStep} onToast={showToast} />;
      case 4:
        return <ReviewExport business={state.business} campaign={state.campaign} onBack={prevStep} onToast={showToast} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="bg-emerald-500 rounded-full p-1">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <span className="font-bold text-sm">{toast}</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-100">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">A2P 10DLC</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Campaign Generator</p>
            </div>
          </div>
          <div className="hidden md:block flex-1 max-w-2xl px-8">
            <ProgressBar steps={STEPS} currentStep={state.step} />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleReset}
              className="text-slate-500 hover:text-rose-600 text-sm font-semibold transition-colors"
            >
              Reset
            </button>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Save className="w-3.5 h-3.5" />
              Saved
            </div>
          </div>
        </div>
        <div className="md:hidden mt-4 px-4">
          <ProgressBar steps={STEPS} currentStep={state.step} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8">
        <div className="lg:col-span-8">
          {state.isGenerating ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Generating Your Campaign...</h2>
              <p className="text-slate-600 max-w-md">
                Our AI is crafting compliant campaign descriptions and industry-specific sample messages for you.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
              <div className="p-6 md:p-10">
                {renderStep()}
              </div>
            </div>
          )}
        </div>
        <aside className="lg:col-span-4 space-y-6">
          <HelpSidebar step={state.step} />
        </aside>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6 text-slate-500 text-sm">
          <div className="text-center space-y-3">
            <p className="font-bold text-slate-700">
              Built by <a href="https://growthdesignstudio.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 underline decoration-indigo-200 underline-offset-4 transition-all decoration-2">Growth Design Studio</a>
            </p>
            <p className="text-slate-400 max-w-md">
              We value your privacy. <strong>We do not save any user information</strong> entered here; all data stays strictly in your browser's local storage.
            </p>
          </div>
          <p className="text-[10px] text-slate-300 uppercase font-bold tracking-[0.2em] mt-4">© 2026 A2P 10DLC COMPLIANCE TOOLS</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
