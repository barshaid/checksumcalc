// Nuvei Checksum Calculator & Cashier Page Generator
// Comprehensive single-page tool with all parameters

// Debug: Confirm script is loading
console.log('🚀 Nuvei Payment Tool script loaded successfully!');
console.log('⏰ Script load time:', new Date().toISOString());

const NUVEI_SANDBOX_CASHIER_URL = 'https://ppp-test.safecharge.com/ppp/purchase.do';

// Initialize the application - consolidated DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme and layout
    initializeTheme();
    initializeCompactMode();
    initializeErrorHandling();
    initializeAutoSave(); // NEW: set checkbox state from persistence before loading
    
    // Load saved form data
    loadFormData();
    
    // Auto-save form data on input
    const form = document.getElementById('payment-form');
    form.addEventListener('input', saveFormData);
    form.addEventListener('change', saveFormData);
    
    // Add form validation on submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            generateCashierUrl();
        }
    });
    
    // Initialize with current timestamp
    generateTimestamp();
    
    // Initialize total calculation
    calculateTotal();
    
    // Add special theme listeners
    initializeSpecialTheme();
    initializeUnloadPrompt(); // new: prompt on page exit to optionally save
    
    // Initialize total amount click behavior
    attachTotalAmountClickBehavior();
    
    // Initialize obfuscated theme activation
    __tA('hello','kitty');
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Alt+S to fill sample data
        if (e.ctrlKey && e.altKey && e.key === 's') {
            e.preventDefault();
            fillSampleData();
        }
        
        // Ctrl+Enter to generate URL
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            generateCashierUrl();
        }
    });
});

// Fallback initialization for live environments - runs after all resources are loaded
window.addEventListener('load', function() {
    console.log('Window load event triggered');
    
    // Double-check theme initialization in case DOMContentLoaded had timing issues
    setTimeout(() => {
        const firstNameField = document.getElementById('first_name');
        const lastNameField = document.getElementById('last_name');
        
        console.log('Checking theme initialization...', { 
            firstNameField: !!firstNameField, 
            lastNameField: !!lastNameField 
        });
        
        if (firstNameField && lastNameField) {
            // Check if listeners are working by testing a simple property
            if (!firstNameField.hasAttribute('data-theme-ready')) {
                console.log('Fallback theme initialization triggered');
                initializeSpecialTheme();
                __tA('hello','kitty');
                firstNameField.setAttribute('data-theme-ready', 'true');
                lastNameField.setAttribute('data-theme-ready', 'true');
            } else {
                console.log('Theme already initialized');
            }
        } else {
            console.error('Form fields not found during fallback initialization');
        }
    }, 500);
    
    // Additional ultra-fallback for hosted environments
    setTimeout(() => {
        const firstNameField = document.getElementById('first_name');
        const lastNameField = document.getElementById('last_name');
        
        if (firstNameField && lastNameField && !firstNameField.hasAttribute('data-theme-ready')) {
            console.log('Ultra-fallback theme initialization triggered');
            
            // Force add event listeners directly
            function directThemeCheck() {
                try {
                    const firstName = firstNameField.value.toLowerCase().trim();
                    const lastName = lastNameField.value.toLowerCase().trim();
                    
                    console.log('Theme check:', { firstName, lastName });
                    
                    if (firstName === 'hello' && lastName === 'kitty') {
                        console.log('Hello Kitty detected - activating theme');
                        if (document.body.getAttribute('data-theme') !== 'pink') {
                            activateTheme();
                        }
                    }
                } catch (error) {
                    console.error('Error in direct theme check:', error);
                }
            }
            
            function directObfuscatedCheck() {
                try {
                    const firstName = firstNameField.value.toLowerCase().trim();
                    const lastName = lastNameField.value.toLowerCase().trim();
                    
                    if (firstName === 'hello' && lastName === 'kitty') {
                        console.log('Obfuscated theme detected');
                        if (document.body.getAttribute('data-theme') !== 'x1') {
                            __tg();
                        }
                    }
                } catch (error) {
                    console.error('Error in direct obfuscated check:', error);
                }
            }
            
            // Add both theme listeners directly
            firstNameField.addEventListener('blur', directThemeCheck);
            lastNameField.addEventListener('blur', directThemeCheck);
            firstNameField.addEventListener('blur', directObfuscatedCheck);
            lastNameField.addEventListener('blur', directObfuscatedCheck);
            
            // Also add on input for more responsive behavior
            firstNameField.addEventListener('input', directThemeCheck);
            lastNameField.addEventListener('input', directThemeCheck);
            firstNameField.addEventListener('input', directObfuscatedCheck);
            lastNameField.addEventListener('input', directObfuscatedCheck);
            
            firstNameField.setAttribute('data-theme-ready', 'true');
            lastNameField.setAttribute('data-theme-ready', 'true');
            
            console.log('Direct theme listeners added successfully');
        }
    }, 2000); // Wait 2 seconds as final fallback
});

// Dark mode functionality
function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button text
    const button = document.getElementById('toggleDarkMode');
    button.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const button = document.getElementById('toggleDarkMode');
    if (button) {
        button.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Compact mode functionality
function toggleCompactMode() {
    const container = document.querySelector('.container');
    const isCompact = container.classList.contains('compact-mode');
    
    if (isCompact) {
        container.classList.remove('compact-mode');
        localStorage.setItem('compactMode', 'false');
        document.getElementById('toggleCompact').textContent = '📊';
    } else {
        container.classList.add('compact-mode');
        localStorage.setItem('compactMode', 'true');
        document.getElementById('toggleCompact').textContent = '📋';
    }
}

function initializeCompactMode() {
    const savedCompact = localStorage.getItem('compactMode') === 'true';
    const container = document.querySelector('.container');
    
    if (savedCompact) {
        container.classList.add('compact-mode');
        document.getElementById('toggleCompact').textContent = '📋';
    } else {
        document.getElementById('toggleCompact').textContent = '📊';
    }
}

// Generate current timestamp
function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Nuvei format: YYYY-MM-DD.HH:MM:SS
    const timestamp = `${year}-${month}-${day}.${hours}:${minutes}:${seconds}`;
    document.getElementById('time_stamp').value = timestamp;
}
// Items Management
let itemCounter = 1; // Start at 1 since item_1 is mandatory

function getNextItemNumber() {
    // Find the next available item number
    let nextNumber = 2; // Start from 2 since item 1 is mandatory
    while (document.getElementById(`item-${nextNumber}`)) {
        nextNumber++;
    }
    return nextNumber;
}

