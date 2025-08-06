const API_VERSION = 'v23.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

export default class WhatsAppAPI {
    constructor(token, phoneNumberId) {
        this.token = token;
        this.phoneNumberId = phoneNumberId;
        this.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
        };
    }

    async _request(options) {
        try {
            const res = await fetch(`${BASE_URL}/${this.phoneNumberId}/messages`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    ...options
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(`❌ Error ${res.status}: ${data.error?.message || 'Failed to send message.'}`);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async sendMessage(to, text, isQuoted = false, messageId = null) {
        const payload = {
            to,
            type: "text",
            text: { preview_url: false, body: text }
        };
        if (isQuoted && messageId) {
            payload.context = { message_id: messageId };
        }
        return this._request(payload);
    }

    async sendReadReceipt(messageId) {
        return this._request({
            status: "read",
            message_id: messageId
        });
    }

    async sendTyping(messageId) {
        return this._request({
            status: "read",
            message_id: messageId,
            typing_indicator: {
                type: 'text'
            }
        });
    }
}