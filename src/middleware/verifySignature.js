import crypto from "crypto";

const verifySignature = (appSecret, rawBody, req) => {
    const signature = req.headers['x-hub-signature-256'];

    if (!signature || typeof signature !== 'string') {
        console.error("Request is missing the X-Hub-Signature-256 header. Ignoring.");
        return false;
    }
    
    if (!rawBody) {
        console.error("Request body is missing.");
        return false;
    }

    const expectedSignature = `sha256=${crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')}`;
    
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (!crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
        console.error("Invalid signature. The request may have been tampered with.");
        return false;
    }
    return true;
};

export default verifySignature;