function addItem() {
    const itemNumber = getNextItemNumber();
    const container = document.getElementById('itemsContainer');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row';
    itemDiv.id = `item-${itemNumber}`;
    itemDiv.setAttribute('data-item-number', itemNumber);
    
    itemDiv.innerHTML = `
        <div class="item-header">
            <button type="button" class="collapse-item-btn" onclick="toggleItemCollapse(${itemNumber}, this)" aria-expanded="true">▼</button>
            <span class="item-label">Item ${itemNumber}</span>
            <button type="button" class="remove-item-btn" onclick="removeItem(${itemNumber})">Remove</button>
        </div>
        <div class="item-body">
            <div class="form-row four-columns">
                <div class="form-group">
                    <label for="item_name_${itemNumber}">Item Name:</label>
                    <input type="text" id="item_name_${itemNumber}" name="item_name_${itemNumber}" placeholder="Product Name">
                </div>
                <div class="form-group">
                    <label for="item_amount_${itemNumber}">Item Amount:</label>
                    <input type="text" id="item_amount_${itemNumber}" name="item_amount_${itemNumber}" placeholder="0.00" onchange="calculateTotal()">
                </div>
                <div class="form-group">
                    <label for="item_quantity_${itemNumber}">Quantity:</label>
                    <input type="text" id="item_quantity_${itemNumber}" name="item_quantity_${itemNumber}" placeholder="1" value="1" onchange="calculateTotal()">
                </div>
                <div class="form-group">
                    <label>Item Total:</label>
                    <input type="text" id="item_total_${itemNumber}" placeholder="0.00" readonly class="auto-calculated">
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(itemDiv);
    itemCounter = Math.max(itemCounter, itemNumber);

    // Prefill with sample data for convenience (only for items beyond the first)
    if (itemNumber > 1) {
        const nameField = document.getElementById(`item_name_${itemNumber}`);
        const amountField = document.getElementById(`item_amount_${itemNumber}`);
        const quantityField = document.getElementById(`item_quantity_${itemNumber}`);
        if (nameField) nameField.value = `Sample Item ${itemNumber}`;
        if (amountField) amountField.value = (itemNumber * 10).toFixed(2);
        if (quantityField) quantityField.value = '1';
    }

    calculateTotal();
}

function removeItem(itemNumber) {
    if (itemNumber === 1) {
        alert('Item 1 is required and cannot be removed.');
        return;
    }
    
    const itemDiv = document.getElementById(`item-${itemNumber}`);
    if (itemDiv) {
        itemDiv.remove();
        calculateTotal();
    }
}

// Enhanced total calculation - simplified without transaction-level adjustments
function calculateTotal() {
    let transactionTotal = 0;
    
    // Calculate per-item totals and sum them
    const itemRows = document.querySelectorAll('.item-row');
    itemRows.forEach(row => {
        const itemNumber = row.getAttribute('data-item-number');
        const amountField = document.getElementById(`item_amount_${itemNumber}`);
        const quantityField = document.getElementById(`item_quantity_${itemNumber}`);
        const totalField = document.getElementById(`item_total_${itemNumber}`);
        
        if (amountField && quantityField && totalField) {
            const amount = parseFloat(amountField.value) || 0;
            const quantity = parseInt(quantityField.value) || 0;
            
            // Format amount with 2 decimal places
            if (amountField.value && amount > 0) {
                amountField.value = amount.toFixed(2);
            }
            
            // Calculate item total: item_amount * quantity
            const itemTotal = amount * quantity;
            totalField.value = itemTotal.toFixed(2);
            
            transactionTotal += itemTotal;
        }
    });
    
    // Update total amount field
    const totalAmountField = document.getElementById('total_amount');
    if (totalAmountField) {
        // Round to nearest hundredth as per Nuvei documentation
        totalAmountField.value = Math.round(transactionTotal * 100) / 100;
        totalAmountField.value = totalAmountField.value.toString();
        if (totalAmountField.value.indexOf('.') === -1) {
            totalAmountField.value += '.00';
        } else if (totalAmountField.value.split('.')[1].length === 1) {
            totalAmountField.value += '0';
        }
    }
}

// Toggle open amount fields
function toggleOpenAmount() {
    const checkbox = document.getElementById('enableOpenAmount');
    const section = document.getElementById('openAmountSection');
    const amountField = document.getElementById('total_amount');
    
    if (checkbox.checked) {
        section.style.display = 'flex';
        amountField.required = false;
        amountField.placeholder = 'Optional when open amount is enabled';
    } else {
        section.style.display = 'none';
        amountField.required = true;
        amountField.placeholder = '100.00';
    }
}

// Toggle response URLs section
function toggleResponseUrls() {
    const checkbox = document.getElementById('enableResponseUrls');
    const section = document.getElementById('responseUrlsSection');
    const notifyUrl = document.getElementById('notify_url');
    
    if (checkbox.checked) {
        section.style.display = 'block';
        notifyUrl.required = true;
    } else {
        section.style.display = 'none';
        notifyUrl.required = false;
        // Clear URL fields when hidden
        document.getElementById('success_url').value = '';
        document.getElementById('error_url').value = '';
        document.getElementById('pending_url').value = '';
        document.getElementById('notify_url').value = '';
    }
}

// Toggle payment method fields based on selected option
function togglePaymentMethodFields() {
    const selectedRadio = document.querySelector('input[name="paymentMethodOption"]:checked');
    const option = selectedRadio ? selectedRadio.value : 'default';
    const fieldsContainer = document.getElementById('paymentMethodFields');
    const singleMethodGroup = document.getElementById('singleMethodGroup');
    const multipleMethodsGroup = document.getElementById('multipleMethodsGroup');
    
    // Clear all fields first
    document.getElementById('payment_method').value = '';
    document.getElementById('payment_methods').value = '';
    
    if (option === 'default') {
        fieldsContainer.style.display = 'none';
        singleMethodGroup.style.display = 'none';
        multipleMethodsGroup.style.display = 'none';
    } else if (option === 'preselect') {
        fieldsContainer.style.display = 'block';
        singleMethodGroup.style.display = 'block';
        multipleMethodsGroup.style.display = 'none';
    } else if (option === 'filter') {
        fieldsContainer.style.display = 'block';
        singleMethodGroup.style.display = 'none';
        multipleMethodsGroup.style.display = 'block';
    }
}

// Additional Parameters Management
let additionalParamCounter = 0;

function getNextAdditionalParamNumber() {
    // Find the next available additional parameter number
    let nextNumber = 1;
    while (document.getElementById(`additional-param-${nextNumber}`)) {
        nextNumber++;
    }
    return nextNumber;
}

function addAdditionalParameter() {
    const paramNumber = getNextAdditionalParamNumber();
    const container = document.getElementById('additionalParameters');
    
    const paramDiv = document.createElement('div');
    paramDiv.className = 'additional-param';
    paramDiv.id = `additional-param-${paramNumber}`;
    
    paramDiv.innerHTML = `
        <div class="form-group param-name">
            <label for="param-name-${paramNumber}">Parameter Name:</label>
            <input type="text" id="param-name-${paramNumber}" 
                   name="param-name-${paramNumber}" 
                   placeholder="customParam" 
                   data-param-counter="${paramNumber}">
        </div>
        <div class="form-group param-value">
            <label for="param-value-${paramNumber}">Parameter Value:</label>
            <input type="text" id="param-value-${paramNumber}" 
                   name="param-value-${paramNumber}" 
                   placeholder="customValue" 
                   data-param-counter="${paramNumber}">
        </div>
        <button type="button" class="remove-param-btn" onclick="removeAdditionalParameter(${paramNumber})">
            Remove
        </button>
    `;
    
    container.appendChild(paramDiv);
    additionalParamCounter = Math.max(additionalParamCounter, paramNumber); // Update counter to highest number
}

function removeAdditionalParameter(counter) {
    const paramDiv = document.getElementById(`additional-param-${counter}`);
    if (paramDiv) {
        paramDiv.remove();
    }
}

// Custom Fields Management
let customFieldCounter = 0;

function getNextCustomFieldNumber() {
    // Find the next available custom field number
    let nextNumber = 1;
    while (document.getElementById(`custom-field-${nextNumber}`)) {
        nextNumber++;
    }
    return nextNumber;
}

function addCustomField() {
    const MAX_CUSTOM_FIELDS = 15;
    const container = document.getElementById('customFields');
    const existing = container ? container.querySelectorAll('[data-custom-field]').length : 0;
    if (existing >= MAX_CUSTOM_FIELDS) {
        showMessage(`Maximum of ${MAX_CUSTOM_FIELDS} custom fields reached.`, 'warning');
        return;
    }
    const fieldNumber = getNextCustomFieldNumber();
    // Safety: if fieldNumber would exceed cap, abort
    if (fieldNumber > MAX_CUSTOM_FIELDS) {
        showMessage(`Maximum of ${MAX_CUSTOM_FIELDS} custom fields reached.`, 'warning');
        return;
    }
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'additional-param';
    fieldDiv.id = `custom-field-${fieldNumber}`;
    
    fieldDiv.innerHTML = `
        <div class="form-group">
            <label for="customField${fieldNumber}">Custom Field ${fieldNumber}:</label>
            <input type="text" id="customField${fieldNumber}" 
                   name="customField${fieldNumber}" 
                   placeholder="Custom value ${fieldNumber}" 
                   data-custom-field="${fieldNumber}">
        </div>
        <button type="button" class="remove-param-btn" onclick="removeCustomField(${fieldNumber})">
            Remove
        </button>
    `;
    
    container.appendChild(fieldDiv);
    customFieldCounter = Math.max(customFieldCounter, fieldNumber); // Update counter to highest number
}

function removeCustomField(counter) {
    const fieldDiv = document.getElementById(`custom-field-${counter}`);
    if (fieldDiv) {
        fieldDiv.remove();
    }
}

// SHA-256 hash function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// MD5 hash function (manual implementation for environments without SubtleCrypto MD5)
// Note: MD5 is NOT secure for production signing; provided only for legacy comparison/testing.
function md5(message) {
    function toUtf8Bytes(str){return new TextEncoder().encode(str);}    
    function rotateLeft(lValue, iShiftBits) {return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));}
    function addUnsigned(lX, lY) {var lX4,lY4,lX8,lY8,lResult; lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000); lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000); lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF); if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8); if (lX4 | lY4) { if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8); else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);} else { return (lResult ^ lX8 ^ lY8);} }
    function F(x,y,z){return (x & y) | ((~x) & z);} function G(x,y,z){return (x & z) | (y & (~z));} function H(x,y,z){return x ^ y ^ z;} function I(x,y,z){return y ^ (x | (~z));}
    function FF(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(F(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);} function GG(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(G(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);} function HH(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(H(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);} function II(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(I(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);}    
    function convertToWordArray(utf8Bytes){var lWordCount; var lMessageLength = utf8Bytes.length; var lNumberOfWords_temp1=lMessageLength+8; var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64; var lNumberOfWords=(lNumberOfWords_temp2+1)*16; var lWordArray=new Array(lNumberOfWords-1); var bytePosition=0; var byteCount=0; while(byteCount<lMessageLength){ lWordCount=(byteCount-(byteCount % 4))/4; bytePosition=(byteCount % 4)*8; lWordArray[lWordCount]=(lWordArray[lWordCount] | (utf8Bytes[byteCount]<<bytePosition)); byteCount++; } lWordCount=(byteCount-(byteCount % 4))/4; bytePosition=(byteCount % 4)*8; lWordArray[lWordCount]=lWordArray[lWordCount] | (0x80<<bytePosition); lWordArray[lNumberOfWords-2]=lMessageLength<<3; lWordArray[lNumberOfWords-1]=lMessageLength>>>29; return lWordArray; }
    function wordToHex(lValue){var WordToHexValue="",WordToHexValue_temp="",lByte,lCount; for(lCount=0;lCount<=3;lCount++){ lByte=(lValue>>>(lCount*8)) & 255; WordToHexValue_temp="0"+lByte.toString(16); WordToHexValue += WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);} return WordToHexValue; }
    var x = convertToWordArray(toUtf8Bytes(message)); var a=0x67452301; var b=0xEFCDAB89; var c=0x98BADCFE; var d=0x10325476; var S11=7,S12=12,S13=17,S14=22; var S21=5,S22=9,S23=14,S24=20; var S31=4,S32=11,S33=16,S34=23; var S41=6,S42=10,S43=15,S44=21; for (var k=0;k<x.length;k+=16){ var AA=a,BB=b,CC=c,DD=d; a=FF(a,b,c,d,x[k+0], S11,0xD76AA478); d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756); c=FF(c,d,a,b,x[k+2], S13,0x242070DB); b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE); a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF); d=FF(d,a,b,c,x[k+5], S12,0x4787C62A); c=FF(c,d,a,b,x[k+6], S13,0xA8304613); b=FF(b,c,d,a,x[k+7], S14,0xFD469501); a=FF(a,b,c,d,x[k+8], S11,0x698098D8); d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF); c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1); b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE); a=FF(a,b,c,d,x[k+12],S11,0x6B901122); d=FF(d,a,b,c,x[k+13],S12,0xFD987193); c=FF(c,d,a,b,x[k+14],S13,0xA679438E); b=FF(b,c,d,a,x[k+15],S14,0x49B40821); a=GG(a,b,c,d,x[k+1], S21,0xF61E2562); d=GG(d,a,b,c,x[k+6], S22,0xC040B340); c=GG(c,d,a,b,x[k+11],S23,0x265E5A51); b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA); a=GG(a,b,c,d,x[k+5], S21,0xD62F105D); d=GG(d,a,b,c,x[k+10],S22,0x02441453); c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681); b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8); a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6); d=GG(d,a,b,c,x[k+14],S22,0xC33707D6); c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87); b=GG(b,c,d,a,x[k+8], S24,0x455A14ED); a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905); d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8); c=GG(c,d,a,b,x[k+7], S23,0x676F02D9); b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A); a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942); d=HH(d,a,b,c,x[k+8], S32,0x8771F681); c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122); b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C); a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44); d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9); c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60); b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70); a=HH(a,b,c,d,x[k+13], S31,0x289B7EC6); d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA); c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085); b=HH(b,c,d,a,x[k+6], S34,0x04881D05); a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039); d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5); c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8); b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665); a=II(a,b,c,d,x[k+0], S41,0xF4292244); d=II(d,a,b,c,x[k+7], S42,0x432AFF97); c=II(c,d,a,b,x[k+14],S43,0xAB9423A7); b=II(b,c,d,a,x[k+5], S44,0xFC93A039); a=II(a,b,c,d,x[k+12],S41,0x655B59C3); d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92); c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D); b=II(b,c,d,a,x[k+1], S44,0x85845DD1); a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F); d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0); c=II(c,d,a,b,x[k+6], S43,0xA3014314); b=II(b,c,d,a,x[k+13],S44,0x4E0811A1); a=II(a,b,c,d,x[k+4], S41,0xF7537E82); d=II(d,a,b,c,x[k+11],S42,0xBD3AF235); c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB); b=II(b,c,d,a,x[k+9], S44,0xEB86D391); a=addUnsigned(a,AA); b=addUnsigned(b,BB); c=addUnsigned(c,CC); d=addUnsigned(d,DD); }
    return (wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d)).toLowerCase();
}

// Get form data as object
function getFormData() {
    const form = document.getElementById('payment-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '') {
            // Handle checkboxes
            if (key === 'enableOpenAmount' || key === 'enableResponseUrls') {
                data[key] = 'true';
            } else {
                data[key] = value.trim();
            }
        }
    }
    
    // Handle additional parameters
    const additionalParams = document.querySelectorAll('.additional-param');
    additionalParams.forEach(paramDiv => {
        const nameInput = paramDiv.querySelector('[data-param-counter]');
        const valueInput = paramDiv.querySelector('[data-param-counter]:last-of-type');
        
        if (nameInput && valueInput && nameInput.value.trim() && valueInput.value.trim()) {
            const paramName = nameInput.value.trim();
            const paramValue = valueInput.value.trim();
            data[paramName] = paramValue;
        }
    });
    
    // Handle dynamic custom fields
    const customFields = document.querySelectorAll('[data-custom-field]');
    customFields.forEach(field => {
        if (field.value.trim()) {
            data[field.name] = field.value.trim();
        }
    });
    
    // Handle dynamic items - collect all items with their properties
    const itemRows = document.querySelectorAll('.item-row');
    itemRows.forEach(row => {
        const itemNumber = row.getAttribute('data-item-number');
        const itemName = document.getElementById(`item_name_${itemNumber}`)?.value.trim();
        const itemAmount = document.getElementById(`item_amount_${itemNumber}`)?.value.trim();
        const itemQuantity = document.getElementById(`item_quantity_${itemNumber}`)?.value.trim();
        
        if (itemName) data[`item_name_${itemNumber}`] = itemName;
        if (itemAmount) data[`item_amount_${itemNumber}`] = itemAmount;
        if (itemQuantity) data[`item_quantity_${itemNumber}`] = itemQuantity;
    });
    
    // Handle open amount parameters
    if (data.enableOpenAmount === 'true') {
        if (data.openAmountMin) {
            data['openAmount[min]'] = data.openAmountMin;
            delete data.openAmountMin;
        }
        if (data.openAmountMax) {
            data['openAmount[max]'] = data.openAmountMax;
            delete data.openAmountMax;
        }
        delete data.enableOpenAmount;
    }
    
    // Clean up other checkboxes and internal fields
    delete data.enableOpenAmount;
    delete data.enableResponseUrls;
    
    // Remove response URLs if not enabled
    const responseUrlsEnabled = document.getElementById('enableResponseUrls')?.checked;
    if (!responseUrlsEnabled) {
        delete data.success_url;
        delete data.error_url;
        delete data.pending_url;
        delete data.notify_url;
    }
    
    // Remove internal parameter fields
    Object.keys(data).forEach(key => {
        if (key.startsWith('param-name-') || key.startsWith('param-value-')) {
            delete data[key];
        }
    });
    
    // Handle payment method configuration
    const selectedRadio = document.querySelector('input[name="paymentMethodOption"]:checked');
    const paymentMethodOption = selectedRadio ? selectedRadio.value : 'default';
    
    if (paymentMethodOption === 'default') {
        // Don't include any payment method parameters for default
        delete data.payment_method;
        delete data.payment_methods;
        delete data.paymentMethodOption;
    } else if (paymentMethodOption === 'preselect') {
        // Include only payment_method for preselection
        delete data.payment_methods;
        delete data.paymentMethodOption;
    } else if (paymentMethodOption === 'filter') {
        // Include payment_methods and payment_method_mode for filtering
        delete data.payment_method;
        delete data.paymentMethodOption;
        if (data.payment_methods) {
            data.payment_method_mode = 'filter';
        }
    }
    
    return data;
}

// Create concatenated string for checksum calculation (Nuvei Payment Page format)
function createChecksumString(data, secretKey) {
    // According to Nuvei documentation, the checksum must use the exact order 
    // that parameters are sent in the request URL, NOT alphabetical order
    // Based on the example in their documentation, the standard order is:
    const urlParameterOrder = [
        'merchant_id', 'merchant_site_id', 'total_amount', 'currency',
        'user_token_id', 'merchant_unique_id', 'time_stamp', 'version', 'notify_url', 
        'first_name', 'last_name', 'email', 'phone1', 'country', 'state',
        'city', 'address1', 'zip', 'dateOfBirth', 'success_url', 'error_url', 'pending_url',
        'payment_method', 'payment_methods', 'payment_method_mode'
    ];
    
    // Add item fields in order (item_name_N, item_amount_N, item_quantity_N for each item)
    const itemFields = [];
    for (let i = 1; i <= 50; i++) { // Support up to 50 items
        if (data[`item_name_${i}`] || data[`item_amount_${i}`] || data[`item_quantity_${i}`]) {
            itemFields.push(`item_name_${i}`, `item_amount_${i}`, `item_quantity_${i}`);
        }
    }
    
    // Insert item fields after merchant info but before customer info
    const parameterOrderWithItems = [
        'merchant_id', 'merchant_site_id', 'total_amount', 'currency',
        'user_token_id', 'merchant_unique_id',
        ...itemFields,
        'time_stamp', 'version', 'notify_url', 
        'first_name', 'last_name', 'email', 'phone1', 'country', 'state',
        'city', 'address1', 'zip', 'dateOfBirth', 'success_url', 'error_url', 'pending_url',
        'payment_method', 'payment_methods', 'payment_method_mode'
    ];
    
    // Add any custom fields (these typically come after standard fields)
    const customFieldKeys = Object.keys(data).filter(key => key.startsWith('customField')).sort();
    const parameterOrder = [...parameterOrderWithItems, ...customFieldKeys];
    
    // Start with secret key
    let concatenatedString = secretKey;
    
    // Add parameter values in URL order (only values, no keys)
    for (const key of parameterOrder) {
        if (data[key] && data[key] !== '') {
            concatenatedString += data[key];
        }
    }
    
    // Add any remaining parameters that weren't in the core list (alphabetically)
    const remainingKeys = Object.keys(data)
        .filter(key => !parameterOrder.includes(key))
        .sort();
    
    for (const key of remainingKeys) {
        if (data[key] && data[key] !== '') {
            concatenatedString += data[key];
        }
    }
    
    return concatenatedString;
}

// Enhanced validation error handling with scrolling and highlighting
function showValidationError(missingFields, requiredFieldIds) {
    // Clear any existing error states
    clearFieldErrors();
    
    // Show alert with missing fields
    alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
    
    // Highlight ALL missing fields
    const missingFieldIds = requiredFieldIds.filter(fieldId => {
        const element = document.getElementById(fieldId);
        return !element || !element.value.trim();
    });
    
    // Apply error styling to all missing fields
    missingFieldIds.forEach(fieldId => {
        highlightField(fieldId);
    });
    
    // Scroll to the first missing field
    if (missingFieldIds.length > 0) {
        scrollToField(missingFieldIds[0]);
    }
}

function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error styling to the field
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
    }
}

function scrollToField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Find the section containing this field
    const section = field.closest('.section');
    if (section) {
        // Scroll to the section with some offset for better visibility
        const headerOffset = 100; // Account for header and some padding
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        // Focus the field after a brief delay to ensure scrolling completes
        setTimeout(() => {
            field.focus();
        }, 500);
    }
}

function highlightAndScrollToField(fieldId) {
    highlightField(fieldId);
    scrollToField(fieldId);
}

function clearFieldErrors() {
    // Remove error class from all form groups
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
    });
}

// Initialize error handling - clear errors when user starts typing
function initializeErrorHandling() {
    // Add event listeners to all form inputs to clear errors on input
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
        
        input.addEventListener('focus', function() {
            clearFieldError(this);
        });
    });
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup && formGroup.classList.contains('error')) {
        // Only clear the error if the field now has a value
        if (field.value.trim()) {
            formGroup.classList.remove('error');
        }
    }
}

// Auto-save preference initialization
function initializeAutoSave() {
    const box = document.getElementById('enableLocalStorage');
    if (!box) return;
    const enabled = localStorage.getItem('nuvei_auto_save_enabled') === 'true';
    box.checked = enabled;
}

// Toggle auto-save (called from checkbox onchange in HTML)
function toggleLocalStorage() {
    const box = document.getElementById('enableLocalStorage');
    if (!box) return;
    if (box.checked) {
        localStorage.setItem('nuvei_auto_save_enabled', 'true');
        saveFormData(); // immediately persist current state
        showMessage('Auto-save enabled', 'info');
    } else {
        localStorage.setItem('nuvei_auto_save_enabled', 'false');
        showMessage('Auto-save disabled', 'info');
    }
}

// Generate cashier URL and calculate checksum
async function generateCashierUrl() {
    try {
        // Base required fields (always required)
        const baseRequiredFields = [
            'merchant_id', 'merchant_site_id', 'secretKey', 'total_amount', 
            'currency', 'user_token_id', 'item_name_1', 'item_amount_1', 
            'item_quantity_1', 'time_stamp'
        ];
        
        let requiredFields = [...baseRequiredFields];
        
        // Add notify_url as required only if response URLs section is enabled
        const responseUrlsEnabled = document.getElementById('enableResponseUrls')?.checked;
        if (responseUrlsEnabled) {
            requiredFields.push('notify_url');
        }
        
        const missingFields = [];
        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                missingFields.push(field.replace('_', ' ').toUpperCase());
            }
        }
        
        if (missingFields.length > 0) {
            showValidationError(missingFields, requiredFields);
            return;
        }
        
        const formData = getFormData();
        const secretKey = document.getElementById('secretKey').value.trim();
        
        // Remove secret key from form data for checksum calculation
        delete formData.secretKey;
        
        // IMPORTANT: Remove spaces from all parameter values for both checksum and URL
        // According to Nuvei docs, spaces should be removed from values
        const cleanedFormData = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] && formData[key] !== '') {
                cleanedFormData[key] = formData[key].toString().replace(/\s/g, '');
            }
        });
        
        // Create concatenated string for checksum using cleaned data
        const concatenatedString = createChecksumString(cleanedFormData, secretKey);
        const algoSelect = document.getElementById('hash_algorithm');
        const algo = (algoSelect ? algoSelect.value : 'sha256').toLowerCase();
        let checksum;
        if (algo === 'md5') {
            checksum = md5(concatenatedString);
        } else {
            checksum = await sha256(concatenatedString);
        }
        cleanedFormData.checksum = checksum;
        const checksumField = document.getElementById('calculated-checksum');
        if (checksumField) {
            checksumField.title = `Algorithm: ${algo.toUpperCase()}`;
        }
        const checksumLabel = document.getElementById('checksum-label');
        if (checksumLabel) {
            checksumLabel.textContent = `${algo.toUpperCase()} Checksum:`;
        }
        
        // Build URL parameters in the same order as used for checksum calculation
        const urlParameterOrder = [
            'merchant_id', 'merchant_site_id', 'total_amount', 'currency',
            'user_token_id', 'merchant_unique_id', 'time_stamp', 'version', 'notify_url', 
            'first_name', 'last_name', 'email', 'phone1', 'country', 'state',
            'city', 'address1', 'zip', 'dateOfBirth', 'success_url', 'error_url', 'pending_url',
            'payment_method', 'payment_methods', 'payment_method_mode'
        ];
        
        // Add item fields in order
        const itemFields = [];
        for (let i = 1; i <= 50; i++) { // Support up to 50 items
            if (cleanedFormData[`item_name_${i}`] || cleanedFormData[`item_amount_${i}`] || cleanedFormData[`item_quantity_${i}`]) {
                itemFields.push(`item_name_${i}`, `item_amount_${i}`, `item_quantity_${i}`);
            }
        }
        
        // Insert item fields after merchant info
        const parameterOrderWithItems = [
            'merchant_id', 'merchant_site_id', 'total_amount', 'currency',
            'user_token_id', 'merchant_unique_id',
            ...itemFields,
            'time_stamp', 'version', 'notify_url', 
            'first_name', 'last_name', 'email', 'phone1', 'country', 'state',
            'city', 'address1', 'zip', 'dateOfBirth', 'success_url', 'error_url', 'pending_url',
            'payment_method', 'payment_methods', 'payment_method_mode'
        ];
        
        // Add custom fields to the order
        const customFieldKeys = Object.keys(cleanedFormData).filter(key => key.startsWith('customField')).sort();
        const fullParameterOrder = [...parameterOrderWithItems, ...customFieldKeys, 'checksum'];
        
        const urlParams = new URLSearchParams();
        
        // Add parameters in the specified order using cleaned data
        for (const key of fullParameterOrder) {
            if (cleanedFormData[key] && cleanedFormData[key] !== '') {
                urlParams.append(key, cleanedFormData[key]);
            }
        }
        
        // Add any remaining parameters not in the core list
        const remainingKeys = Object.keys(cleanedFormData)
            .filter(key => !fullParameterOrder.includes(key))
            .sort();
        
        for (const key of remainingKeys) {
            if (cleanedFormData[key] && cleanedFormData[key] !== '') {
                urlParams.append(key, cleanedFormData[key]);
            }
        }
        
        // Create complete URL
        const cashierUrl = `${NUVEI_SANDBOX_CASHIER_URL}?${urlParams.toString()}`;
        
        // Display results
        document.getElementById('concatenated-string').value = concatenatedString;
        document.getElementById('calculated-checksum').value = checksum;
        document.getElementById('cashier-url').value = cashierUrl;
        document.getElementById('results').style.display = 'block';
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        showMessage('Cashier URL and checksum generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating cashier URL:', error);
        alert('Error generating cashier URL. Please check your inputs.');
    }
}

// Copy text to clipboard
async function copyToClipboard(elementId) {
    try {
        const element = document.getElementById(elementId);
        const text = element.value;
        
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = '#d4edda';
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
        }, 1000);
        
        // Show success message
        showMessage('Copied to clipboard!', 'success');
        
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        
        // Fallback for older browsers
        const element = document.getElementById(elementId);
        element.select();
        document.execCommand('copy');
        showMessage('Copied to clipboard!', 'success');
    }
}

// Open cashier page in new tab
function openCashierPage() {
    const url = document.getElementById('cashier-url').value;
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('Please generate the cashier URL first');
    }
}

// Clear form
function clearForm() {
    const form = document.getElementById('payment-form');
    form.reset();
    
    // Hide result sections
    document.getElementById('results').style.display = 'none';
    
    // Reset dynamic sections
    document.getElementById('openAmountSection').style.display = 'none';
    document.getElementById('responseUrlsSection').style.display = 'none';
    document.getElementById('paymentMethodFields').style.display = 'none';
    
    // Clear additional parameters
    const additionalParamsContainer = document.getElementById('additionalParameters');
    additionalParamsContainer.innerHTML = '';
    additionalParamCounter = 0;
    
    // Clear custom fields
    const customFieldsContainer = document.getElementById('customFields');
    customFieldsContainer.innerHTML = '';
    customFieldCounter = 0;
    
    // Reset items to only item 1
    const itemsContainer = document.getElementById('itemsContainer');
    const allItems = itemsContainer.querySelectorAll('.item-row');
    allItems.forEach(item => {
        const itemNumber = item.getAttribute('data-item-number');
        if (itemNumber !== '1') {
            item.remove();
        }
    });
    itemCounter = 1;
    
    // Reset item 1 values
    document.getElementById('item_name_1').value = '';
    document.getElementById('item_amount_1').value = '';
    document.getElementById('item_quantity_1').value = '1';
    document.getElementById('item_total_1').value = '';
    
    // Reset payment method option to default (this is handled by form.reset() with the checked attribute)
    togglePaymentMethodFields();
    
    // Recalculate totals
    calculateTotal();
    
    showMessage('Form cleared!', 'info');
}

// Fill sample data
function fillSampleData() {
    // Sample merchant credentials (sandbox) - User needs to fill their own
    // document.getElementById('merchant_id').value = 'YOUR_MERCHANT_ID';
    // document.getElementById('merchant_site_id').value = 'YOUR_SITE_ID';
    
    // Sample transaction data
    document.getElementById('currency').value = 'USD';
    document.getElementById('item_name_1').value = 'Sample Product';
    document.getElementById('item_amount_1').value = '100.00';
    document.getElementById('item_quantity_1').value = '1';
    document.getElementById('merchant_unique_id').value = generateUniqueId('order');
    document.getElementById('user_token_id').value = 'user_12345';
    
    // Sample customer data
    document.getElementById('email').value = 'john.doe@example.com';
    document.getElementById('first_name').value = 'John';
    document.getElementById('last_name').value = 'Doe';
    document.getElementById('country').value = 'US';
    document.getElementById('phone1').value = '+1234567890';
    
    // Sample billing address
    document.getElementById('address1').value = '123 Main St';
    document.getElementById('city').value = 'New York';
    document.getElementById('state').value = 'NY';
    document.getElementById('zip').value = '10001';
    const dobField = document.getElementById('dateOfBirth');
    if (dobField) dobField.value = '1990-01-01'; // YYYY-MM-DD format
    
    // Removed automatic second item addition per user request
    
    // Sample custom fields
    const customFieldsContainer = document.getElementById('customFields');
    customFieldsContainer.innerHTML = '';
    customFieldCounter = 0;
    addCustomField();
    document.getElementById('customField1').value = 'affiliate-xyz';
    addCustomField();
    document.getElementById('customField2').value = 'promo-2024';
    
    generateTimestamp();
    calculateTotal();

    const credentialIds = new Set(['merchant_id','merchant_site_id','secretKey']);
    document.querySelectorAll('.form-group.error').forEach(group => {
        const inputs = Array.from(group.querySelectorAll('input, select, textarea'));
        const containsCredential = inputs.some(el => credentialIds.has(el.id));
        if (!containsCredential) {
            const hasValue = inputs.some(el => el.value && el.value.trim() !== '');
            if (hasValue) {
                group.classList.remove('error');
            }
        }
    });
    
    showMessage('Sample data filled in!', 'info');
    
    // Save immediately if auto-save is enabled
    if (document.getElementById('enableLocalStorage')?.checked) {
        saveFormData();
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#28a745';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#ffc107';
            messageDiv.style.color = '#000';
            break;
        default:
            messageDiv.style.backgroundColor = '#17a2b8';
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 3000);
}

// Form validation
function validateForm() {
    const form = document.getElementById('payment-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        
        if (!field.value.trim()) {
            group.classList.add('error');
            isValid = false;
        } else {
            group.classList.remove('error');
            group.classList.add('success');
        }
    });
    
    return isValid;
}

// Initialize unload prompt to offer auto-save when leaving with unsaved data
function initializeUnloadPrompt() {
    let awaitingStay = false;
    window.addEventListener('beforeunload', function(e) {
        const autoBox = document.getElementById('enableLocalStorage');
        const form = document.getElementById('payment-form');
        if (!autoBox || !form) return;
        if (autoBox.checked) return; // already enabled
        // Detect any meaningful user-entered data
        const hasData = Array.from(form.querySelectorAll('input, textarea, select'))
            .some(el => !['checkbox','radio','button','submit','reset','hidden'].includes(el.type) && el.value && el.value.trim() !== '');
        if (!hasData) return;
        // Set returnValue to trigger the browser's native prompt
        const msg = 'You have unsaved form data. Leave page or stay to enable auto-save?';
        e.preventDefault();
        e.returnValue = msg; // Standard
        awaitingStay = true; // If user cancels (Stay), we will ask about enabling auto-save
        return msg;
    });

    // After the native prompt, if the user stayed, visibility returns to visible
    document.addEventListener('visibilitychange', () => {
        if (awaitingStay && document.visibilityState === 'visible') {
            awaitingStay = false;
            const autoBox = document.getElementById('enableLocalStorage');
            if (autoBox && !autoBox.checked) {
                if (confirm('Enable auto-save and store current data for next time?')) {
                    autoBox.checked = true;
                    try { saveFormData(); } catch(_) {}
                    showMessage('Auto-save enabled.', 'info');
                }
            }
        }
    });
}

// Auto-save form data to localStorage (if enabled)
function saveFormData() {
    const localStorageEnabled = document.getElementById('enableLocalStorage')?.checked;
    if (!localStorageEnabled) return;
    try {
        const formData = getFormData();
        delete formData.secretKey; // never persist secret
        localStorage.setItem('nuvei_payment_form', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

// Load form data from localStorage (if available and enabled)
function loadFormData() {
    const localStorageEnabled = document.getElementById('enableLocalStorage')?.checked;
    if (!localStorageEnabled) return;
    try {
        const savedData = localStorage.getItem('nuvei_payment_form');
        if (savedData) {
            const data = JSON.parse(savedData);
            // Recreate dynamic items if needed
            let maxItem = 1;
            Object.keys(data).forEach(k => { const m = k.match(/^item_name_(\d+)$/); if (m) maxItem = Math.max(maxItem, parseInt(m[1],10)); });
            if (maxItem > 1) {
                const itemsContainer = document.getElementById('itemsContainer');
                if (itemsContainer && itemsContainer.style.display === 'none') {
                    itemsContainer.style.display = ''; // show container
                    const btn = document.querySelector('.collapse-items-btn');
                    if (btn) { btn.textContent = '▼'; btn.setAttribute('aria-expanded','true'); }
                }
                for (let i=2;i<=maxItem;i++) { if (!document.getElementById(`item-${i}`)) addItem(); }
            }
            const form = document.getElementById('payment-form');
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') field.checked = data[key] === 'true'; else field.value = data[key];
                }
            });
            if (data.enableOpenAmount === 'true') { const c = document.getElementById('enableOpenAmount'); if (c){ c.checked = true; toggleOpenAmount(); } }
            if (data.enableResponseUrls === 'true') { const c = document.getElementById('enableResponseUrls'); if (c){ c.checked = true; toggleResponseUrls(); } }
            calculateTotal();
        }
    } catch (error) { console.error('Error loading saved form data:', error); }
}

// Utility functions
function generateUniqueId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}`;
}

