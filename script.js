// Nuvei Checksum Calculator & Cashier Page Generator
// Comprehensive single-page tool with all parameters

const NUVEI_SANDBOX_CASHIER_URL = 'https://ppp-test.safecharge.com/ppp/purchase.do';

// Initialize theme and compact mode on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeCompactMode();
    loadFormData();
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

// Sync total amount with item amount for simple transactions
function syncTotalAmount() {
    const itemAmount = document.getElementById('item_amount_1').value;
    const itemQuantity = document.getElementById('item_quantity_1').value || 1;
    
    if (itemAmount) {
        const totalAmount = (parseFloat(itemAmount) * parseInt(itemQuantity)).toFixed(2);
        document.getElementById('total_amount').value = totalAmount;
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

// Additional Parameters Management
let additionalParamCounter = 0;

function addAdditionalParameter() {
    additionalParamCounter++;
    const container = document.getElementById('additionalParameters');
    
    const paramDiv = document.createElement('div');
    paramDiv.className = 'additional-param';
    paramDiv.id = `additional-param-${additionalParamCounter}`;
    
    paramDiv.innerHTML = `
        <div class="form-group param-name">
            <label for="param-name-${additionalParamCounter}">Parameter Name:</label>
            <input type="text" id="param-name-${additionalParamCounter}" 
                   name="param-name-${additionalParamCounter}" 
                   placeholder="customParam" 
                   data-param-counter="${additionalParamCounter}">
        </div>
        <div class="form-group param-value">
            <label for="param-value-${additionalParamCounter}">Parameter Value:</label>
            <input type="text" id="param-value-${additionalParamCounter}" 
                   name="param-value-${additionalParamCounter}" 
                   placeholder="customValue" 
                   data-param-counter="${additionalParamCounter}">
        </div>
        <button type="button" class="remove-param-btn" onclick="removeAdditionalParameter(${additionalParamCounter})">
            Remove
        </button>
    `;
    
    container.appendChild(paramDiv);
}

function removeAdditionalParameter(counter) {
    const paramDiv = document.getElementById(`additional-param-${counter}`);
    if (paramDiv) {
        paramDiv.remove();
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
    
    return data;
}

// Create concatenated string for checksum calculation (Nuvei Payment Page format)
function createChecksumString(data, secretKey) {
    // The checksum must use the exact same parameter order as they appear in the URL
    // Based on the failing URL, the order is:
    const exactParameterOrder = [
        'merchant_id', 'merchant_site_id', 'total_amount', 'currency',
        'item_name_1', 'item_amount_1', 'item_quantity_1', 'version',
        'merchant_unique_id', 'user_token_id', 'email', 'first_name',
        'last_name', 'country', 'phone1', 'address1', 'city', 'state',
        'zip', 'notify_url', 'customField1', 'customField2', 'time_stamp'
    ];
    
    // Start with secret key
    let concatenatedString = secretKey;
    
    // Add parameters in exact URL order
    for (const key of exactParameterOrder) {
        if (data[key] && data[key] !== '') {
            concatenatedString += data[key];
        }
    }
    
    // Add any additional parameters that weren't in the core list (alphabetically)
    const remainingKeys = Object.keys(data)
        .filter(key => !exactParameterOrder.includes(key))
        .sort();
    
    for (const key of remainingKeys) {
        if (data[key] && data[key] !== '') {
            concatenatedString += data[key];
        }
    }
    
    return concatenatedString;
}

// Generate cashier URL and calculate checksum
async function generateCashierUrl() {
    try {
        // Validate required fields first
        const requiredFields = [
            'merchant_id', 'merchant_site_id', 'secretKey', 'total_amount', 
            'currency', 'user_token_id', 'item_name_1', 'item_amount_1', 
            'item_quantity_1', 'time_stamp', 'notify_url'
        ];
        
        const missingFields = [];
        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                missingFields.push(field.replace('_', ' ').toUpperCase());
            }
        }
        
        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
            return;
        }
        
        const formData = getFormData();
        const secretKey = document.getElementById('secretKey').value.trim();
        
        // Remove secret key from form data for checksum calculation
        delete formData.secretKey;
        
        // Create concatenated string for checksum
        const concatenatedString = createChecksumString(formData, secretKey);
        
        // Debug: log the concatenated string
        console.log('Checksum calculation string:', concatenatedString);
        
        // Calculate checksum
        const checksum = await sha256(concatenatedString);
        
        // Add checksum to form data
        formData.checksum = checksum;
        
        // Build URL parameters
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(formData)) {
            if (value && value !== '') {
                urlParams.append(key, value);
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
    document.getElementById('aftFields').style.display = 'none';
    
    // Clear additional parameters
    const additionalParamsContainer = document.getElementById('additionalParameters');
    additionalParamsContainer.innerHTML = '';
    additionalParamCounter = 0;
    
    showMessage('Form cleared!', 'info');
}

// Fill sample data
function fillSampleData() {
    // Sample merchant credentials (sandbox) - User needs to fill their own
    // document.getElementById('merchant_id').value = 'YOUR_MERCHANT_ID';
    // document.getElementById('merchant_site_id').value = 'YOUR_SITE_ID';
    
    // Sample transaction data
    document.getElementById('total_amount').value = '100.00';
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
    
    // Sample URLs (notify_url is required)
    document.getElementById('success_url').value = 'https://example.com/success';
    document.getElementById('error_url').value = 'https://example.com/error';
    document.getElementById('pending_url').value = 'https://example.com/pending';
    document.getElementById('notify_url').value = 'https://webhook.site/unique-id';
    
    // Sample custom fields
    document.getElementById('customField1').value = 'affiliate-xyz';
    document.getElementById('customField2').value = 'promo-2024';
    
    generateTimestamp();
    
    showMessage('Sample data filled in!', 'info');
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

// Auto-save form data to localStorage (if enabled)
function saveFormData() {
    const localStorageEnabled = document.getElementById('enableLocalStorage')?.checked;
    if (!localStorageEnabled) return;
    
    try {
        const formData = getFormData();
        // Don't save sensitive data like secret keys
        delete formData.secretKey;
        localStorage.setItem('nuvei_payment_form', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

// Toggle localStorage functionality
function toggleLocalStorage() {
    const enabled = document.getElementById('enableLocalStorage').checked;
    if (!enabled) {
        // Clear saved data when disabled
        try {
            localStorage.removeItem('nuvei_payment_form');
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
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
            const form = document.getElementById('payment-form');
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = data[key] === 'true';
                    } else {
                        field.value = data[key];
                    }
                }
            });
            
            // Trigger checkbox change events
            if (data.enableOpenAmount === 'true') {
                document.getElementById('enableOpenAmount').checked = true;
                toggleOpenAmount();
            }
            if (data.enableResponseUrls === 'true') {
                document.getElementById('enableResponseUrls').checked = true;
                toggleResponseUrls();
            }
        }
    } catch (error) {
        console.error('Error loading saved form data:', error);
    }
}

// Utility functions
function generateUniqueId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
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

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sha256,
        createChecksumString,
        getFormData,
        generateUniqueId,
        toggleLocalStorage,
        syncTotalAmount
    };
}
