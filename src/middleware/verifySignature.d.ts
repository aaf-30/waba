import { Buffer } from "buffer";
import { IncomingHttpHeaders } from "http";

/**
 * Represents a request-like object containing headers.
 */
interface RequestLike {
    headers: IncomingHttpHeaders;
}

/**
 * Verifies the authenticity of a request from WhatsApp by checking its signature.
 * @param {string} appSecret - The application secret from the Meta developer portal.
 * @param {string | Buffer} rawBody - The raw, unparsed request body.
 * @param {RequestLike} req - The request object, containing the headers.
 * @returns {boolean} Returns true if the signature is valid, otherwise false.
 */
declare function verifySignature(appSecret: string, rawBody: string | Buffer, req: RequestLike): boolean;

export default verifySignature;
