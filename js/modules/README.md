# JavaScript Modules

This directory contains modular JavaScript components extracted from the main application for better organization and maintainability.

## WhatsApp Module (`whatsapp.js`)

Contains all WhatsApp-related functionality for Max Pool Egypt:

### Functions Exported to Global Scope:
- `window.openWhatsApp(message)` - Central WhatsApp opener for all use cases
- `window.buildGeneralMessage()` - General inquiry message builder
- `window.buildProductMessage(productName)` - Product-specific message builder  
- `window.buildDetailedProductMessage(product)` - Detailed product inquiry message builder
- `window.buildCartMessage(cartItems, name, phone)` - Cart quotation message builder
- `window.handleProductWhatsApp(productName)` - Product card WhatsApp handler (called from HTML)
- `window.initProductWhatsApp(product)` - Product detail page WhatsApp handler

### Usage:
The module must be loaded before `main.js` in HTML files:

```html
<script src="js/modules/whatsapp.js"></script>
<script src="js/main.js"></script>
```

### Dependencies:
- Requires `window.trackWhatsAppLead` function (from leadTracker.js) for analytics
- Uses `window.WA_NUMBER` for dynamic phone number updates

### Language Support:
All message builders automatically detect Arabic (`ar`) language and generate appropriate messages in Arabic or English.