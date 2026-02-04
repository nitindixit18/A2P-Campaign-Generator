
import { UseCase, BusinessType, EntityType, OptInMethod } from './types';

export const STEPS = [
  'Business Info',
  'Use Case',
  'Campaign Content',
  'Opt-In Setup',
  'Review & Export'
];

export const INDUSTRIES = [
  "Retail & E-commerce",
  "Healthcare & Wellness",
  "Real Estate",
  "Software / SaaS",
  "Professional Services",
  "Financial Services",
  "Education",
  "Non-Profit",
  "Construction & Trade",
  "Hospitality & Travel",
  "Automotive",
  "Entertainment",
  "Other"
];

export const MIXED_MESSAGE_TYPES = [
  "Marketing & Promotions",
  "Customer Care",
  "Account Notifications",
  "Delivery / Order Updates",
  "Appointment Reminders",
  "2FA / Security Codes",
  "Fraud Alerts"
];

export const USE_CASES: UseCase[] = [
  {
    id: '2FA',
    name: '2FA / Account Verification',
    category: 'Standard',
    description: 'One-time passwords and authentication codes for secure login verification.',
    example: '[BUSINESS_NAME]: Your verification code is [CODE]. Do not share. Reply STOP to opt out.'
  },
  {
    id: 'MARKETING',
    name: 'Marketing',
    category: 'Standard',
    description: 'Promotional offers, sales announcements, and product updates.',
    example: '[BUSINESS_NAME]: Flash Sale! Get 20% off with code SAVE20. Shop: [LINK]. Reply STOP to unsub.'
  },
  {
    id: 'CUSTOMER_CARE',
    name: 'Customer Care',
    category: 'Standard',
    description: 'Support, appointment reminders, and customer interactions.',
    example: 'Hi [NAME], this is [STAFF] from [BUSINESS_NAME]. Your appt is confirmed. Reply STOP to opt out.'
  },
  {
    id: 'DELIVERY',
    name: 'Delivery Notification',
    category: 'Standard',
    description: 'Order updates and tracking information for physical goods.',
    example: '[BUSINESS_NAME]: Your order [ID] has shipped! Track: [LINK]. Reply STOP to opt out.'
  },
  {
    id: 'LOW_VOLUME_MIXED',
    name: 'Low Volume Mixed',
    category: 'Low Volume',
    description: 'For small businesses with mixed messaging needs (max 2,000 msg/day). Requires selecting multiple intents.',
    example: 'Various business updates and notifications from [BUSINESS_NAME].'
  }
];

export const BUSINESS_TYPES = Object.values(BusinessType);
export const ENTITY_TYPES = Object.values(EntityType);
export const OPT_IN_METHODS = Object.values(OptInMethod);
