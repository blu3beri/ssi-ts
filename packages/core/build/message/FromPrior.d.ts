export declare class FromPrior {
    iss: string;
    sub: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    constructor({ iss, sub, aud, exp, iat, jti, nbf, }: {
        iss: string;
        sub: string;
        aud?: string;
        exp?: number;
        nbf?: number;
        iat?: number;
        jti?: string;
    });
    static fromString(s: string): FromPrior;
    pack({ issuerKid }: {
        issuerKid?: string;
    }): Promise<{
        fromPriorJwt: string;
        kid: string;
    }>;
    validatePack(issuerKid?: string): boolean;
    static unpack({ fromPriorJwt, }: {
        fromPriorJwt: string;
    }): Promise<{
        fromPrior: FromPrior;
        kid: string;
    }>;
}
