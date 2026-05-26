/* ================================================================
   contact.js — Web3Forms submission (email never exposed to user)
   Get your free access key at: https://web3forms.com
   Paste the key into config.js → forms.web3formsKey
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('contact-form');
  const message = document.getElementById('form-message');
  const submit  = document.getElementById('submit-btn');
  if (!form) return;

  // Inject email display from CONFIG so it's only set in one place
  const emailDisplay = document.getElementById('contact-email-display');
  if (emailDisplay) {
    emailDisplay.textContent = CONFIG.brand.email;
    emailDisplay.href = `mailto:${CONFIG.brand.email}`;
  }

  // Inject response time from CONFIG
  const rtDisplay = document.getElementById('contact-response-time');
  if (rtDisplay) {
    rtDisplay.textContent = `Within ${CONFIG.support.responseTime}, ${CONFIG.support.hours}`;
  }

  // Inject phone if set
  const phoneBlock = document.getElementById('contact-phone-block');
  if (phoneBlock) {
    if (CONFIG.brand.phone) {
      phoneBlock.style.display = '';
      const phoneLink = document.getElementById('contact-phone-link');
      if (phoneLink) {
        phoneLink.href        = `tel:${CONFIG.brand.phone.replace(/\D/g, '')}`;
        phoneLink.textContent = CONFIG.brand.phone;
      }
    } else {
      phoneBlock.style.display = 'none';
    }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    submit.disabled    = true;
    submit.textContent = 'Sending...';
    message.className  = 'form-message';

    const data = new FormData(form);
    data.set('access_key', CONFIG.forms.web3formsKey);
    data.set('subject',    `New inquiry from ${CONFIG.brand.name} website`);
    data.set('from_name',  CONFIG.brand.name);

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();

      if (json.success) {
        message.textContent = `Message sent! We'll get back to you within ${CONFIG.support.responseTime}.`;
        message.className   = 'form-message success';
        form.reset();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      message.textContent = `Something went wrong. Please try again or email us at ${CONFIG.brand.email}.`;
      message.className   = 'form-message error';
    }

    submit.disabled    = false;
    submit.textContent = 'Send Message';
  });
});
