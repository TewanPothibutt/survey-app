const STORAGE_KEY = 'student-ai-survey-apps-script-url';

const settingsCard = document.getElementById('settingsCard');
const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const clearSettingsBtn = document.getElementById('clearSettingsBtn');
const scriptUrlInput = document.getElementById('scriptUrl');
const settingsMessage = document.getElementById('settingsMessage');
const surveyForm = document.getElementById('surveyForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

function loadSettings() {
  const savedUrl = localStorage.getItem(STORAGE_KEY) || '';
  scriptUrlInput.value = savedUrl;
  if (savedUrl) {
    settingsMessage.textContent = 'Apps Script URL saved in this browser.';
    settingsMessage.className = 'helper-text success';
  }
}

function setMessage(el, text, type = '') {
  el.textContent = text;
  el.className = type ? `${el.className.split(' ')[0]} ${type}` : el.className.split(' ')[0];
}

function collectCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function buildPayload() {
  const formData = new FormData(surveyForm);
  return {
    submittedAt: new Date().toISOString(),
    nationality: formData.get('nationality')?.trim() || '',
    university: formData.get('university')?.trim() || '',
    educationLevel: formData.get('educationLevel') || '',
    major: formData.get('major')?.trim() || '',
    techConfidence: formData.get('techConfidence') || '',
    mentalPersonalSupport: collectCheckedValues('mentalPersonalSupport'),
    mentalPersonalSupportOther: formData.get('mentalPersonalSupportOther')?.trim() || '',
    socialMediaUse: collectCheckedValues('socialMediaUse'),
    socialMediaUseOther: formData.get('socialMediaUseOther')?.trim() || '',
    campusServices: collectCheckedValues('campusServices'),
    campusServicesOther: formData.get('campusServicesOther')?.trim() || '',
    studying: collectCheckedValues('studying'),
    studyingOther: formData.get('studyingOther')?.trim() || '',
    learningAssessment: collectCheckedValues('learningAssessment'),
    learningAssessmentOther: formData.get('learningAssessmentOther')?.trim() || '',
    researchActivities: collectCheckedValues('researchActivities'),
    researchActivitiesOther: formData.get('researchActivitiesOther')?.trim() || '',
    institutionalCommunication: collectCheckedValues('institutionalCommunication'),
    institutionalCommunicationOther: formData.get('institutionalCommunicationOther')?.trim() || '',
    reasonsForUsingAI: collectCheckedValues('reasonsForUsingAI'),
    reasonsForUsingAIOther: formData.get('reasonsForUsingAIOther')?.trim() || '',
    expectationLevel: formData.get('expectationLevel') || '',
    firstHelpSource: formData.get('firstHelpSource') || '',
    firstHelpSourceOther: formData.get('firstHelpSourceOther')?.trim() || '',
    otherImpact: formData.get('otherImpact')?.trim() || '',
    usageFrequency: formData.get('usageFrequency') || '',
    trustInAI: formData.get('trustInAI') || '',
    verifyAI: formData.get('verifyAI') || '',
    learningImpact: formData.get('learningImpact') || '',
    dependencyImpact: formData.get('dependencyImpact') || '',
    criticalThinkingImpact: formData.get('criticalThinkingImpact') || '',
    aiConcerns: collectCheckedValues('aiConcerns'),
    aiConcernsOther: formData.get('aiConcernsOther')?.trim() || ''
  };
}

async function submitSurvey(event) {
  event.preventDefault();

  const scriptUrl = (localStorage.getItem(STORAGE_KEY) || '').trim();
  if (!scriptUrl) {
    settingsCard.classList.remove('hidden');
    setMessage(formMessage, 'Please save your Apps Script Web App URL first.', 'warning');
    return;
  }

  const payload = buildPayload();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  setMessage(formMessage, 'Sending response to Google Sheets...', '');

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    surveyForm.reset();
    setMessage(formMessage, 'Survey submitted. Check your Google Sheet to confirm the new row was added.', 'success');
  } catch (error) {
    console.error(error);
    setMessage(formMessage, 'Something went wrong while submitting. Please verify your Apps Script URL and deployment settings.', 'warning');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Survey';
  }
}

toggleSettingsBtn.addEventListener('click', () => {
  settingsCard.classList.toggle('hidden');
});

saveSettingsBtn.addEventListener('click', () => {
  const url = scriptUrlInput.value.trim();
  if (!url) {
    setMessage(settingsMessage, 'Please paste a valid Apps Script URL.', 'warning');
    return;
  }

  localStorage.setItem(STORAGE_KEY, url);
  setMessage(settingsMessage, 'Saved. This iPad browser is now linked to your Google Sheet backend.', 'success');
});

clearSettingsBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  scriptUrlInput.value = '';
  setMessage(settingsMessage, 'Saved URL removed from this browser.', '');
});

surveyForm.addEventListener('submit', submitSurvey);
loadSettings();