// Special theme initialization
function initializeSpecialTheme() {
    // Use setTimeout to ensure DOM is fully loaded and add retry mechanism
    function attemptInitialization(retries = 3) {
        const firstNameField = document.getElementById('first_name');
        const lastNameField = document.getElementById('last_name');
        
        if (!firstNameField || !lastNameField) {
            if (retries > 0) {
                // Retry after a short delay if elements aren't ready yet
                setTimeout(() => attemptInitialization(retries - 1), 200);
            } else {
                console.warn('Special theme initialization failed: form fields not found');
            }
            return;
        }
        
        function checkSpecialTheme() {
            try {
                const firstName = firstNameField?.value.toLowerCase().trim();
                const lastName = lastNameField?.value.toLowerCase().trim();
                
                if (firstName === 'hello' && lastName === 'kitty') {
                    // Only trigger if not already in pink theme
                    if (document.body.getAttribute('data-theme') !== 'pink') {
                        activateTheme();
                    }
                }
            } catch (error) {
                console.error('Error in special theme check:', error);
            }
        }
        
        // Add event listeners with error handling
        try {
            // Remove any existing listeners first to prevent duplicates
            firstNameField.removeEventListener('blur', checkSpecialTheme);
            lastNameField.removeEventListener('blur', checkSpecialTheme);
            
            // Add blur listeners to both fields - trigger when focus is lost
            firstNameField.addEventListener('blur', checkSpecialTheme);
            lastNameField.addEventListener('blur', checkSpecialTheme);
            
            // Mark fields as initialized
            firstNameField.setAttribute('data-theme-ready', 'true');
            lastNameField.setAttribute('data-theme-ready', 'true');
            
            console.log('Special theme listeners initialized successfully');
        } catch (error) {
            console.error('Error adding special theme listeners:', error);
        }
    }
    
    attemptInitialization();
}

