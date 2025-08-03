# WABA (WhatsApp Business API) Wrapper

Node.js library that acts as a wrapper for the WhatsApp Business API, making it easier for you to create WhatsApp bots.

**Note:** ⚠️ This project is still under active development, and some features may change.

## Features

- Easy webhook handling for incoming messages.
- Automatic webhook signature verification.
- Simple API for sending messages.
- EventEmitter-based for a flexible architecture.

## Installation

```bash
npm install waba
```

## Usage

Here is a basic example of how to use this library:

```javascript
import { Client } from 'waba';

const client = new Client({
    port: 3000,
    host: '127.0.0.1',
    app_secret: 'YOUR_APP_SECRET',
    webhook_token: 'YOUR_WEBHOOK_VERIFY_TOKEN',
    whatsapp_token: 'YOUR_WHATSAPP_API_TOKEN'
});

client.on('message', (ctx) => {
    console.log('New message received:', ctx.message);
    // Reply to the message
    ctx.reply('We have received your message!');
});

client.start();
```

## Webhook Setup

To use this library, you need to set up a webhook in your Meta application.

1.  **Webhook URL**: Set your webhook URL to `http://<your_host>:<port>/webhook`.
2.  **Verify Token**: Use the same verify token that you provided in the `webhook_token` option.

The library will automatically handle the webhook verification for you.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.


## License

This project is licensed under the [MIT License](LICENSE).