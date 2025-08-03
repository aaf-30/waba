import { createServer } from 'http';
import EventEmitter from 'events';
import verifySignature from "./middleware/verifySignature.js";
import WhatsAppAPI from './api/WhatsAppAPI.js';
import Context from './Context.js';

export default class Client extends EventEmitter {
    constructor(options) {
        super();
        if (!options.app_secret || !options.webhook_token || !options.whatsapp_token) {
            throw new Error('Opsi app_secret, webhook_token, dan whatsapp_token wajib diisi.');
        }
        this.port = options.port || 3000;
        this.host = options.host || '127.0.0.1';
        this.app_secret = options.app_secret;
        this.webhook_token = options.webhook_token;
        this.whatsapp_token = options.whatsapp_token;
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
                            const body = JSON.parse(rawBody);

                            if (verifySignature(this.app_secret, rawBody, req)) {
                                if (body.object === 'whatsapp_business_account') {
                                    body.entry.forEach(entry => {
                                        const change = entry.changes?.[0];
                                        const message = change?.value?.messages?.[0];
                                        if (message) {
                                            const number_id = change.value.metadata.phone_number_id;
                                            const api = new WhatsAppAPI(this.whatsapp_token, number_id);
                                            const ctx = new Context(message, api);
                                            this.emit('message', ctx);
                                        }
                                    });
                                } else {
                                    res.writeHead(404);
                                }
                            } else {
                                res.writeHead(401);
                            }
                        } catch (error) {
                            console.error('Error processing request body:', error);
                            res.writeHead(400);
                        }
                    } else {
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
            console.log(`Server berjalan di http://${this.host}:${this.port}/`);
        })

        app.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`Error: Port ${this.port} sudah digunakan oleh aplikasi lain.`);
            } else {
                console.error(`Terjadi error pada server: ${e.message}`);
            }
            process.exit(1);
        });
    }
}