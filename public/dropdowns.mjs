// Enhance the existing selects without changing their values or change events.
const controls = new WeakMap();
let opened = null;
let positionPending = false;

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function closeDropdown(restoreFocus = false) {
  if (!opened) return;
  const control = opened;
  opened = null;
  control.panel?.remove();
  control.panel = null;
  control.button.setAttribute('aria-expanded', 'false');
  control.button.removeAttribute('aria-activedescendant');
  if (restoreFocus && control.button.isConnected) control.button.focus({preventScroll: true});
}

function positionDropdown(control) {
  if (!control.select.isConnected) return closeDropdown();
  const rect = control.button.getBoundingClientRect();
  const viewport = window.visualViewport;
  const leftEdge = viewport?.offsetLeft || 0;
  const topEdge = viewport?.offsetTop || 0;
  const width = viewport?.width || innerWidth;
  const height = viewport?.height || innerHeight;
  const gap = 8, margin = 12;
  const below = topEdge + height - rect.bottom - margin - gap;
  const above = rect.top - topEdge - margin - gap;
  const aboveTrigger = below < 180 && above > below;
  const available = Math.max(100, aboveTrigger ? above : below);
  const minimum = control.wrapper.classList.contains('dropdown-compact') ? 160 : 220;
  const panelWidth = Math.min(Math.max(rect.width, minimum), width - margin * 2);
  const left = Math.max(leftEdge + margin, Math.min(rect.left, leftEdge + width - panelWidth - margin));
  Object.assign(control.panel.style, {
    width: `${panelWidth}px`, maxHeight: `${Math.min(available, 340)}px`, left: `${left}px`,
    top: aboveTrigger ? 'auto' : `${rect.bottom + gap}px`,
    bottom: aboveTrigger ? `${innerHeight - rect.top + gap}px` : 'auto'
  });
}

function activate(control, index) {
  const options = [...control.list.querySelectorAll('[role="option"]')];
  if (!options.length) {
    control.active = -1;
    control.button.removeAttribute('aria-activedescendant');
    control.search?.removeAttribute('aria-activedescendant');
    return;
  }
  control.active = Math.max(0, Math.min(index, options.length - 1));
  options.forEach((option, i) => option.classList.toggle('is-active', i === control.active));
  const active = options[control.active];
  control.button.setAttribute('aria-activedescendant', active.id);
  control.search?.setAttribute('aria-activedescendant', active.id);
  const top = active.offsetTop - control.list.offsetTop;
  if (top < control.list.scrollTop) control.list.scrollTop = top;
  else if (top + active.offsetHeight > control.list.scrollTop + control.list.clientHeight) {
    control.list.scrollTop = top + active.offsetHeight - control.list.clientHeight;
  }
}

function choose(control, index) {
  const option = control.select.options[index];
  if (!option || option.disabled) return;
  const changed = control.select.selectedIndex !== index;
  control.select.selectedIndex = index;
  syncDropdown(control.select);
  closeDropdown(true);
  if (changed) control.select.dispatchEvent(new Event('change', {bubbles: true}));
}

function renderOptions(control, query = '') {
  control.list.replaceChildren();
  const needle = normalize(query.trim());
  for (const option of control.select.options) {
    if (option.disabled || (needle && !normalize(option.textContent).includes(needle))) continue;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'dropdown-option';
    item.id = `${control.select.id}-option-${option.index}`;
    item.tabIndex = -1;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(option.selected));
    const mark = document.createElement('span');
    mark.className = 'dropdown-check';
    mark.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = option.textContent;
    item.append(mark, text);
    item.addEventListener('click', () => choose(control, option.index));
    control.list.append(item);
  }
  const options = [...control.list.children];
  const selected = options.findIndex(option => option.getAttribute('aria-selected') === 'true');
  activate(control, Math.max(0, selected));
  control.empty.hidden = options.length > 0;
}

function openDropdown(control) {
  if (control.select.disabled) return;
  closeDropdown();
  opened = control;
  control.prefix = '';
  control.typedAt = 0;
  control.button.setAttribute('aria-expanded', 'true');
  control.button.focus({preventScroll: true});
  const panel = document.createElement('div');
  panel.className = 'dropdown-panel';
  panel.setAttribute('data-dropdown-panel', '');
  control.panel = panel;
  control.search = null;
  if (control.select.options.length > 8) {
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'dropdown-search';
    search.placeholder = 'Search options';
    search.setAttribute('aria-label', `Search ${control.name.toLowerCase()} options`);
    search.setAttribute('aria-controls', `${control.select.id}-listbox`);
    search.autocomplete = 'off';
    search.addEventListener('input', () => renderOptions(control, search.value));
    panel.append(search);
    control.search = search;
  }
  const list = document.createElement('div');
  list.className = 'dropdown-options';
  list.id = `${control.select.id}-listbox`;
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', control.name);
  control.list = list;
  const empty = document.createElement('p');
  empty.className = 'dropdown-empty';
  empty.setAttribute('role', 'status');
  empty.textContent = 'No matching options.';
  control.empty = empty;
  panel.append(list, empty);
  document.body.append(panel);
  renderOptions(control);
  positionDropdown(control);
  control.search?.focus({preventScroll: true});
}

