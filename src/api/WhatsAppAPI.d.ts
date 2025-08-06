export default class WhatsAppAPI {
    constructor(token: string, phoneNumberId: string);

    token: string;
    phoneNumberId: string;

    sendMessage(to: string, text: string, isQuoted?: boolean, messageId?: string | null): Promise<any>;

    sendReadReceipt(messageId: string): Promise<any>;

    sendTyping(messageId: string): Promise<any>;
}
