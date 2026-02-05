
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessInfo, UseCase, CampaignData } from "../types";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error("VITE_API_KEY is not defined");
}

const ai = new GoogleGenAI({ apiKey });

export const generateCampaignContent = async (business: BusinessInfo, useCase: UseCase, campaign: CampaignData) => {
  const isMixed = ['MIXED', 'LOW_VOLUME_MIXED'].includes(useCase.id);
  const messageTypesText = isMixed ? `Selected Message Types: ${campaign.messageTypes.join(', ')}` : '';
  
  const prompt = `
    Generate A2P 10DLC campaign content for the following business:
    Business Name: ${business.legalName}
    Brand Name (DBA): ${business.dbaName || business.legalName}
    Industry: ${business.industry}
    Website: ${business.website}
    Use Case: ${useCase.name} - ${useCase.description}
    ${messageTypesText}

    Requirements:
    1. Campaign Description: Professional, 150-500 characters, explaining objective and audience. 
       ${isMixed ? 'MUST explicitly mention that the campaign includes ' + campaign.messageTypes.join(', ') + '.' : ''}
    2. Sample Message 1: Must include brand name, use [BRACKETS] for dynamic parts, must include "Reply STOP to unsubscribe". 
       ${isMixed ? 'This sample should represent ' + campaign.messageTypes[0] + '.' : ''}
    3. Sample Message 2: Different scenario, must include brand name, dynamic [BRACKETS]. 
       ${isMixed ? 'This sample should represent ' + campaign.messageTypes[1] + '.' : ''}
    4. Opt-In Flow: Detailed description of how users provide consent (e.g., via website form at ${business.website}).
    5. Consent Message: The exact language shown next to a checkbox on the website.
    6. Confirmation Message: The first SMS sent after opting in, including brand name, frequency disclosure, and opt-out instructions.

    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          sample1: { type: Type.STRING },
          sample2: { type: Type.STRING },
          optInFlow: { type: Type.STRING },
          consentMessage: { type: Type.STRING },
          confirmationMessage: { type: Type.STRING },
        },
        required: ["description", "sample1", "sample2", "optInFlow", "consentMessage", "confirmationMessage"]
      }
    }
  });

  return JSON.parse(response.text);
};
