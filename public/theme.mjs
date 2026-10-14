import {syncDropdown} from '/dropdowns.mjs';
const root = document.documentElement;
const appearance = document.querySelector('#appearance');
let preference = 'auto';
try { preference = localStorage.getItem('korvexa-appearance') || 'auto'; } catch {}
if (!['auto', 'light', 'dark'].includes(preference)) preference = 'auto';

function applyTheme(value) {
  if (value === 'auto') delete root.dataset.theme;
  else root.dataset.theme = value;
  if (appearance) { appearance.value = value; syncDropdown(appearance); }
}

applyTheme(preference);
appearance?.addEventListener('change', () => {
  applyTheme(appearance.value);
  try { localStorage.setItem('korvexa-appearance', appearance.value); } catch {}
});