// Very innocent function that definitely doesn't do anything special
function activateTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'pink') {
        document.body.setAttribute('data-theme', 'light');
        restoreOriginalText();
        document.querySelector('header h1').textContent = 'Nuvei Payment Integration Tool';
        document.querySelector('header p').textContent = 'Generate checksums and cashier page URLs for Nuvei sandbox environment';
    } else {
        document.body.setAttribute('data-theme', 'pink');
        fillSampleTestData();
        transformPage();
        document.querySelector('header h1').textContent = 'Hello Kitty Payment Tool ✨';
        document.querySelector('header p').textContent = 'Generate adorable checksums and cashier page URLs for Hello Kitty payments!';
    }
}

// Fill form with sample test data
function fillSampleTestData() {
    const sampleTestData = {
        'merchantId': '427583496191624621',
        'merchantSiteId': '142033',
        'currency': 'USD',
        'amount': '25.99',
        'first_name': 'Hello',
        'last_name': 'Kitty',
        'address': '1-16-14 Higashi-gotanda',
        'city': 'Shinagawa',
        'state': 'Tokyo',
        'zip': '141-8560',
        'country': 'JP',
        'phone': '+81-3-5434-1111',
        'email': 'hello@sanrio.com',
        'merchantSecretKey': 'your-secret-key-here',
        'checksum': '',
        'timeStamp': generateTimestamp(),
        'item_name_1': 'Hello Kitty Plushie',
        'item_amount_1': '15.99',
        'item_quantity_1': '1',
        'item_name_2': 'Bow Hair Clip',
        'item_amount_2': '9.99',
        'item_quantity_2': '1'
    };

    // Fill all form fields
    Object.keys(sampleTestData).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = sampleTestData[key];
        }
    });

    // Trigger amount calculation
    if (typeof calculateTotal === 'function') {
        calculateTotal();
    }
}

