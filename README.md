# Nuvei Payment Integration Tool

A comprehensive web application for Nuvei payment gateway integration, providing checksum calculation and cashier page URL generation for development and testing purposes.

## Features

### 🔐 Checksum Calculator
- Generate SHA-256 checksums for Nuvei API requests
- Support for all standard Nuvei payment parameters
- Real-time validation and result display
- Copy-to-clipboard functionality

### 🏪 Cashier Page Generator
- Create complete URLs for Nuvei hosted payment pages
- Support for all cashier page parameters
- Sandbox environment configuration
- One-click URL testing

### 📱 User Experience
- Responsive design for desktop and mobile
- Tabbed interface for easy navigation
- Form data auto-save (excluding sensitive information)
- Input validation with visual feedback
- Sample data generation with keyboard shortcuts

## Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Nuvei sandbox merchant credentials

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. No additional setup required - it's a pure client-side application

### Usage

#### Checksum Calculator
1. Enter your Nuvei API credentials (Merchant ID, Site ID, Secret Key)
2. Fill in transaction details (amount, currency, etc.)
3. Add customer information as needed
4. Click "Calculate Checksum" to generate the SHA-256 hash
5. Copy the generated checksum for use in your API requests

#### Cashier Page Generator
1. Enter your Nuvei API credentials
2. Configure transaction and customer details
3. Set up success/error/pending URLs
4. Click "Generate Cashier URL" to create the complete payment page URL
5. Copy the URL or open it directly for testing

## Configuration

### Sandbox Environment
The tool is pre-configured for Nuvei's sandbox environment:
- **Cashier URL**: `https://secure.safecharge.com/ppp/purchase.do`
- Use your sandbox merchant credentials for testing

### Sample Data
- Press `Ctrl+Alt+S` to fill forms with sample data
- Useful for quick testing and development

## Security Notes

⚠️ **Important Security Considerations**:
- This tool is for development and testing only
- Never use production credentials in this tool
- Secret keys are not stored in browser storage
- Always use HTTPS in production environments
- Validate all data server-side in production

## Supported Parameters

### Core Transaction Fields
- Merchant ID & Site ID
- Amount & Currency
- Client Unique ID & Request ID
- Timestamp
- User Token ID
- Email & Customer Details

### Additional Fields
- Success/Error/Pending URLs
- Notification URL
- Product Name
- Transaction Type
- Payment Method
- Custom Fields (1-15)
- Shipping Information

### Advanced Parameters
- 3D Secure settings
- Recurring payment flags
- Risk management data
- Sub-merchant information

## API Reference

The tool follows Nuvei's official API documentation for:
- Parameter naming conventions
- Checksum calculation algorithm
- URL encoding standards
- Sandbox endpoint configurations

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Development

### Project Structure
```
├── index.html          # Main application interface
├── styles.css          # Responsive styling
├── script.js           # Core functionality
├── README.md           # This file
└── .github/
    └── copilot-instructions.md
```

### Key Functions
- `calculateChecksum()` - SHA-256 hash generation
- `generateCashierUrl()` - Complete URL construction
- `createChecksumString()` - Parameter concatenation
- `saveFormData()` - Auto-save functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Nuvei sandbox
5. Submit a pull request

## License

This project is provided as-is for educational and development purposes.

## Support

For Nuvei API documentation and support:
- [Nuvei Developer Portal](https://docs.nuvei.com/)
- [Nuvei Sandbox Environment](https://secure.safecharge.com/)

## Changelog

### Version 1.0.0
- Initial release
- Checksum calculation functionality
- Cashier page URL generation
- Responsive web interface
- Form validation and auto-save
- Sample data generation
