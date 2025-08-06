import { createServer } from 'http';
import EventEmitter from 'events';
import verifySignature from "./middleware/verifySignature.js";
import WhatsAppAPI from './api/WhatsAppAPI.js';
import Context from './Context.js';
import { parseBody } from "./utils/index.js";

export default class Client extends EventEmitter {
    constructor(options) {
        super();
        if (!options.app_secret || !options.webhook_token || !options.whatsapp_token) {
            throw new Error('Options app_secret, webhook_token, and whatsapp_token are required.');
        }
        this.port = options.port || 3000;
        this.host = options.host || '127.0.0.1';
        this.app_secret = options.app_secret;
        this.webhook_token = options.webhook_token;
        this.whatsapp_token = options.whatsapp_token;
        this.phone_number_id = options.phone_number_id;
    }

    start() {
        const app = createServer(async (req, res) => {
            const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
            if (pathname === '/webhook') {
                if (req.method === 'GET') {
                    const mode = searchParams.get('hub.mode');
                    const token = searchParams.get('hub.verify_token');
                    const challenge = searchParams.get('hub.challenge');

                    if (mode === 'subscribe' && token === this.webhook_token) {
                        console.info('✅ Webhook verified!');
                        res.end(challenge);
                        return;
                    } else {
                        console.warn('⚠️ Webhook verification failed.');
                        res.writeHead(401);
                    }
                } else if (req.method === 'POST') {
                    if (req.headers['content-type']?.startsWith('application/json')) {
                        try {
                            const chunks = [];
                            for await (const chunk of req) {
                                chunks.push(chunk);
                            }
                            const rawBody = Buffer.concat(chunks).toString();
                            const body = parseBody(rawBody);

                            if (verifySignature(this.app_secret, rawBody, req)) {
                                if (body) {
                                    if (body.object === 'whatsapp_business_account') {
                                        body.entry.forEach(entry => {
                                            const change = entry.changes?.[0];
                                            const message = change?.value?.messages?.[0];
                                            if (message) {
                                                const number_id = change.value.metadata.phone_number_id;
                                                if (this.phone_number_id && this.phone_number_id !== number_id) {
                                                    console.warn(`⚠️ Incoming message from unknown phone number ID: ${number_id}`);
                                                    res.end();
                                                    return;
                                                }
                                                const api = new WhatsAppAPI(this.whatsapp_token, number_id);
                                                const ctx = new Context(message, api);
                                                this.emit('message', ctx);
                                            }
                                        });
                                    } else {
                                        console.warn('⚠️ Unsupported object type:', body.object);
                                        res.writeHead(404);
                                    }
                                }else{
                                    console.warn('⚠️ Request body is missing.');
                                    res.writeHead(400);
                                }
                            } else {
                                console.warn('⚠️ Invalid signature. The request may have been tampered with.');
                                res.writeHead(401);
                            }
                        } catch (error) {
                            console.error('Error processing request body:', error);
                            res.writeHead(400);
                        }
                    } else {
                        console.warn(`⚠️ Unsupported content type: ${req.headers['content-type']}`);
                        res.writeHead(415);
                    }
                } else {
                    res.writeHead(405);
                }
            } else {
                res.writeHead(404);
            }
            res.end();
        })

        app.listen(this.port, this.host, () => {
            console.log(`Server is running at http://${this.host}:${this.port}/`);
        })

        app.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`Error: Port ${this.port} is already in use by another application.`);
            } else {
                console.error(`An error occurred on the server: ${e.message}`);
            }
            process.exit(1);
        });
    }
}