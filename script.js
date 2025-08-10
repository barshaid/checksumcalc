// Nuvei Checksum Calculator & Cashier Page Generator
// Comprehensive single-page tool with all parameters

const NUVEI_SANDBOX_CASHIER_URL = 'https://ppp-test.safecharge.com/ppp/purchase.do';

// Initialize the application - consolidated DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme and layout
    initializeTheme();
    initializeCompactMode();
    initializeErrorHandling();
    
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
    
    // Add easter egg listeners
    initializeEasterEgg();
    initializeUnloadPrompt(); // new: prompt on page exit to optionally save
    
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
    const fieldNumber = getNextCustomFieldNumber();
    const container = document.getElementById('customFields');
    
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
        
        // Calculate checksum
        const checksum = await sha256(concatenatedString);
        
        // Add checksum to cleaned form data for URL
        cleanedFormData.checksum = checksum;
        
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
        // Set returnValue to trigger the browser's native prompt (works on bookmark navigation)
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

// Easter egg initialization
function initializeEasterEgg() {
    // Use setTimeout to ensure DOM is fully loaded
    setTimeout(() => {
        const firstNameField = document.getElementById('first_name');
        const lastNameField = document.getElementById('last_name');
        
        if (!firstNameField || !lastNameField) {
            return;
        }
        
        function checkEasterEgg() {
            const firstName = firstNameField?.value.toLowerCase().trim();
            const lastName = lastNameField?.value.toLowerCase().trim();
            
            if (firstName === 'hello' && lastName === 'kitty') {
                // Only trigger if not already in pink theme
                if (document.body.getAttribute('data-theme') !== 'pink') {
                    nyaa();
                }
            }
        }
        
        // Add blur listeners to both fields - trigger when focus is lost
        if (firstNameField) {
            firstNameField.addEventListener('blur', checkEasterEgg);
        }
        
        if (lastNameField) {
            lastNameField.addEventListener('blur', checkEasterEgg);
        }
    }, 100); // Small delay to ensure DOM is ready
}

// Very innocent function that definitely doesn't do anything special
function nyaa() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'pink') {
        document.body.setAttribute('data-theme', 'light');
        restoreOriginalText();
        document.querySelector('header h1').textContent = 'Nuvei Payment Integration Tool';
        document.querySelector('header p').textContent = 'Generate checksums and cashier page URLs for Nuvei sandbox environment';
    } else {
        document.body.setAttribute('data-theme', 'pink');
        fillHelloKittyData();
        kittyifyPage();
        document.querySelector('header h1').textContent = 'Hello Kitty Payment Tool ✨';
        document.querySelector('header p').textContent = 'Generate adorable checksums and cashier page URLs for Hello Kitty payments!';
    }
}

// Fill form with Hello Kitty test data
function fillHelloKittyData() {
    const helloKittyData = {
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
    Object.keys(helloKittyData).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = helloKittyData[key];
        }
    });

    // Trigger amount calculation
    if (typeof calculateTotal === 'function') {
        calculateTotal();
    }
}

// Text transformation utilities - Hello Kitty themed
function kittyify(text) {
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

function kittyifyPage() {
    // Store original texts
    document.querySelectorAll('h1, h2, h3, h4, label, button, p, small, .radio-option').forEach(element => {
        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.textContent);
        }
        if (!element.querySelector('input') && !element.querySelector('a')) {
            element.textContent = kittyify(originalTexts.get(element));
        }
    });
    
    // Special transformations for placeholders
    const placeholders = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    placeholders.forEach(input => {
        if (!originalTexts.has(input)) {
            originalTexts.set(input, input.placeholder);
        }
        input.placeholder = kittyify(originalTexts.get(input));
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
