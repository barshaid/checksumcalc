// Nuvei Withdrawal Checksum Calculator & URL Generator
// Specialized tool for Nuvei withdrawal page integration
// Cleanup Refactor (unified parameter ordering, removed duplicates, fixed additional params parsing)

const DEBUG = false; // Set true to enable verbose console logging

if (DEBUG) {
    console.log('🚀 Nuvei Withdrawal Tool script loaded successfully!');
    console.log('⏰ Script load time:', new Date().toISOString());
}

const NUVEI_SANDBOX_WITHDRAWAL_URL = 'https://ppp-test.safecharge.com/ppp/withdrawal/withdraw.do';
const NUVEI_PRODUCTION_WITHDRAWAL_URL = 'https://secure.safecharge.com/ppp/withdrawal/withdraw.do';

// Canonical withdrawal parameter ordering (excluding secretKey which is prepended only to checksum string)
const WITHDRAWAL_BASE_ORDER = [
    'merchant_id',
    'merchant_site_id',
    'user_token_id',
    'merchant_unique_id',
    'wd_amount', // Optional when open amount enabled but kept in order if provided
    'wd_currency',
    'timeStamp',
    'version'
];

// Documented / commonly used optional parameters in preferred order
const WITHDRAWAL_OPTIONAL_ORDER = [
    'user_token',
    'merchantLocale',
    'country',
    'wd_open_amount',
    'wd_min_amount',
    'wd_max_amount',
    'userId',
    'customSiteName',
    'successUrl',
    'failUrl',
    'backUrl',
    'showCancelButton',
    'layout',
    'first_name',
    'last_name',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'zip'
];

// Generate current timestamp (YYYYMMDDHHMMSS)
function generateTimestamp() {
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}` +
        `${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
    const el = document.getElementById('timeStamp');
    if (el) el.value = ts;
}

// Toggle open amount fields
function toggleOpenAmount() {
    const checkbox = document.getElementById('enableOpenAmount');
    const section = document.getElementById('openAmountSection');
    const amountField = document.getElementById('wd_amount');
    if (!checkbox || !section || !amountField) return;

    if (checkbox.checked) {
        section.style.display = 'block';
        amountField.placeholder = 'Default amount (optional when open amount enabled)';
    } else {
        section.style.display = 'none';
        amountField.placeholder = '100.00';
        // Clear min/max when disabling open amount
        const minF = document.getElementById('wd_min_amount');
        const maxF = document.getElementById('wd_max_amount');
        if (minF) minF.value = '';
        if (maxF) maxF.value = '';
    }
}

// Toggle redirect URLs section
function toggleRedirectUrls() {
    const checkbox = document.getElementById('enableRedirectUrls');
    const section = document.getElementById('redirectUrlsSection');
    if (!checkbox || !section) return;
    if (checkbox.checked) {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
        ['successUrl','failUrl','backUrl'].forEach(id => { const f = document.getElementById(id); if (f) f.value=''; });
    }
}

// Additional Parameters Management (user-defined arbitrary key/value pairs)
let additionalParameterCounter = 0;
function getNextAdditionalParameterNumber() {
    let n = 1; while (document.getElementById(`additional-param-${n}`)) n++; return n;
}
function addAdditionalParameter() {
    try {
        const MAX = 20;
        const container = document.getElementById('additionalParameters');
        if (!container) { showMessage('Additional parameters container not found', 'error'); return; }
        const existing = container.querySelectorAll('[data-additional-param]').length;
        if (existing >= MAX) { showMessage(`Maximum of ${MAX} additional parameters reached.`, 'warning'); return; }
        const num = getNextAdditionalParameterNumber();
        if (num > MAX) { showMessage(`Maximum of ${MAX} additional parameters reached.`, 'warning'); return; }
        const div = document.createElement('div');
        div.className = 'additional-param';
        div.id = `additional-param-${num}`;
        // Use a unified attribute data-additional-param for easier parsing
        div.innerHTML = `
            <div class="form-group" style="flex:1;min-width:200px;">
              <label for="additionalParamName${num}">Parameter Name:</label>
              <input type="text" id="additionalParamName${num}" name="additionalParamName${num}" data-additional-param="${num}" placeholder="customParam" />
            </div>
            <div class="form-group" style="flex:1;min-width:200px;">
              <label for="additionalParamValue${num}">Parameter Value:</label>
              <input type="text" id="additionalParamValue${num}" name="additionalParamValue${num}" data-additional-param="${num}" placeholder="customValue" />
            </div>
            <button type="button" class="remove-param-btn" onclick="removeAdditionalParameter(${num})">Remove</button>`;
        container.appendChild(div);
        additionalParameterCounter = Math.max(additionalParameterCounter, num);
        setTimeout(()=>{ const nf = document.getElementById(`additionalParamName${num}`); if(nf) nf.focus(); },100);
        showMessage(`Additional parameter ${num} added`, 'success');
    } catch(e) {
        if (DEBUG) console.error('addAdditionalParameter error', e);
        showMessage('Error adding additional parameter', 'error');
    }
}
function removeAdditionalParameter(counter) {
    const div = document.getElementById(`additional-param-${counter}`);
    if (div) { div.remove(); showMessage(`Additional parameter ${counter} removed`, 'info'); }
}

