
import { IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';
import Context from './Context';

/**
 * Represents the options for the Client.
 */
interface ClientOptions {
    /**
     * The application secret from your Meta App.
     */
    app_secret: string;
    /**
     * The webhook verification token.
     */
    webhook_token: string;
    /**
     * The WhatsApp Business API token.
     */
    whatsapp_token: string;
    /**
     * The WhatsApp phone number id.
     */
    phone_number_id?: string;
    /**
     * The port to listen on.
     * @default 3000
     */
    port?: number;
    /**
     * The host to listen on.
     * @default '127.0.0.1'
     */
    host?: string;
}

/**
 * The main client for interacting with the WhatsApp Business API.
 */
export default class Client extends EventEmitter {
    /**
     * Creates a new Client instance.
     * @param {ClientOptions} options The client options.
     */
    constructor(options: ClientOptions);
    
    /**
     * The port the server is listening on.
     */
    port: number;
    /**
     * The host the server is listening on.
     */
    host: string;
    /**
     * The application secret.
     */
    app_secret: string;
    /**
     * The webhook verification token.
     */
    webhook_token: string;
    /**
     * The WhatsApp Business API token.
     */
    whatsapp_token: string;

    /**
     * Starts the HTTP server to listen for webhooks.
     */
    start(): void;

    /**
     * Listens for new messages.
     * @param {'message'} event The event to listen for.
     * @param {(ctx: Context) => void} listener The function to call when the event is emitted.
     */
    on(event: 'message', listener: (ctx: Context) => void): this;
}
