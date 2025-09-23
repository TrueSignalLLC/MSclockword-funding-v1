import { complianceConfig } from '../../config/compliance.config';
import { ComplianceData } from '../types/quiz.types';

/**
 * Jornaya Script Loader
 * Dynamically injects the Jornaya script into the page
 */
export const loadJornayaScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!complianceConfig.jornaya.enabled) {
      resolve();
      return;
    }

    if (document.getElementById('LeadiDscript_campaign')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'LeadiDscript_campaign';
    script.type = 'text/javascript';
    script.async = true;
    script.src = `//create.lidstatic.com/campaign/${complianceConfig.jornaya.campaignId}.js?snippet_version=2`;
    
    script.onload = () => resolve();
    script.onerror = () => resolve();
    
    document.body.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img src='//create.leadid.com/noscript.gif?lac=${complianceConfig.jornaya.accountId}&lck=${complianceConfig.jornaya.campaignId}&snippet_version=2' />`;
    document.body.appendChild(noscript);
  });
};




export const captureLeadiD = (): string | null => {
  if (!complianceConfig.jornaya.enabled) return null;
  
  const leadidField = document.getElementById('leadid_token') as HTMLInputElement;
  return leadidField ? leadidField.value : null;
};

export const getComplianceData = (): ComplianceData => {
  const data: ComplianceData = {};
  
  if (complianceConfig.jornaya.enabled) {
    const leadId = captureLeadiD();
    if (leadId) {
      data.leadid_token = leadId;
      data.leadid_timestamp = new Date().toISOString();
      data.page_url = window.location.href;
    }
  }
  
  if (complianceConfig.trustedForm.enabled) {
    // TrustedForm data will be handled separately
  }
  
  return data;
};

export const isComplianceReady = (): boolean => {
  if (!complianceConfig.jornaya.enabled && !complianceConfig.trustedForm.enabled) {
    return true;
  }
  
  let ready = true;
  
  if (complianceConfig.jornaya.enabled) {
    const leadId = captureLeadiD();
    if (!leadId) {
      ready = false;
    }
  }
  
  if (complianceConfig.trustedForm.enabled) {
    // TrustedForm readiness will be handled separately
  }
  
  return ready;
};

export const cleanupComplianceScripts = (): void => {
  const jornayaScript = document.getElementById('LeadiDscript');
  const jornayaCampaignScript = document.getElementById('LeadiDscript_campaign');
  
  if (jornayaScript) jornayaScript.remove();
  if (jornayaCampaignScript) jornayaCampaignScript.remove();
  
  const trustedFormScript = document.getElementById('TrustedFormScript');
  if (trustedFormScript) trustedFormScript.remove();

};