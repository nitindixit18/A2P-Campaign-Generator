
export enum BusinessType {
  LLC = 'LLC',
  CORPORATION = 'Corporation',
  SOLE_PROPRIETOR = 'Sole Proprietor',
  PARTNERSHIP = 'Partnership',
  NON_PROFIT = 'Non-Profit',
  GOVERNMENT = 'Government',
  OTHER = 'Other'
}

export enum EntityType {
  PRIVATE = 'Private',
  PUBLIC = 'Public',
  NON_PROFIT = 'Non-Profit',
  GOVERNMENT = 'Government'
}

export enum OptInMethod {
  WEBSITE = 'Website/Online Form',
  KEYWORD = 'Keyword/SMS',
  PAPER = 'Paper Form',
  VERBAL = 'Verbal/Phone',
  POS = 'Point of Sale/Kiosk',
  FACEBOOK = 'Facebook Lead Ads'
}

export interface BusinessInfo {
  legalName: string;
  dbaName: string;
  ein: string;
  businessType: BusinessType;
  entityType: EntityType;
  address: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  email: string;
  phone: string;
  industry: string; // New field
}

export interface UseCase {
  id: string;
  name: string;
  category: 'Standard' | 'Low Volume' | 'Special';
  description: string;
  example: string;
}

export interface CampaignData {
  primaryUseCaseId: string;
  messageTypes: string[]; // New field for Mixed campaigns
  description: string;
  sample1: string;
  sample2: string;
  optInMethod: OptInMethod;
  optInFlow: string;
  consentMessage: string;
  confirmationMessage: string;
  keywords: string;
}

export interface AppState {
  step: number;
  business: BusinessInfo;
  campaign: CampaignData;
  isGenerating: boolean;
}
