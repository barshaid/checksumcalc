// Nuvei Withdrawal Checksum Calculator & URL Generator
// Specialized tool for Nuvei withdrawal page integration

// Debug: Console log loading status
console.log('🚀 Nuvei Withdrawal Tool script loaded successfully!');
console.log('⏰ Script load time:', new Date().toISOString());

const NUVEI_SANDBOX_WITHDRAWAL_URL = 'https://ppp-test.safecharge.com/ppp/withdrawal/withdraw.do';
const NUVEI_PRODUCTION_WITHDRAWAL_URL = 'https://secure.safecharge.com/ppp/withdrawal/withdraw.do';

// Generate current timestamp
function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Nuvei withdrawal format: YYYYMMDDHHMMSS
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    document.getElementById('timeStamp').value = timestamp;
}

// Toggle open amount fields
function toggleOpenAmount() {
    const checkbox = document.getElementById('enableOpenAmount');
    const section = document.getElementById('openAmountSection');
    const amountField = document.getElementById('wd_amount');
    
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

// Toggle redirect URLs section
function toggleRedirectUrls() {
    const checkbox = document.getElementById('enableRedirectUrls');
    const section = document.getElementById('redirectUrlsSection');
    
    if (checkbox.checked) {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
        // Clear URL fields when hidden
        document.getElementById('successUrl').value = '';
        document.getElementById('failUrl').value = '';
        document.getElementById('backUrl').value = '';
    }
}

// Additional Parameters Management
let additionalParameterCounter = 0;

function getNextAdditionalParameterNumber() {
    let nextNumber = 1;
    while (document.getElementById(`additional-param-${nextNumber}`)) {
        nextNumber++;
    }
    return nextNumber;
}

function addAdditionalParameter() {
    console.log('🔧 addAdditionalParameter function called');
    
    try {
        const MAX_ADDITIONAL_PARAMS = 20;
        const container = document.getElementById('additionalParameters');
        
        if (!container) {
            console.error('❌ Container "additionalParameters" not found');
            showMessage('Error: Additional parameters container not found', 'error');
            return;
        }
        
        console.log('✅ Container found:', container);
        
        const existing = container.querySelectorAll('[data-additional-param]').length;
        console.log('📊 Existing additional parameters:', existing);
        
        if (existing >= MAX_ADDITIONAL_PARAMS) {
            console.warn(`⚠️ Maximum of ${MAX_ADDITIONAL_PARAMS} additional parameters reached`);
            showMessage(`Maximum of ${MAX_ADDITIONAL_PARAMS} additional parameters reached.`, 'warning');
            return;
        }
        
        const paramNumber = getNextAdditionalParameterNumber();
        console.log('🔢 New parameter number:', paramNumber);
        
        if (paramNumber > MAX_ADDITIONAL_PARAMS) {
            console.warn(`⚠️ Parameter number ${paramNumber} exceeds maximum ${MAX_ADDITIONAL_PARAMS}`);
            showMessage(`Maximum of ${MAX_ADDITIONAL_PARAMS} additional parameters reached.`, 'warning');
            return;
        }
        
        const paramDiv = document.createElement('div');
        paramDiv.className = 'additional-param';
        paramDiv.id = `additional-param-${paramNumber}`;
        paramDiv.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: end;
            flex-wrap: wrap;
        `;
        
        paramDiv.innerHTML = `
            <div class="form-group param-name" style="flex: 1; min-width: 200px;">
                <label for="param-name-${paramNumber}">Parameter Name:</label>
                <input type="text" id="param-name-${paramNumber}" 
                       name="param-name-${paramNumber}" 
                       placeholder="customParam" 
                       data-param-counter="${paramNumber}"
                       style="width: 100%;">
            </div>
            <div class="form-group param-value" style="flex: 1; min-width: 200px;">
                <label for="param-value-${paramNumber}">Parameter Value:</label>
                <input type="text" id="param-value-${paramNumber}" 
                       name="param-value-${paramNumber}" 
                       placeholder="customValue" 
                       data-param-counter="${paramNumber}"
                       style="width: 100%;">
            </div>
            <button type="button" class="remove-param-btn" onclick="removeAdditionalParameter(${paramNumber})"
                    style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Remove
            </button>
        `;
        
        console.log('📝 Parameter div created:', paramDiv);
        
        container.appendChild(paramDiv);
        additionalParameterCounter = Math.max(additionalParameterCounter, paramNumber);
        
        console.log('✅ Parameter added successfully');
        
        // Focus on the name field for immediate use
        setTimeout(() => {
            const nameField = document.getElementById(`param-name-${paramNumber}`);
            if (nameField) {
                nameField.focus();
                console.log('🎯 Focus set on name field');
            }
        }, 100);
        
        showMessage(`Additional parameter ${paramNumber} added successfully!`, 'success');
        
    } catch (error) {
        console.error('❌ Error in addAdditionalParameter:', error);
        showMessage('Error adding additional parameter: ' + error.message, 'error');
    }
}

function removeAdditionalParameter(counter) {
    console.log('🗑️ Removing additional parameter:', counter);
    
    try {
        const paramDiv = document.getElementById(`additional-param-${counter}`);
        if (paramDiv) {
            paramDiv.remove();
            console.log('✅ Additional parameter removed successfully');
            showMessage(`Additional parameter ${counter} removed`, 'info');
        } else {
            console.warn('⚠️ Additional parameter div not found:', `additional-param-${counter}`);
        }
    } catch (error) {
        console.error('❌ Error removing additional parameter:', error);
        showMessage('Error removing additional parameter: ' + error.message, 'error');
    }
}

// Toggle section (for collapsible test scenarios)
function toggleSection(sectionId) {
    const body = document.getElementById(sectionId + 'Body');
    const icon = document.getElementById(sectionId + 'Icon');
    if (!body || !icon) return;
    
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? '' : 'none';
    icon.textContent = isHidden ? '▲' : '▼';
}

// Debug: Console initialization

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initializing Nuvei Withdrawal Tool...');
    
    try {
        initializeTheme();
        initializeCompactMode();
        initializeAutoSave();
        initializeErrorHandling();
        initializeAutoResizeTextareas();
        initializeUnloadPrompt();
        
        // Load saved data if available
        loadFormData();
        
        // Generate initial timestamp
        generateTimestamp();
        
        console.log('✅ Withdrawal tool initialization completed successfully!');
    } catch (error) {
        console.error('❌ Error during withdrawal tool initialization:', error);
    }
});

// Fallback initialization
window.addEventListener('load', function() {
    setTimeout(() => {
        if (!document.getElementById('timeStamp')?.value) {
            generateTimestamp();
        }
    }, 1000);
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
    } else {
        container.classList.add('compact-mode');
        localStorage.setItem('compactMode', 'true');
    }
}

function initializeCompactMode() {
    const savedCompact = localStorage.getItem('compactMode') === 'true';
    const container = document.querySelector('.container');
    
    if (savedCompact) {
        container.classList.add('compact-mode');
    } else {
        container.classList.remove('compact-mode');
    }
}

// Auto-resize textareas based on content
function initializeAutoResizeTextareas() {
    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(textarea.scrollHeight, 60) + 'px';
    }
    
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => autoResize(textarea));
        textarea.addEventListener('focus', () => autoResize(textarea));
        
        // Initial resize
        setTimeout(() => autoResize(textarea), 100);
    });
    
    // Watch for dynamically added textareas
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const newTextareas = node.querySelectorAll ? node.querySelectorAll('textarea') : [];
                    newTextareas.forEach(textarea => {
                        textarea.addEventListener('input', () => autoResize(textarea));
                        textarea.addEventListener('focus', () => autoResize(textarea));
                        setTimeout(() => autoResize(textarea), 100);
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Generate current timestamp in Nuvei format
function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Nuvei withdrawal format: YYYYMMDDHHMMSS
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    document.getElementById('timeStamp').value = timestamp;
}

// Toggle section functionality
function toggleSection(sectionId) {
    const body = document.getElementById(sectionId + 'Body');
    const icon = document.getElementById(sectionId + 'Icon');
    if (!body || !icon) return;
    
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? '' : 'none';
    icon.textContent = isHidden ? '▲' : '▼';
}

// Toggle open amount configuration
function toggleOpenAmount() {
    const checkbox = document.getElementById('enableOpenAmount');
    const section = document.getElementById('openAmountSection');
    const amountField = document.getElementById('wd_amount');
    
    if (checkbox.checked) {
        section.style.display = 'block';
        // Make amount optional when open amount is enabled
        amountField.placeholder = 'Default amount (optional when open amount enabled)';
    } else {
        section.style.display = 'none';
        amountField.placeholder = '100.00';
        // Clear min/max fields
        document.getElementById('wd_min_amount').value = '';
        document.getElementById('wd_max_amount').value = '';
    }
}

// Toggle URL configuration
function toggleUrlConfig() {
    const checkbox = document.getElementById('enableUrlConfig');
    const section = document.getElementById('urlConfigSection');
    
    if (checkbox.checked) {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
        // Clear URL fields when hidden
        document.getElementById('successUrl').value = '';
        document.getElementById('failUrl').value = '';
        document.getElementById('backUrl').value = '';
    }
}

// Custom Fields Management
let customFieldCounter = 0;

function getNextCustomFieldNumber() {
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
    customFieldCounter = Math.max(customFieldCounter, fieldNumber);
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

// Get form data as object
function getFormData() {
    const form = document.getElementById('withdrawal-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '') {
            data[key] = value.trim();
        }
    }
    
    // Handle dynamic custom fields
    const customFields = document.querySelectorAll('[data-custom-field]');
    customFields.forEach(field => {
        if (field.value.trim()) {
            data[field.name] = field.value.trim();
        }
    });
    
    // Handle dynamic additional parameters
    const additionalParams = document.querySelectorAll('[data-additional-param]');
    const paramPairs = {};
    
    additionalParams.forEach(field => {
        const fieldId = field.id;
        const paramNumber = field.getAttribute('data-additional-param');
        
        if (fieldId.includes('additionalParamName')) {
            paramPairs[paramNumber] = paramPairs[paramNumber] || {};
            paramPairs[paramNumber].name = field.value.trim();
        } else if (fieldId.includes('additionalParamValue')) {
            paramPairs[paramNumber] = paramPairs[paramNumber] || {};
            paramPairs[paramNumber].value = field.value.trim();
        }
    });
    
    // Add additional parameters to data if both name and value are provided
    Object.keys(paramPairs).forEach(paramNumber => {
        const pair = paramPairs[paramNumber];
        if (pair.name && pair.value) {
            data[pair.name] = pair.value;
        }
    });
    
    // Handle open amount parameters
    const openAmountEnabled = document.getElementById('enableOpenAmount')?.checked;
    if (openAmountEnabled) {
        data['wd_open_amount'] = 'True';
    } else {
        data['wd_open_amount'] = 'False';
        // Remove min/max if not using open amount
        delete data.wd_min_amount;
        delete data.wd_max_amount;
    }
    
    // Remove URL fields if not enabled
    const urlConfigEnabled = document.getElementById('enableUrlConfig')?.checked;
    if (!urlConfigEnabled) {
        delete data.successUrl;
        delete data.failUrl;
        delete data.backUrl;
    }
    
    return data;
}

// Create concatenated string for withdrawal checksum calculation
function createWithdrawalChecksumString(data, secretKey) {
    // According to Nuvei withdrawal documentation, checksum calculation for redirection
    // follows the parameter order in the request with secret key FIRST
    
    // Standard withdrawal parameter order as per documentation
    const withdrawalParameterOrder = [
        'merchant_id', 'merchant_site_id', 'user_token', 'user_token_id', 
        'merchantLocale', 'wd_amount', 'wd_currency', 'country',
        'wd_min_amount', 'wd_max_amount', 'wd_open_amount', 'userId',
        'timeStamp', 'customSiteName', 'merchant_unique_id', 'version',
        'successUrl', 'failUrl', 'backUrl', 'showCancelButton', 'layout',
        'verificationDetails', 'iban', 'digitalAssetType',
        'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip'
    ];
    
    // Add custom fields (customField1 to customField15)
    const customFieldKeys = [];
    for (let i = 1; i <= 15; i++) {
        if (data[`customField${i}`]) {
            customFieldKeys.push(`customField${i}`);
        }
    }
    
    const parameterOrder = [...withdrawalParameterOrder, ...customFieldKeys];
    
    // Start with secret key FIRST (for withdrawal redirection checksums)
    let concatenatedString = secretKey;
    
    // Add parameter values in order (only values, no keys)
    for (const key of parameterOrder) {
        if (data[key] && data[key] !== '') {
            concatenatedString += data[key];
        }
    }
    
    // Add any remaining parameters not in the core list (alphabetically)
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

// Enhanced validation error handling
function showValidationError(missingFields, requiredFieldIds) {
    clearFieldErrors();
    
    alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
    
    const missingFieldIds = requiredFieldIds.filter(fieldId => {
        const element = document.getElementById(fieldId);
        return !element || !element.value.trim();
    });
    
    missingFieldIds.forEach(fieldId => {
        highlightField(fieldId);
    });
    
    if (missingFieldIds.length > 0) {
        scrollToField(missingFieldIds[0]);
    }
}

function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
    }
}

function scrollToField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const section = field.closest('.section');
    if (section) {
        const headerOffset = 100;
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            field.focus();
        }, 500);
    }
}

function clearFieldErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
    });
}

// Initialize error handling
function initializeErrorHandling() {
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
        if (field.value.trim()) {
            formGroup.classList.remove('error');
        }
    }
}

// Auto-save functionality
function initializeAutoSave() {
    const box = document.getElementById('enableLocalStorage');
    if (!box) return;
    const enabled = localStorage.getItem('nuvei_withdrawal_auto_save_enabled') === 'true';
    box.checked = enabled;
}

function toggleLocalStorage() {
    const box = document.getElementById('enableLocalStorage');
    if (!box) return;
    if (box.checked) {
        localStorage.setItem('nuvei_withdrawal_auto_save_enabled', 'true');
        saveFormData();
        showMessage('Auto-save enabled', 'info');
    } else {
        localStorage.setItem('nuvei_withdrawal_auto_save_enabled', 'false');
        showMessage('Auto-save disabled', 'info');
    }
}

// Generate withdrawal URL and calculate checksum
async function generateWithdrawalUrl() {
    try {
        // Required fields for withdrawal
        const requiredFields = [
            'merchant_id', 'merchant_site_id', 'secretKey', 'user_token_id', 
            'wd_amount', 'wd_currency', 'user_token', 'timeStamp', 'version'
        ];
        
        const missingFields = [];
        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                missingFields.push(field.replace('_', ' ').toUpperCase());
            }
        }
        
        // Check conditional fields
        const openAmountEnabled = document.getElementById('enableOpenAmount')?.checked;
        if (openAmountEnabled) {
            const minAmount = document.getElementById('wd_min_amount')?.value;
            const maxAmount = document.getElementById('wd_max_amount')?.value;
            if (!minAmount || !maxAmount) {
                missingFields.push('WD MIN AMOUNT', 'WD MAX AMOUNT');
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
        
        // Create concatenated string for checksum using withdrawal-specific logic
        const concatenatedString = createWithdrawalChecksumString(formData, secretKey);
        
        // Calculate SHA-256 checksum
        const checksum = await sha256(concatenatedString);
        formData.checksum = checksum;
        
        // Build URL parameters in the same order as checksum calculation
        const withdrawalParameterOrder = [
            'merchant_id', 'merchant_site_id', 'user_token', 'user_token_id', 
            'wd_amount', 'wd_currency', 'wd_open_amount', 'wd_min_amount', 'wd_max_amount',
            'timeStamp', 'version', 'merchantLocale', 'country', 'userId',
            'merchant_unique_id', 'customSiteName', 'successUrl', 'failUrl', 'backUrl',
            'showCancelButton', 'layout', 'first_name', 'last_name', 'email', 'phone',
            'address', 'city', 'state', 'zip'
        ];
        
        // Add custom fields
        const customFieldKeys = [];
        for (let i = 1; i <= 15; i++) {
            if (formData[`customField${i}`]) {
                customFieldKeys.push(`customField${i}`);
            }
        }
        
        const fullParameterOrder = [...withdrawalParameterOrder, ...customFieldKeys, 'checksum'];
        
        const urlParams = new URLSearchParams();
        
        // Add parameters in the specified order
        for (const key of fullParameterOrder) {
            if (formData[key] && formData[key] !== '') {
                urlParams.append(key, formData[key]);
            }
        }
        
        // Add any remaining parameters not in the core list
        const remainingKeys = Object.keys(formData)
            .filter(key => !fullParameterOrder.includes(key))
            .sort();
        
        for (const key of remainingKeys) {
            if (formData[key] && formData[key] !== '') {
                urlParams.append(key, formData[key]);
            }
        }
        
        // Create complete withdrawal URL
        const withdrawalUrl = `${NUVEI_SANDBOX_WITHDRAWAL_URL}?${urlParams.toString()}`;
        
        // Display results
        document.getElementById('concatenated-string').value = concatenatedString;
        document.getElementById('calculated-checksum').value = checksum;
        document.getElementById('withdrawal-url').value = withdrawalUrl;
        document.getElementById('results').style.display = 'block';
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        showMessage('Withdrawal URL and checksum generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating withdrawal URL:', error);
        alert('Error generating withdrawal URL. Please check your inputs.');
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

// Open withdrawal page in new tab
function openWithdrawalPage() {
    const url = document.getElementById('withdrawal-url').value;
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('Please generate the withdrawal URL first');
    }
}

// Clear form
function clearForm() {
    const form = document.getElementById('withdrawal-form');
    form.reset();
    
    // Hide result sections
    document.getElementById('results').style.display = 'none';
    
    // Reset dynamic sections
    document.getElementById('openAmountSection').style.display = 'none';
    document.getElementById('urlConfigSection').style.display = 'none';
    
    // Clear custom fields
    const customFieldsContainer = document.getElementById('customFields');
    customFieldsContainer.innerHTML = '';
    customFieldCounter = 0;
    
    showMessage('Form cleared!', 'info');
}

// Fill sample data
function fillSampleData() {
    // Sample transaction data
    document.getElementById('wd_currency').value = 'USD';
    document.getElementById('wd_amount').value = '100.00';
    document.getElementById('user_token_id').value = 'withdraw_user_12345';
    document.getElementById('user_token').value = 'auto';
    document.getElementById('merchant_unique_id').value = generateUniqueId('withdraw');
    
    // Sample customer data
    document.getElementById('email').value = 'john.doe@example.com';
    document.getElementById('first_name').value = 'John';
    document.getElementById('last_name').value = 'Doe';
    document.getElementById('country').value = 'US';
    document.getElementById('phone').value = '+1234567890';
    
    // Sample address
    document.getElementById('address').value = '123 Main St';
    document.getElementById('city').value = 'New York';
    document.getElementById('state').value = 'NY';
    document.getElementById('zip').value = '10001';
    
    // Sample custom fields
    const customFieldsContainer = document.getElementById('customFields');
    customFieldsContainer.innerHTML = '';
    customFieldCounter = 0;
    addCustomField();
    document.getElementById('customField1').value = 'withdrawal-tracking-123';
    
    generateTimestamp();
    
    showMessage('Sample withdrawal data filled in!', 'info');
    
    // Save immediately if auto-save is enabled
    if (document.getElementById('enableLocalStorage')?.checked) {
        saveFormData();
    }
}

// Test scenario functions
function fillTestScenario(scenario) {
    clearFieldErrors();
    
    switch (scenario) {
        case 'small-withdrawal':
            fillBasicWithdrawalData();
            document.getElementById('wd_amount').value = '25.00';
            document.getElementById('first_name').value = 'Alice';
            document.getElementById('last_name').value = 'Small';
            document.getElementById('email').value = 'alice.small@test.com';
            showMessage('💸 Small withdrawal scenario loaded ($25)', 'success');
            break;
            
        case 'medium-withdrawal':
            fillBasicWithdrawalData();
            document.getElementById('wd_amount').value = '250.00';
            document.getElementById('first_name').value = 'Bob';
            document.getElementById('last_name').value = 'Medium';
            document.getElementById('email').value = 'bob.medium@test.com';
            showMessage('💸 Medium withdrawal scenario loaded ($250)', 'success');
            break;
            
        case 'large-withdrawal':
            fillBasicWithdrawalData();
            document.getElementById('wd_amount').value = '2500.00';
            document.getElementById('first_name').value = 'Charlie';
            document.getElementById('last_name').value = 'Large';
            document.getElementById('email').value = 'charlie.large@test.com';
            showMessage('💸 Large withdrawal scenario loaded ($2,500)', 'warning');
            break;
            
        case 'fixed-amount':
            fillBasicWithdrawalData();
            document.getElementById('wd_amount').value = '100.00';
            document.getElementById('first_name').value = 'Fixed';
            document.getElementById('last_name').value = 'Amount';
            document.getElementById('email').value = 'fixed.amount@test.com';
            // Ensure open amount is disabled
            document.getElementById('enableOpenAmount').checked = false;
            toggleOpenAmount();
            showMessage('🔒 Fixed amount withdrawal scenario loaded', 'info');
            break;
            
        case 'open-amount':
            fillBasicWithdrawalData();
            document.getElementById('wd_amount').value = '50.00';
            document.getElementById('first_name').value = 'Open';
            document.getElementById('last_name').value = 'Range';
            document.getElementById('email').value = 'open.range@test.com';
            // Enable open amount
            document.getElementById('enableOpenAmount').checked = true;
            toggleOpenAmount();
            document.getElementById('wd_min_amount').value = '10.00';
            document.getElementById('wd_max_amount').value = '1000.00';
            showMessage('📊 Open amount withdrawal scenario loaded ($10-$1000)', 'info');
            break;
            
        case 'euro-withdrawal':
            fillBasicWithdrawalData();
            document.getElementById('wd_currency').value = 'EUR';
            document.getElementById('wd_amount').value = '100.00';
            document.getElementById('first_name').value = 'Euro';
            document.getElementById('last_name').value = 'User';
            document.getElementById('email').value = 'euro.user@test.com';
            document.getElementById('country').value = 'DE';
            document.getElementById('merchantLocale').value = 'de_DE';
            showMessage('🇪🇺 Euro withdrawal scenario loaded (€100)', 'success');
            break;
    }
    
    // Generate timestamp at the end as requested
    generateTimestamp();
    
    // Trigger auto-resize for textareas
    setTimeout(() => {
        document.querySelectorAll('textarea').forEach(textarea => {
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
        });
    }, 100);
}

// Helper function for test scenarios
function fillBasicWithdrawalData() {
    document.getElementById('wd_currency').value = 'USD';
    document.getElementById('user_token_id').value = 'testuser_withdrawal_123';
    document.getElementById('merchant_unique_id').value = generateUniqueId('wd');
    document.getElementById('country').value = 'US';
    document.getElementById('phone').value = '+15551234567';
    document.getElementById('version').value = '4.0.0';
    
    // Clear any existing custom fields for fresh test
    const customFieldsContainer = document.getElementById('customFields');
    if (customFieldsContainer) {
        customFieldsContainer.innerHTML = '';
        customFieldCounter = 0;
    }
    
    // Reset checkboxes
    document.getElementById('enableOpenAmount').checked = false;
    document.getElementById('enableRedirectUrls').checked = false;
    toggleOpenAmount();
    toggleRedirectUrls();
}

// Show message to user
function showMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
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
        case 'warning':
            messageDiv.style.backgroundColor = '#ffc107';
            messageDiv.style.color = '#000';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#dc3545';
            break;
        default:
            messageDiv.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Initialize unload prompt
function initializeUnloadPrompt() {
    let awaitingStay = false;
    window.addEventListener('beforeunload', function(e) {
        const autoSaveEnabled = document.getElementById('enableLocalStorage')?.checked;
        if (!autoSaveEnabled) {
            const hasData = checkForUnsavedData();
            if (hasData && !awaitingStay) {
                awaitingStay = true;
                const message = 'You have unsaved withdrawal form data. Do you want to leave?';
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && awaitingStay) {
            awaitingStay = false;
            const shouldSave = confirm('Would you like to save your withdrawal form data for next time?');
            if (shouldSave) {
                document.getElementById('enableLocalStorage').checked = true;
                toggleLocalStorage();
            }
        }
    });
}

function checkForUnsavedData() {
    const form = document.getElementById('withdrawal-form');
    const formData = new FormData(form);
    let hasData = false;
    
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '' && key !== 'version') {
            hasData = true;
            break;
        }
    }
    
    return hasData;
}

// Auto-save form data to localStorage
function saveFormData() {
    const autoSaveEnabled = document.getElementById('enableLocalStorage')?.checked;
    if (!autoSaveEnabled) return;
    
    try {
        const formData = getFormData();
        // Don't save sensitive data
        delete formData.secretKey;
        localStorage.setItem('nuvei_withdrawal_form_data', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving withdrawal form data:', error);
    }
}

// Load form data from localStorage
function loadFormData() {
    const autoSaveEnabled = document.getElementById('enableLocalStorage')?.checked;
    if (!autoSaveEnabled) return;
    
    try {
        const savedData = localStorage.getItem('nuvei_withdrawal_form_data');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            // Fill form fields
            Object.keys(formData).forEach(key => {
                const element = document.getElementById(key);
                if (element && formData[key]) {
                    element.value = formData[key];
                }
            });
            
            // Handle checkboxes
            if (formData.wd_open_amount === 'True') {
                document.getElementById('enableOpenAmount').checked = true;
                toggleOpenAmount();
            }
            
            // Restore custom fields
            Object.keys(formData).forEach(key => {
                if (key.startsWith('customField')) {
                    const fieldNumber = key.replace('customField', '');
                    if (!document.getElementById(`customField${fieldNumber}`)) {
                        addCustomField();
                        document.getElementById(`customField${fieldNumber}`).value = formData[key];
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading withdrawal form data:', error);
    }
}

// Utility functions
function generateUniqueId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}_${timestamp}_${random}`;
}