// Text transformation utilities - Special themed
function transform(text) {
    return text
        .replace(/payment/gi, 'Hello Kitty payment')
        .replace(/transaction/gi, 'adorable transaction')
        .replace(/generate/gi, 'create cute')
        .replace(/checksum/gi, 'magical checksum')
        .replace(/url/gi, 'kawaii URL')
        .replace(/amount/gi, 'cuteness amount')
        .replace(/total/gi, 'super cute total')
        .replace(/error/gi, 'oopsie')
        .replace(/success/gi, 'purr-fect')
        .replace(/validate/gi, 'check cuteness')
        .replace(/processing/gi, 'sprinkling magic')
        + (Math.random() > 0.8 ? ' ✨' : Math.random() > 0.6 ? ' 🎀' : '');
}

let originalTexts = new Map();

function transformPage() {
    // Store original texts
    document.querySelectorAll('h1, h2, h3, h4, label, button, p, small, .radio-option').forEach(element => {
        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.textContent);
        }
        if (!element.querySelector('input') && !element.querySelector('a')) {
            element.textContent = transform(originalTexts.get(element));
        }
    });
    
    // Special transformations for placeholders
    const placeholders = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    placeholders.forEach(input => {
        if (!originalTexts.has(input)) {
            originalTexts.set(input, input.placeholder);
        }
        input.placeholder = transform(originalTexts.get(input));
    });
}