// Section toggle (collapsible groups)
function toggleSection(sectionId) {
    const body = document.getElementById(sectionId + 'Body');
    const icon = document.getElementById(sectionId + 'Icon');
    if (!body || !icon) return;
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? '' : 'none';
    icon.textContent = hidden ? '▲' : '▼';
}

// Dark mode functionality (shared with other pages)
function toggleDarkMode() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const btn = document.getElementById('toggleDarkMode');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}
function initializeTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', saved);
    const btn = document.getElementById('toggleDarkMode');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
}

// Compact mode
function toggleCompactMode() {
    const container = document.querySelector('.container');
    if (!container) return;
    const isCompact = container.classList.contains('compact-mode');
    container.classList.toggle('compact-mode');
    localStorage.setItem('compactMode', (!isCompact).toString());
}
function initializeCompactMode() {
    const saved = localStorage.getItem('compactMode') === 'true';
    const container = document.querySelector('.container');
    if (!container) return;
    container.classList.toggle('compact-mode', saved);
}

// Auto-resize textareas
function initializeAutoResizeTextareas() {
    function autoResize(t){ t.style.height='auto'; t.style.height=Math.max(t.scrollHeight,60)+'px'; }
    document.querySelectorAll('textarea').forEach(t=>{
        t.addEventListener('input',()=>autoResize(t));
        t.addEventListener('focus',()=>autoResize(t));
        setTimeout(()=>autoResize(t),100);
    });
    const obs=new MutationObserver(muts=>{muts.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1){ n.querySelectorAll && n.querySelectorAll('textarea').forEach(t=>{t.addEventListener('input',()=>autoResize(t));t.addEventListener('focus',()=>autoResize(t));setTimeout(()=>autoResize(t),100);}); } }));});
    obs.observe(document.body,{childList:true,subtree:true});
}

