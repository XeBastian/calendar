// Provider-neutral placement preview. No ad requests, cookies or tracking.
// Open a page with ?ads=preview to review the positions before configuring a provider.
export const adPlacements = Object.freeze({
  'event-inline': {label:'Event content',size:'Responsive horizontal placement',shape:'horizontal'},
  'event-actions': {label:'Event sidebar',size:'Responsive rectangle · typically 300 × 250',shape:'rectangle'},
  'list-break': {label:'Event list',size:'Responsive horizontal placement',shape:'horizontal'}
});
export function adPlacement(id,{preview=false}={}) {
  const placement=adPlacements[id];
  if(!placement||!preview)return '';
  return `<aside class="ad-placement ad-placement--${placement.shape}" data-ad-placement="${id}" aria-label="Advertisement placement preview"><span class="ad-label">Advertisement · preview</span><div class="ad-preview"><span>${placement.label}</span><small>${placement.size}</small></div></aside>`;
}
