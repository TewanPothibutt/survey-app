const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwt-F0I9MuBhVuKO68seEHPVFqdOkrVNG7NgaB3x-ORtp7VTmycqifaGpcFw35GoEt2tA/exec';

const surveyForm = document.getElementById('surveyForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

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
    unviversity: formData.get('university')?.trim() || '',
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

  const scriptUrl = APPS_SCRIPT_URL.trim();
  if (!scriptUrl || scriptUrl === 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
    setMessage(formMessage, 'Set your Apps Script Web App URL in app.js before publishing the site.', 'warning');
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
    setMessage(formMessage, 'Something went wrong while submitting. Please verify your Apps Script deployment settings and embedded URL.', 'warning');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Survey';
  }
}

surveyForm.addEventListener('submit', submitSurvey);