// SHA-256 helper
async function sha256(message) {
    const buf = new TextEncoder().encode(message);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// Collect form data
function getFormData() {
    const form = document.getElementById('withdrawal-form');
    const fd = new FormData(form);
    const data = {};
    for (let [k,v] of fd.entries()) { if (v.trim() !== '') data[k]=v.trim(); }

    // Custom fields (customField1..15)
    document.querySelectorAll('[data-custom-field]').forEach(f=>{ if(f.value.trim()) data[f.name]=f.value.trim(); });

    // Additional parameters (new unified naming OR legacy pattern)
    const paramPairs = {};
    // New pattern
    document.querySelectorAll('[data-additional-param]').forEach(f => {
        const num = f.getAttribute('data-additional-param');
        paramPairs[num] = paramPairs[num] || {};
        if (f.id.startsWith('additionalParamName')) paramPairs[num].name = f.value.trim();
        if (f.id.startsWith('additionalParamValue')) paramPairs[num].value = f.value.trim();
    });
    // Legacy pattern support (param-name-/param-value-)
    document.querySelectorAll('[id^="param-name-"], [id^="param-value-"]').forEach(f => {
        const legacyMatch = f.id.match(/param-(name|value)-(\d+)/);
        if (!legacyMatch) return;
        const [, type, num] = legacyMatch;
        paramPairs[num] = paramPairs[num] || {};
        if (type === 'name') paramPairs[num].name = f.value.trim(); else paramPairs[num].value = f.value.trim();
    });
    Object.values(paramPairs).forEach(p => { if (p.name && p.value) data[p.name]=p.value; });

    // Open amount handling
    const openEnabled = document.getElementById('enableOpenAmount')?.checked;
    data['wd_open_amount'] = openEnabled ? 'True' : 'False';
    if (!openEnabled) { delete data.wd_min_amount; delete data.wd_max_amount; }

    // Redirect URLs (only if enabled)
    const redirectEnabled = document.getElementById('enableRedirectUrls')?.checked;
    if (!redirectEnabled) { delete data.successUrl; delete data.failUrl; delete data.backUrl; }

    return data;
}

// Build checksum concatenation string
function createWithdrawalChecksumString(data, secretKey) {
    // Start with secret key (not part of form data)
    let concat = secretKey;

    const ordered = [...WITHDRAWAL_BASE_ORDER, ...WITHDRAWAL_OPTIONAL_ORDER];

    // Include customField1..15 in numeric order if present
    for (let i=1;i<=15;i++) {
        const k = `customField${i}`;
        if (data[k]) ordered.push(k);
    }

    // Append ordered parameters (only those present with non-empty value)
    ordered.forEach(k => { if (data[k]) concat += data[k]; });

    // Append any remaining parameters (excluding checksum/hash_algorithm) alphabetically
    const remaining = Object.keys(data)
        .filter(k => !ordered.includes(k) && k !== 'checksum' && k !== 'hash_algorithm')
        .sort();
    remaining.forEach(k => { if (data[k]) concat += data[k]; });

    return concat;
}

// Validation helper
function showValidationError(missingReadable, requiredIds) {
    clearFieldErrors();
    alert(`Please fill in the following required fields:\n• ${missingReadable.join('\n• ')}`);
    requiredIds.forEach(fid => { const el = document.getElementById(fid); if (!el || !el.value.trim()) highlightField(fid); });
    const first = requiredIds.find(fid => { const el = document.getElementById(fid); return !el || !el.value.trim(); });
    if (first) scrollToField(first);
}
function highlightField(id){ const f=document.getElementById(id); if(!f) return; const grp=f.closest('.form-group'); if(grp) grp.classList.add('error'); }
function scrollToField(id){ const f=document.getElementById(id); if(!f)return; const sec=f.closest('.section'); if(sec){ const top=sec.getBoundingClientRect().top+window.pageYOffset-100; window.scrollTo({top,behavior:'smooth'}); setTimeout(()=>f.focus(),500);} }
function clearFieldErrors(){ document.querySelectorAll('.form-group.error').forEach(g=>g.classList.remove('error')); }
function initializeErrorHandling(){ document.querySelectorAll('input,select,textarea').forEach(inp=>{ inp.addEventListener('input',()=>clearFieldError(inp)); inp.addEventListener('focus',()=>clearFieldError(inp)); }); }
function clearFieldError(f){ const grp=f.closest('.form-group'); if(grp && grp.classList.contains('error') && f.value.trim()) grp.classList.remove('error'); }

// Auto-save
function initializeAutoSave(){ const box=document.getElementById('enableLocalStorage'); if(!box) return; box.checked = localStorage.getItem('nuvei_withdrawal_auto_save_enabled')==='true'; }
function toggleLocalStorage(){ const box=document.getElementById('enableLocalStorage'); if(!box)return; if(box.checked){ localStorage.setItem('nuvei_withdrawal_auto_save_enabled','true'); saveFormData(); showMessage('Auto-save enabled','info'); } else { localStorage.setItem('nuvei_withdrawal_auto_save_enabled','false'); showMessage('Auto-save disabled','info'); } }
function saveFormData(){ if(!document.getElementById('enableLocalStorage')?.checked) return; try { const data=getFormData(); delete data.secretKey; localStorage.setItem('nuvei_withdrawal_form_data', JSON.stringify(data)); } catch(e){ if(DEBUG) console.error('saveFormData error',e);} }
function loadFormData(){ if(!document.getElementById('enableLocalStorage')?.checked) return; try { const saved=localStorage.getItem('nuvei_withdrawal_form_data'); if(!saved) return; const data=JSON.parse(saved); Object.keys(data).forEach(k=>{ const el=document.getElementById(k); if(el) el.value=data[k]; }); if(data.wd_open_amount==='True'){ const cb=document.getElementById('enableOpenAmount'); if(cb){ cb.checked=true; toggleOpenAmount(); } } Object.keys(data).forEach(k=>{ if(k.startsWith('customField')){ const num=k.replace('customField',''); if(!document.getElementById(`customField${num}`)){ addCustomField(); const f=document.getElementById(`customField${num}`); if(f) f.value=data[k]; } } }); } catch(e){ if(DEBUG) console.error('loadFormData error',e);} }

// Generate withdrawal URL + checksum
async function generateWithdrawalUrl(){
    try {
        const openEnabled = document.getElementById('enableOpenAmount')?.checked;
        const required = ['merchant_id','merchant_site_id','secretKey','user_token_id','wd_currency','user_token','timeStamp','version'];
        if (!openEnabled) required.splice(required.indexOf('wd_currency')+1,0,'wd_amount'); // keep wd_amount required only if open amount disabled
        const missingReadable = [];
        required.forEach(fid=>{ const el=document.getElementById(fid); if(!el || !el.value.trim()) missingReadable.push(fid.replace(/_/g,' ').toUpperCase()); });
        if (openEnabled) {
            const minF=document.getElementById('wd_min_amount');
            const maxF=document.getElementById('wd_max_amount');
            if(!minF?.value.trim() || !maxF?.value.trim()) { missingReadable.push('WD MIN AMOUNT','WD MAX AMOUNT'); }
        }
        if (missingReadable.length){ showValidationError(missingReadable, required); return; }

        const formData = getFormData();
        const secretKey = document.getElementById('secretKey').value.trim();
        delete formData.secretKey;

        const concat = createWithdrawalChecksumString(formData, secretKey);
        const checksum = await sha256(concat);
        formData.checksum = checksum;

        // Build ordered params: base + optional + custom fields present
        const orderedKeys = [...WITHDRAWAL_BASE_ORDER, ...WITHDRAWAL_OPTIONAL_ORDER];
        for (let i=1;i<=15;i++){ const k=`customField${i}`; if(formData[k]) orderedKeys.push(k); }

        const urlParams = new URLSearchParams();
        orderedKeys.forEach(k=>{ if(formData[k]) urlParams.append(k, formData[k]); });
        // Remaining extras (alphabetical) excluding checksum (added last) & secretKey
        Object.keys(formData).filter(k=> !orderedKeys.includes(k) && k!=='checksum' && k!=='hash_algorithm' && k!=='secretKey').sort().forEach(k=>{ if(formData[k]) urlParams.append(k, formData[k]); });
        urlParams.append('checksum', checksum);

        const withdrawalUrl = `${NUVEI_SANDBOX_WITHDRAWAL_URL}?${urlParams.toString()}`;

        // Output
        const cEl=document.getElementById('concatenated-string'); if(cEl) cEl.value = concat;
        const chEl=document.getElementById('calculated-checksum'); if(chEl) chEl.value = checksum;
        const uEl=document.getElementById('withdrawal-url'); if(uEl) uEl.value = withdrawalUrl;
        const res=document.getElementById('results'); if(res) res.style.display='block';
        if (res) res.scrollIntoView({behavior:'smooth', block:'start'});
        showMessage('Withdrawal URL & checksum generated','success');
    } catch(err){ if(DEBUG) console.error('generateWithdrawalUrl error', err); alert('Error generating withdrawal URL.'); }
}

// Clipboard helper
async function copyToClipboard(id){ try { const el=document.getElementById(id); if(!el) return; await navigator.clipboard.writeText(el.value); const orig=el.style.backgroundColor; el.style.backgroundColor='#d4edda'; setTimeout(()=>{ el.style.backgroundColor=orig; },1000); showMessage('Copied to clipboard!','success'); } catch(e){ if(DEBUG) console.error('copyToClipboard error',e); const el=document.getElementById(id); if(el){ el.select(); document.execCommand('copy'); showMessage('Copied to clipboard!','success'); } } }
function openWithdrawalPage(){ const url=document.getElementById('withdrawal-url')?.value; if(url) window.open(url,'_blank'); else alert('Generate the withdrawal URL first'); }

// Form utilities
function clearForm(){ const form=document.getElementById('withdrawal-form'); if(form) form.reset(); const res=document.getElementById('results'); if(res) res.style.display='none'; const openSec=document.getElementById('openAmountSection'); if(openSec) openSec.style.display='none'; const redirectSec=document.getElementById('redirectUrlsSection'); if(redirectSec) redirectSec.style.display='none'; const cf=document.getElementById('customFields'); if(cf) { cf.innerHTML=''; customFieldCounter=0; } showMessage('Form cleared','info'); }
function fillSampleData(){ const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val; }; set('wd_currency','USD'); set('wd_amount','100.00'); set('user_token_id','withdraw_user_12345'); set('user_token','auto'); set('merchant_unique_id', generateUniqueId('withdraw')); set('email','john.doe@example.com'); set('first_name','John'); set('last_name','Doe'); set('country','US'); set('phone','+1234567890'); set('address','123 Main St'); set('city','New York'); set('state','NY'); set('zip','10001'); const cf=document.getElementById('customFields'); if(cf){ cf.innerHTML=''; customFieldCounter=0; addCustomField(); const f=document.getElementById('customField1'); if(f) f.value='withdrawal-tracking-123'; } generateTimestamp(); showMessage('Sample data filled','info'); if(document.getElementById('enableLocalStorage')?.checked) saveFormData(); }

