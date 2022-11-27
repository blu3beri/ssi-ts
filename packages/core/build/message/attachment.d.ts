export declare type Attachment = {
    data: AttachmentData;
    id?: string;
    description?: string;
    filename?: string;
    mediaType?: string;
    format?: string;
    lastmodTime?: string;
    byteCount?: number;
};
export declare type AttachmentData = {
    Base64?: {
        value: Base64AttachmentData;
    };
    Json?: {
        value: JsonAttachmentData;
    };
    Links?: {
        value: LinksAttachmentData;
    };
};
export declare type Base64AttachmentData = {
    base64: string;
    jws?: string;
};
export declare type JsonAttachmentData = {
    json: Record<string, unknown>;
    jws?: string;
};
export declare type LinksAttachmentData = {
    links: Array<string>;
    hash: string;
    jws?: string;
};
