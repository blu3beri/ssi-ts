import { cryptoProvider } from '@didcomm-ts/crypto-provider-node'

import { ALICE_DID_DOC, ALICE_SECRETS, BOB_DID_DOC, BOB_SECRETS } from '../fixtures'
import { createExampleDidsProvider, createExampleSecretsProvider } from '../samples'
import { Message } from '../src/'
import { setCryptoProvider, setDidsProvider, setSecretsProvider } from '../src/providers'

describe('end to end', () => {
  test('full flow', async () => {
    setCryptoProvider(cryptoProvider)
    const sender = ALICE_DID_DOC.id
    const recipient = BOB_DID_DOC.id

    const exampleBody = { example: 'body' }
    const exampleMessage = new Message({
      id: 'example-1',
      type: 'example/v1',
      body: exampleBody,
      to: [recipient],
      from: sender,
    })

    const senderDidsResolver = createExampleDidsProvider([BOB_DID_DOC, ALICE_DID_DOC])
    const senderSecretsResolver = createExampleSecretsProvider([...ALICE_SECRETS])
    setDidsProvider(senderDidsResolver)
    setSecretsProvider(senderSecretsResolver)

    const { message, metadata } = await exampleMessage.packEncrypted({ to: recipient, from: sender })

    expect(metadata).toMatchObject({
      toKids: [
        'did:example:bob#key-x25519-1',
        'did:example:bob#key-x25519-2',
        'did:example:bob#key-x25519-3',
        'did:example:bob#key-p256-1',
        'did:example:bob#key-p256-2',
        'did:example:bob#key-p384-1',
        'did:example:bob#key-p384-2',
        'did:example:bob#key-p521-1',
        'did:example:bob#key-p521-2',
      ],
      fromKid: 'did:example:alice#key-x25519-1',
      signByKid: undefined,
    })

    const recipientDidsResolver = createExampleDidsProvider([BOB_DID_DOC, ALICE_DID_DOC])
    const recipientSecretsResolver = createExampleSecretsProvider([...BOB_SECRETS])
    setDidsProvider(recipientDidsResolver)
    setSecretsProvider(recipientSecretsResolver)

    const { message: receivedMessage, metadata: receivedMetadata } = await Message.unpack({
      message: JSON.stringify({
        ciphertext:
          'KWS7gJU7TbyJlcT9dPkCw-ohNigGaHSukR9MUqFM0THbCTCNkY-g5tahBFyszlKIKXs7qOtqzYyWbPou2q77XlAeYs93IhF6NvaIjyNqYklvj-OtJt9W2Pj5CLOMdsR0C30wchGoXd6wEQZY4ttbzpxYznqPmJ0b9KW6ZP-l4_DSRYe9B-1oSWMNmqMPwluKbtguC-riy356Xbu2C9ShfWmpmjz1HyJWQhZfczuwkWWlE63g26FMskIZZd_jGpEhPFHKUXCFwbuiw_Iy3R0BIzmXXdK_w7PZMMPbaxssl2UeJmLQgCAP8j8TukxV96EKa6rGgULvlo7qibjJqsS5j03bnbxkuxwbfyu3OxwgVzFWlyHbUH6p',
        protected:
          'eyJlcGsiOnsia3R5IjoiT0tQIiwiY3J2IjoiWDI1NTE5IiwieCI6IkpIanNtSVJaQWFCMHpSR193TlhMVjJyUGdnRjAwaGRIYlc1cmo4ZzBJMjQifSwiYXB2IjoiTmNzdUFuclJmUEs2OUEtcmtaMEw5WFdVRzRqTXZOQzNaZzc0QlB6NTNQQSIsInR5cCI6ImFwcGxpY2F0aW9uL2RpZGNvbW0tZW5jcnlwdGVkK2pzb24iLCJlbmMiOiJYQzIwUCIsImFsZyI6IkVDREgtRVMrQTI1NktXIn0',
        recipients: [
          {
            encrypted_key: '3n1olyBR3nY7ZGAprOx-b7wYAKza6cvOYjNwVg3miTnbLwPP_FmE1A',
            header: {
              kid: 'did:example:bob#key-x25519-1',
            },
          },
          {
            encrypted_key: 'j5eSzn3kCrIkhQAWPnEwrFPMW6hG0zF_y37gUvvc5gvlzsuNX4hXrQ',
            header: {
              kid: 'did:example:bob#key-x25519-2',
            },
          },
          {
            encrypted_key: 'TEWlqlq-ao7Lbynf0oZYhxs7ZB39SUWBCK4qjqQqfeItfwmNyDm73A',
            header: {
              kid: 'did:example:bob#key-x25519-3',
            },
          },
        ],
        tag: '6ylC_iAs4JvDQzXeY6MuYQ',
        iv: 'ESpmcyGiZpRjc5urDela21TOOTW8Wqd1',
      }),
    })

    expect(receivedMetadata.encrypted).toBe(true)
    expect(receivedMetadata.authenticated).toBe(true)
    expect(receivedMetadata.encryptedFromKid).toBeTruthy()
    expect(receivedMetadata.encryptedFromKid?.startsWith(recipient)).toBe(true)

    expect(receivedMessage.from).toStrictEqual(sender)
    expect(receivedMessage.to).toStrictEqual(recipient)
    expect(receivedMessage.body).toMatchObject(exampleBody)
  })
})
