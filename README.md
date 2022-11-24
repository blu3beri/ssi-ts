<p align="center">
  <h1 align="center">DIDComm TypeScript</h1>
  <b align="center">Work In Progress</b>
</p>

Please refer to one of these libraries for a working implementation:

- [SICPA: DIDComm (Rust))[https://github.com/sicpa-dlab/didcomm-rust]
  - Can be compiled for WASM to be used in the browser and in Node.js
- [SICPA: DIDComm (RN)](https://github.com/sicpa-dlab/didcomm-react-native)

These libraries have been the main inspiration behind this library with a few core differences.

## Differences

> These are subject to change once a base implementation is completed

### Bring Your Own Crypto

This library requires you to bring your own crypto as this is very platform dependent. This way, the library stays pure TypeScript and you can use whichever crypto provider you trust.

### Provider (registration)

This library uses global providers for resolving secrets, resolving dids and the aforementioned crypto.