// Custom fields
let customFieldCounter = 0; function getNextCustomFieldNumber(){ let n=1; while(document.getElementById(`custom-field-${n}`)) n++; return n; }
function addCustomField(){ const MAX=15; const container=document.getElementById('customFields'); if(!container) return; const existing=container.querySelectorAll('[data-custom-field]').length; if(existing>=MAX){ showMessage(`Maximum of ${MAX} custom fields reached.`,'warning'); return; } const num=getNextCustomFieldNumber(); if(num>MAX){ showMessage(`Maximum of ${MAX} custom fields reached.`,'warning'); return; } const div=document.createElement('div'); div.className='additional-param'; div.id=`custom-field-${num}`; div.innerHTML=`<div class="form-group"><label for="customField${num}">Custom Field ${num}:</label><input type="text" id="customField${num}" name="customField${num}" placeholder="Custom value ${num}" data-custom-field="${num}"></div><button type="button" class="remove-param-btn" onclick="removeCustomField(${num})">Remove</button>`; container.appendChild(div); customFieldCounter=Math.max(customFieldCounter,num); }
function removeCustomField(num){ const div=document.getElementById(`custom-field-${num}`); if(div) div.remove(); }

// Test scenarios (unchanged core logic but using helpers)
function fillTestScenario(s){ clearFieldErrors(); const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val; }; const basic=()=>{ set('wd_currency','USD'); set('user_token_id','testuser_withdrawal_123'); set('merchant_unique_id', generateUniqueId('wd')); set('country','US'); set('phone','+15551234567'); set('version','4.0.0'); const cf=document.getElementById('customFields'); if(cf){ cf.innerHTML=''; customFieldCounter=0; } document.getElementById('enableOpenAmount').checked=false; document.getElementById('enableRedirectUrls').checked=false; toggleOpenAmount(); toggleRedirectUrls(); };
    switch(s){
        case 'small-withdrawal': basic(); set('wd_amount','25.00'); set('first_name','Alice'); set('last_name','Small'); set('email','alice.small@test.com'); showMessage('Small withdrawal scenario loaded ($25)','success'); break;
        case 'medium-withdrawal': basic(); set('wd_amount','250.00'); set('first_name','Bob'); set('last_name','Medium'); set('email','bob.medium@test.com'); showMessage('Medium withdrawal scenario loaded ($250)','success'); break;
        case 'large-withdrawal': basic(); set('wd_amount','2500.00'); set('first_name','Charlie'); set('last_name','Large'); set('email','charlie.large@test.com'); showMessage('Large withdrawal scenario loaded ($2,500)','warning'); break;
        case 'fixed-amount': basic(); set('wd_amount','100.00'); set('first_name','Fixed'); set('last_name','Amount'); set('email','fixed.amount@test.com'); document.getElementById('enableOpenAmount').checked=false; toggleOpenAmount(); showMessage('Fixed amount withdrawal scenario loaded','info'); break;
        case 'open-amount': basic(); set('wd_amount','50.00'); set('first_name','Open'); set('last_name','Range'); set('email','open.range@test.com'); document.getElementById('enableOpenAmount').checked=true; toggleOpenAmount(); set('wd_min_amount','10.00'); set('wd_max_amount','1000.00'); showMessage('Open amount withdrawal scenario loaded ($10-$1000)','info'); break;
        case 'euro-withdrawal': basic(); set('wd_currency','EUR'); set('wd_amount','100.00'); set('first_name','Euro'); set('last_name','User'); set('email','euro.user@test.com'); set('country','DE'); set('merchantLocale','de_DE'); showMessage('Euro withdrawal scenario loaded (€100)','success'); break;
    }
    generateTimestamp(); setTimeout(()=>{ document.querySelectorAll('textarea').forEach(t=>t.dispatchEvent(new Event('input',{bubbles:true}))); },100); }

