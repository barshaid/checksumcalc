# Nuvei Payment Integration Tool

A client‑side sandbox helper for building and testing Nuvei (SafeCharge) hosted payment page requests: generate the cashier URL, compute the SHA‑256 checksum, experiment with dynamic items / parameters, and optionally persist non‑sensitive form data locally.

## Current Sandbox Endpoint
- Cashier (Hosted Payment Page) URL: `https://ppp-test.safecharge.com/ppp/purchase.do`

## Key Features

### 1. Cashier URL & Checksum Generation
- Generates SHA‑256 checksum using the exact parameter value order implemented in the tool (secret key prepended, parameter values concatenated; spaces removed from each value before hashing and inclusion in the URL).
- Supports dynamic items (auto‑ordered `item_name_N`, `item_amount_N`, `item_quantity_N`).
- Automatically formats item amounts and total to 2 decimals.
- Displays: concatenated string, checksum, and full cashier URL.

### 2. Dynamic Items
- Add/remove additional items (Item 1 mandatory) up to 50 (logical cap in code loop).
- Individual collapsible item bodies to reduce visual clutter.

### 3. Collapsible UI & Layout Modes
- Collapsible "Items" section and each item row (arrow buttons ▶ / ▼ with consistent styling & borders).
- Compact mode toggle for denser layout.
- Light/Dark theme toggle + hidden Pink (Hello Kitty) easter egg theme.

### 4. Optional Sections & Toggles
- Response URLs (success / error / pending / notify) block enabled only when requested.
- Open Amount toggle revealing min/max inputs (mapped to `openAmount[min]` / `openAmount[max]`).
- Payment Method configuration modes:
  - Default (no preselection / filtering params sent)
  - Preselect single method (`payment_method`)
  - Filter list (`payment_methods` + implicit `payment_method_mode=filter`)

### 5. Additional Parameters & Custom Fields
- Builder UI for arbitrary name/value additional parameters.
- Dynamic custom fields (`customFieldN`) with no hardcoded upper limit.

### 6. Persistence (Opt‑In Auto‑Save)
- Auto‑save OFF by default (checkbox `enableLocalStorage`).
- On attempted navigation / tab close with unsaved data and auto‑save disabled: native browser beforeunload prompt appears; choosing *Stay* triggers a follow‑up confirm to enable auto‑save and store current (non‑sensitive) data.
- Secret key is never persisted to LocalStorage.

### 7. Sample Data & Productivity
- Keyboard shortcuts:
  - Ctrl + Alt + S → Fill sample data (non‑credentials).
  - Ctrl + Enter → Generate cashier URL & checksum.
- Sample data avoids auto‑adding a second item (per user decision).

### 8. Feedback & Validation
- Required field checks with highlighting & smooth scroll to first missing field.
- Inline error clearing on input/focus.
- Toast style transient messages for success / info / warnings.

### 9. Theming & Easter Egg
- Light / Dark mode toggle persists via LocalStorage.
- Hidden Hello Kitty theme activated by entering first name "Hello" & last name "Kitty" (on blur), applying playful text transformations.

## Security Considerations
- Development / sandbox use only. DO NOT use production secret keys here.
- Secret key never saved to LocalStorage and intentionally stripped before persistence.
- All parameter values sanitized by trimming & space removal for checksum/URL consistency.
- Use HTTPS when deploying any derivative.
- Always re‑validate and sign requests server‑side in production systems.

## Supported / Implemented Parameters (Core)
- merchant_id, merchant_site_id
- total_amount, currency
- merchant_unique_id, user_token_id, time_stamp, version (if provided)
- Dynamic items: item_name_N, item_amount_N, item_quantity_N
- Customer data: first_name, last_name, email, phone1, country, state, city, address1, zip, dateOfBirth
- Optional response URLs: success_url, error_url, pending_url, notify_url
- Payment method parameters: payment_method OR payment_methods (+ payment_method_mode=filter)
- Custom fields: customFieldN
- Open amount: openAmount[min], openAmount[max] (only when toggle enabled)
- Additional arbitrary parameters via builder
- checksum (computed)

(Advanced parameters like 3DS, risk scoring, sub‑merchant, recurring profiles are NOT currently implemented—add via Additional Parameters if needed.)

## How Checksum Is Built (Summary)
1. Start with `secretKey` (not transmitted).
2. Append values of ordered known parameters + dynamic items + custom fields.
3. Append remaining (non‑empty) parameters alphabetically.
4. SHA‑256 digest of resulting UTF‑8 string.
5. Append checksum to final URL querystring.

Spaces inside values are removed prior to both concatenation and URL creation (per internal guidance used here).

## Project Structure (Current)
```
index.html
script.js
css/
  styles.css
assets/
  logos/ (Nuvei logo variants)
apple-pay.html (auxiliary / experimental page, if present)
google-pay.html (auxiliary / experimental page, if present)
test-theme.html (theme exploration, if present)
README.md
```

## Core Functions (Selected)
- `generateCashierUrl()` – validation, data cleaning, checksum + URL assembly.
- `createChecksumString(data, secretKey)` – ordered concatenation logic.
- `sha256(message)` – Web Crypto API hashing.
- `calculateTotal()` – item totals & overall total normalization.
- `fillSampleData()` – injects representative test values.
- `saveFormData()` / `loadFormData()` – guarded persistence.
- `initializeUnloadPrompt()` – beforeunload + optional enable auto‑save flow.

## Usage Flow
1. Enter merchant credentials (Merchant ID, Site ID, Secret Key – secret key used only locally).
2. Add at least one item (Item 1 required).
3. Supply customer & optional sections (response URLs, open amount, payment methods, extra params, custom fields).
4. Generate cashier URL (button or Ctrl+Enter) – review concatenated string & checksum.
5. Open URL in new tab to test hosted payment page.
6. Optionally enable auto‑save after deciding to stay on page when leaving.

## Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl + Alt + S | Fill sample data |
| Ctrl + Enter | Generate cashier URL & checksum |

## Changelog
### 1.1.0 (Unreleased / Working)
- Added collapsible items & sections with arrow buttons.
- Added compact mode toggle.
- Implemented optional Open Amount min/max mapping.
- Added dynamic additional parameters builder.
- Added dynamic custom fields (unlimited) instead of fixed count.
- Introduced optional payment method preselect / filter modes.
- Implemented space removal in parameter values before checksum & URL.
- Added beforeunload native prompt + post‑stay auto‑save enable flow (auto‑save default OFF).
- Added dark theme toggle & Hello Kitty easter egg theme.
- Improved validation with scroll & highlighting.
- Ensured secret key exclusion from persistence.
- Unified arrow button styling with borders.

### 1.0.0
- Initial release (basic checksum & URL generation, form validation, sample data, auto‑save ON by default).

## Roadmap (Potential)
- 3DS / risk / recurring parameter helpers.
- Export/import JSON configuration.
- Animation transitions for collapses (height auto → smooth).
- Custom modal for auto‑save enable (instead of native confirm) if desired.

## Disclaimer
This tool is educational and for sandbox experimentation. Always implement secure server‑side signing & validation in production. Nuvei’s official documentation is authoritative—adapt this tool if specification updates diverge.

## References
- Nuvei Documentation: https://docs.nuvei.com/

---
Generated & maintained with iterative improvements reflecting actual implemented code. Feel free to adapt.
