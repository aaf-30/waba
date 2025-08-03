export default class Context {
    constructor(message, api) {
        this.message = message;
        this.api = api;
    }

    async reply(text, quoted = false) {
        return this.api.sendMessage(this.message.from, text, quoted, this.message.id);
    }

    async typing(delay = 0) {
        const res = this.api.sendTyping(this.message.id);
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return res;
    }

    async read() {
        return this.api.sendReadReceipt(this.message.id);
    }
}