// Messages
function showMessage(msg,type='info'){ const existing=document.querySelector('.message'); if(existing) existing.remove(); const div=document.createElement('div'); div.className=`message message-${type}`; div.textContent=msg; div.style.cssText='position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:6px;color:#fff;font-weight:500;z-index:1000;animation:slideIn .3s ease-out;'; const colors={success:'#28a745',warning:'#ffc107',error:'#dc3545',info:'#17a2b8'}; div.style.backgroundColor=colors[type]||colors.info; if(type==='warning') div.style.color='#000'; document.body.appendChild(div); setTimeout(()=>{ if(div.parentNode) div.remove(); },3000); }

// Unload prompt
function initializeUnloadPrompt(){ let awaiting=false; window.addEventListener('beforeunload',e=>{ if(!document.getElementById('enableLocalStorage')?.checked){ if(checkForUnsavedData() && !awaiting){ awaiting=true; const msg='You have unsaved withdrawal form data. Do you want to leave?'; e.preventDefault(); e.returnValue=msg; return msg; } } }); document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible' && awaiting){ awaiting=false; if(confirm('Save your withdrawal form data for next time?')){ const box=document.getElementById('enableLocalStorage'); if(box){ box.checked=true; toggleLocalStorage(); } } } }); }
function checkForUnsavedData(){ const form=document.getElementById('withdrawal-form'); const fd=new FormData(form); for(let [k,v] of fd.entries()){ if(v.trim()!=='' && k!=='version') return true; } return false; }

// Utility
function generateUniqueId(prefix='id'){ return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2,5)}`; }

// Initialization
function initializeWithdrawalTool(){ try { initializeTheme(); initializeCompactMode(); initializeAutoSave(); initializeErrorHandling(); initializeAutoResizeTextareas(); initializeUnloadPrompt(); loadFormData(); generateTimestamp(); if (DEBUG) console.log('Withdrawal tool initialized'); } catch(e){ if(DEBUG) console.error('Initialization error',e); } }

document.addEventListener('DOMContentLoaded', initializeWithdrawalTool);
window.addEventListener('load', ()=>{ setTimeout(()=>{ if(!document.getElementById('timeStamp')?.value) generateTimestamp(); },1000); });

// Ensure functions are globally available for onclick handlers (htmlpreview compatibility)
if (typeof window !== 'undefined') {
    window.generateWithdrawalUrl = generateWithdrawalUrl;
    window.copyToClipboard = copyToClipboard;
    window.openWithdrawalPage = openWithdrawalPage;
    window.clearForm = clearForm;
    window.fillSampleData = fillSampleData;
    window.fillTestScenario = fillTestScenario;
    window.generateTimestamp = generateTimestamp;
    window.toggleOpenAmount = toggleOpenAmount;
    window.toggleRedirectUrls = toggleRedirectUrls;
    window.toggleSection = toggleSection;
    window.toggleDarkMode = toggleDarkMode;
    window.toggleCompactMode = toggleCompactMode;
    window.toggleLocalStorage = toggleLocalStorage;
    window.addCustomField = addCustomField;
    window.removeCustomField = removeCustomField;
    window.addAdditionalParameter = addAdditionalParameter;
    window.removeAdditionalParameter = removeAdditionalParameter;
}
