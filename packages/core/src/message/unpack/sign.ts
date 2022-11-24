import { DidResolver, VerificationMethod } from '../../did'
import { DIDCommError } from '../../error'
import { JWS } from '../../jws'
import { assertDidProvider } from '../../providers'
import { b64UrlSafe, didOrUrl } from '../../utils'
import { UnpackMetadata } from './UnpackMetadata'

export const tryUnpackSign = async ({
  message,
  metadata,
}: {
  message: string
  metadata: UnpackMetadata
}): Promise<string> => {
  assertDidProvider(['resolve'])
  const jws = JWS.fromString(message)
  const parsedJws = jws.parse()
  if (parsedJws.protected.length !== 1) {
    throw new DIDCommError('Wrong amount of signatures for jws')
  }

  let algorithm = parsedJws.protected[0].alg
  if (!algorithm) {
    throw new DIDCommError('Unexpected absence of first protected header')
  }

  const signerKidFromHeader = parsedJws.jws.signatures[0].header.kid
  if (!signerKidFromHeader) {
    throw new DIDCommError('Unexpected absence of first signature')
  }

  const { did: signerDid, didUrl: signerUrl } = didOrUrl(signerKidFromHeader)

  if (!signerUrl || !signerDid) {
    throw new DIDCommError('Signer key can not be resolved to key agreement')
  }

  const signerDidDocument = await DidResolver.resolve!(signerDid)
  if (!signerDidDocument) {
    throw new DIDCommError('Signer did not found')
  }

  const signerKid: undefined | string | VerificationMethod =
    signerDidDocument.authentication?.find((k) =>
      typeof k !== 'string' ? k.id : k === signerKid
    )
  if (!signerKid) {
    throw new DIDCommError('Signer kid not found in did')
  }

  const signerKidString =
    typeof signerKid === 'string' ? signerKid : signerKid.id

  const signerKey = signerDidDocument.verificationMethod?.find(
    (v) => v.id === signerKidString
  )

  if (!signerKey) {
    throw new DIDCommError('Sender key not found in did')
  }

  // TODO
  const valid = true

  if (!valid) {
    throw new DIDCommError('Wrong signature')
  }

  const payload = b64UrlSafe.decode(parsedJws.jws.payload)
  const serializedPayload = Buffer.from(payload).toString('utf-8')

  metadata.authenticated = true
  metadata.nonRepudiation = true
  metadata.signFrom = signerKidString
  metadata.signedMessage = message

  return serializedPayload
}
