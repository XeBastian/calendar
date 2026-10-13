const clearButton=document.querySelector('#clear-saved-events');
const status=document.querySelector('#privacy-storage-status');
clearButton.addEventListener('click',()=>{
 try {
  localStorage.removeItem('korvexa-saved');
  status.textContent='Saved events have been cleared on this device.';
 } catch {
  status.textContent='Browser storage is unavailable. You can clear saved site data in your browser settings.';
 }
});