export function syncDropdown(select) {
  const control = controls.get(select);
  if (!control) return;
  const text = select.selectedOptions[0]?.textContent || '';
  control.value.textContent = text;
  control.button.title = text;
  control.button.disabled = select.disabled;
  control.wrapper.classList.toggle('has-value', select.value !== '' && select.dataset.filter !== undefined);
}

export function enhanceDropdowns(root = document) {
  if (opened && !opened.select.isConnected) closeDropdown();
  for (const select of root.querySelectorAll('select')) {
    if (controls.has(select) || select.multiple) continue;
    const label = select.labels?.[0];
    const labelCopy = label?.cloneNode(true);
    labelCopy?.querySelectorAll('select').forEach(element => element.remove());
    const name = select.getAttribute('aria-label') || labelCopy?.textContent.trim() || 'Choose an option';
    const wrapper = document.createElement('div');
    wrapper.className = `dropdown ${select.id === 'sort' || select.id === 'appearance' ? 'dropdown-compact' : ''}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dropdown-trigger';
    button.id = `${select.id}-trigger`;
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-label', name);
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `${select.id}-listbox`);
    const value = document.createElement('span');
    value.className = 'dropdown-value';
    const chevron = document.createElement('span');
    chevron.className = 'dropdown-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    button.append(value, chevron);
    select.before(wrapper);
    wrapper.append(select, button);
    select.classList.add('dropdown-source');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    if (label) label.htmlFor = button.id;
    const control = {select, wrapper, button, value, name, active: -1};
    controls.set(select, control);
    select.addEventListener('change', () => syncDropdown(select));
    button.addEventListener('click', () => opened === control ? closeDropdown() : openDropdown(control));
    syncDropdown(select);
  }
}

document.addEventListener('pointerdown', event => {
  if (opened && !opened.wrapper.contains(event.target) && !opened.panel.contains(event.target)) closeDropdown();
}, true);

document.addEventListener('keydown', event => {
  const control = opened || controls.get(document.getElementById(event.target.id?.replace(/-trigger$/, '')));
  if (!control || (event.target !== control.button && !control.panel?.contains(event.target))) return;
  const inSearch = event.target === control.search;
  if (event.key === 'Escape' && opened) {
    event.preventDefault(); event.stopPropagation(); closeDropdown(true); return;
  }
  if (event.key === 'Tab' && opened) { closeDropdown(true); return; }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key) && !(inSearch && ['Home', 'End', ' '].includes(event.key))) {
    event.preventDefault();
    if (!opened) {
      openDropdown(control);
      if (event.key === 'Home') activate(control, 0);
      if (event.key === 'End') activate(control, control.list.children.length - 1);
      return;
    }
    const count = control.list.querySelectorAll('[role="option"]').length;
    if (!count) return;
    if (event.key === 'ArrowDown') activate(control, (control.active + 1) % count);
    if (event.key === 'ArrowUp') activate(control, (control.active - 1 + count) % count);
    if (event.key === 'Home') activate(control, 0);
    if (event.key === 'End') activate(control, count - 1);
    if (event.key === 'Enter' || event.key === ' ') {
      const active = control.list.querySelectorAll('[role="option"]')[control.active];
      if (active) choose(control, Number(active.id.split('-').at(-1)));
    }
    return;
  }
  if (!inSearch && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    if (!opened) openDropdown(control);
    if (control.search) {
      control.search.value += event.key;
      renderOptions(control, control.search.value);
    } else {
      const now = Date.now();
      control.prefix = now - (control.typedAt || 0) < 700 ? (control.prefix || '') + event.key : event.key;
      control.typedAt = now;
      const index = [...control.list.children].findIndex(option => normalize(option.textContent).startsWith(normalize(control.prefix)));
      if (index >= 0) activate(control, index);
    }
  }
}, true);

function schedulePosition() {
  if (!opened || positionPending) return;
  positionPending = true;
  requestAnimationFrame(() => { positionPending = false; if (opened) positionDropdown(opened); });
}
window.addEventListener('resize', schedulePosition);
window.visualViewport?.addEventListener('resize', schedulePosition);
document.addEventListener('scroll', event => {
  if (opened && !opened.panel.contains(event.target)) schedulePosition();
}, {capture: true, passive: true});

enhanceDropdowns();