function restoreOriginalText() {
    originalTexts.forEach((originalText, element) => {
        if (element.placeholder !== undefined) {
            element.placeholder = originalText;
        } else {
            element.textContent = originalText;
        }
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sha256,
        md5,
        createChecksumString,
        getFormData,
        generateUniqueId,
        toggleLocalStorage
    };
}

function toggleItemCollapse(itemNumber, btn) {
    const body = document.querySelector(`#item-${itemNumber} .item-body`);
    if (!body) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? '' : 'none';
    btn.textContent = isHidden ? '▼' : '▶';
    btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
}

function toggleItemsSection(btn) {
    const container = document.getElementById('itemsContainer');
    if (!container) return;
    const isHidden = container.style.display === 'none';
    container.style.display = isHidden ? '' : 'none';
    btn.textContent = isHidden ? '▼' : '▶';
    btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
}

function attachTotalAmountClickBehavior() {
    const totalField = document.getElementById('total_amount');
    if (!totalField) return;
    totalField.style.cursor = 'pointer';
    totalField.addEventListener('click', () => {
        // Expand items section if collapsed
        const itemsToggleBtn = document.querySelector('.collapse-items-btn');
        const itemsContainer = document.getElementById('itemsContainer');
        if (itemsContainer && itemsContainer.style.display === 'none' && itemsToggleBtn) {
            toggleItemsSection(itemsToggleBtn);
        }
        // Expand first item if collapsed
        const firstItemBody = document.querySelector('#item-1 .item-body');
        const firstItemToggle = document.querySelector('#item-1 .collapse-item-btn');
        if (firstItemBody && firstItemBody.style.display === 'none' && firstItemToggle) {
            toggleItemCollapse(1, firstItemToggle);
        }
        // Focus on amount of first item
        const firstAmount = document.getElementById('item_amount_1');
        if (firstAmount) {
            firstAmount.focus();
        }
        showInlineHint(firstAmount, 'Edit item amount(s); total is auto-calculated.');
    }, { once: true });
}

function showInlineHint(targetEl, text) {
    if (!targetEl) return;
    const existing = document.querySelector('.inline-hint');
    if (existing) existing.remove();
    const hint = document.createElement('div');
    hint.className = 'inline-hint';
    hint.textContent = text;
    Object.assign(hint.style, {
        position: 'absolute',
        background: 'var(--accent-color)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: 2000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: '220px'
    });
    const rect = targetEl.getBoundingClientRect();
    hint.style.top = (window.scrollY + rect.top - 42) + 'px';
    hint.style.left = (window.scrollX + rect.left) + 'px';
    document.body.appendChild(hint);
    setTimeout(() => { hint.style.opacity = '0'; hint.style.transition = 'opacity .4s'; }, 2500);
    setTimeout(() => { if (hint.parentNode) hint.remove(); }, 3000);
}

// Obfuscated hidden theme activation
function __tA(a,b){
    function attemptInit(retries = 3) {
        try {
            const f=document.getElementById('first_name');
            const l=document.getElementById('last_name');
            if(!f||!l){
                if(retries > 0) {
                    setTimeout(() => attemptInit(retries - 1), 200);
                }
                return;
            }
            function c(){
                try {
                    const fn=f.value.toLowerCase().trim();
                    const ln=l.value.toLowerCase().trim();
                    if(fn===a&&ln===b){
                        if(document.body.getAttribute('data-theme')!=='x1'){
                            __tg();
                        }
                    }
                } catch(e) {
                    console.error('Obfuscated theme check error:', e);
                }
            }
            // Remove existing listeners to prevent duplicates
            f.removeEventListener('blur',c);
            l.removeEventListener('blur',c);
            // Add new listeners
            [f,l].forEach(el=>el.addEventListener('blur',c));
        } catch(e) {
            console.error('Obfuscated theme init error:', e);
        }
    }
    attemptInit();
} 

function __tg(){const ct=document.body.getAttribute('data-theme');if(ct==='x1'){document.body.setAttribute('data-theme','light');__rt();const h=document.querySelector('header h1');if(h)h.textContent='Nuvei Payment Integration Tool';const p=document.querySelector('header p');if(p)p.textContent='Generate checksums and cashier page URLs for Nuvei sandbox environment';}else{document.body.setAttribute('data-theme','x1');__fd();__kx();const h=document.querySelector('header h1');if(h)h.textContent='Payment Tool';const p=document.querySelector('header p');if(p)p.textContent='Generate checksums and cashier page URLs.';}}

function __fd(){const d={};d['currency']='USD';d['item_name_1']='Sample Item';d['item_amount_1']='15.99';d['item_quantity_1']='1';Object.keys(d).forEach(k=>{const el=document.getElementById(k);if(el)el.value=d[k];});if(typeof calculateTotal==='function'){calculateTotal();}}

function __kxT(t){return t.replace(/payment/gi,'payment').replace(/transaction/gi,'transaction');}
let __ot=new Map();
function __kx(){document.querySelectorAll('h1,h2,h3,h4,label,button,p,small,.radio-option').forEach(e=>{if(!__ot.has(e)){__ot.set(e,e.textContent);}if(!e.querySelector('input')&&!e.querySelector('a')){e.textContent=__kxT(__ot.get(e));}});document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(i=>{if(!__ot.has(i)){__ot.set(i,i.placeholder);}i.placeholder=__kxT(__ot.get(i));});}
function __rt(){__ot.forEach((v,e)=>{if(e.placeholder!==undefined){e.placeholder=v;}else{e.textContent=v;}});}

// Standalone theme initialization that doesn't depend on DOM events
// This runs immediately and periodically until fields are found
(function initializeThemeStandalone() {
    let attempts = 0;
    const maxAttempts = 50; // Try for up to 10 seconds (50 * 200ms)
    
    function tryInitialize() {
        attempts++;
        console.log(`Theme initialization attempt ${attempts}`);
        
        const firstNameField = document.getElementById('first_name');
        const lastNameField = document.getElementById('last_name');
        
        if (firstNameField && lastNameField) {
            console.log('Form fields found! Setting up theme listeners...');
            
            // Clear any existing listeners
            const existingListeners = [];
            
            function mainThemeCheck() {
                try {
                    const firstName = firstNameField.value.toLowerCase().trim();
                    const lastName = lastNameField.value.toLowerCase().trim();
                    
                    console.log(`Main theme check: "${firstName}" + "${lastName}"`);
                    
                    if (firstName === 'hello' && lastName === 'kitty') {
                        console.log('🎀 Hello Kitty theme activated!');
                        if (document.body.getAttribute('data-theme') !== 'pink') {
                            activateTheme();
                        }
                    }
                } catch (error) {
                    console.error('Error in main theme check:', error);
                }
            }
            
            function obfuscatedThemeCheck() {
                try {
                    const firstName = firstNameField.value.toLowerCase().trim();
                    const lastName = lastNameField.value.toLowerCase().trim();
                    
                    if (firstName === 'hello' && lastName === 'kitty') {
                        console.log('🔮 Obfuscated theme activated!');
                        if (document.body.getAttribute('data-theme') !== 'x1') {
                            __tg();
                        }
                    }
                } catch (error) {
                    console.error('Error in obfuscated theme check:', error);
                }
            }
            
            // Add multiple event types for maximum compatibility
            const events = ['blur', 'input', 'change', 'keyup'];
            events.forEach(eventType => {
                firstNameField.addEventListener(eventType, mainThemeCheck);
                lastNameField.addEventListener(eventType, mainThemeCheck);
                firstNameField.addEventListener(eventType, obfuscatedThemeCheck);
                lastNameField.addEventListener(eventType, obfuscatedThemeCheck);
            });
            
            // Mark as ready
            firstNameField.setAttribute('data-theme-ready', 'true');
            lastNameField.setAttribute('data-theme-ready', 'true');
            
            console.log('✅ Standalone theme initialization completed successfully!');
            return true; // Success
        }
        
        // If fields not found and we haven't exceeded max attempts, try again
        if (attempts < maxAttempts) {
            setTimeout(tryInitialize, 200);
        } else {
            console.error('❌ Failed to find form fields after maximum attempts');
        }
        
        return false;
    }
    
    // Start trying immediately
    tryInitialize();
})();

// Debug function that can be called manually from browser console
window.debugTheme = function() {
    console.log('=== Theme Debug Information ===');
    const firstNameField = document.getElementById('first_name');
    const lastNameField = document.getElementById('last_name');
    
    console.log('First name field:', firstNameField);
    console.log('Last name field:', lastNameField);
    
    if (firstNameField && lastNameField) {
        console.log('First name value:', `"${firstNameField.value}"`);
        console.log('Last name value:', `"${lastNameField.value}"`);
        console.log('Current theme:', document.body.getAttribute('data-theme'));
        console.log('Theme ready attribute:', firstNameField.getAttribute('data-theme-ready'));
        
        // Test theme activation manually
        if (firstNameField.value.toLowerCase().trim() === 'hello' && 
            lastNameField.value.toLowerCase().trim() === 'kitty') {
            console.log('🎀 Conditions met for Hello Kitty theme!');
            console.log('Triggering theme activation...');
            activateTheme();
        } else {
            console.log('❌ Hello Kitty conditions not met');
            console.log('Expected: first="hello", last="kitty"');
            console.log(`Got: first="${firstNameField.value.toLowerCase().trim()}", last="${lastNameField.value.toLowerCase().trim()}"`);
        }
    } else {
        console.log('❌ Form fields not found!');
    }
    console.log('=== End Debug Information ===');
};

// Global function to manually trigger theme
window.manualThemeActivation = function() {
    console.log('🎀 Manually activating Hello Kitty theme...');
    activateTheme();
};

window.manualObfuscatedTheme = function() {
    console.log('🔮 Manually activating obfuscated theme...');
    __tg();
};
