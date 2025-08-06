
import WhatsAppAPI from "./api/WhatsAppAPI";

/**
 * Represents the context of a WhatsApp message, providing utilities to interact with the message.
 */
export default class Context {
    /**
     * Creates an instance of Context.
     * @param {any} message - The message object.
     * @param {WhatsAppAPI} api - The WhatsApp API instance.
     */
    constructor(message: any, api: WhatsAppAPI);

    message: any;
    api: WhatsAppAPI;

    /**
     * Replies to the message.
     * @param {string} text - The text to send.
     * @param {boolean} [quoted] - Whether to quote the original message.
     * @returns {Promise<any>} A promise that resolves when the message is sent.
     */
    reply(text: string, quoted?: boolean): Promise<any>;

    /**
     * Sends a typing indicator to the user.
     * @param {number} [delay] - The duration in milliseconds to display the typing indicator.
     * @returns {Promise<any>} A promise that resolves when the typing indicator is sent.
     */
    typing(delay?: number): Promise<any>;

    /**
     * Marks the message as read.
     * @returns {Promise<any>} A promise that resolves when the message is marked as read.
     */
    read(): Promise<any>;
}
