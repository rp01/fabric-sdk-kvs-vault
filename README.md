# fabric-sdk-kvs-vault

Key value store for fabric-sdk-node using Hashicorp's Vaul

## Install

```bash
npm i fabric-sdk-kvs-vault
```

## Config

1. config your network definition to use vault credentialStore

```yaml
# your network.yaml
client:
  # Since the node.js SDK supports pluggable KV stores, the properties under "credentialStore"
  # are implementation specific
  credentialStore:
    endpoint: "http://127.0.0.1:8200"
    # token: "VAULT_TOKEN" or can be set from env as VAULT_TOKEN
    apiVersion: "v1"

    # Specific to the CryptoSuite implementation. Software-based implementations like
    # CryptoSuite_ECDSA_AES.js requires a key store. PKCS#11 based implementations does
    # not.
    cryptoStore:
      # Specific to the underlying KeyValueStore that backs the crypto key store.
      endpoint: "http://127.0.0.1:8200"
      # token: "VAULT_TOKEN" or can be set from env as VAULT_TOKEN
      apiVersion: "v1"
```

2. config fabric-sdk-node to use fabric-ca-kvs-vault 

```javascript
const Client = require('fabric-client');

// this code config the fabric-sdk-node to use fabric-sdk-kvs-vault
Client.setConfigSetting('key-value-store', 'fabric-sdk-kvs-vault');

// this load the network.yaml from step 1
const client = Client.loadFromConfig('<some-path-to-your-network.yaml>');

// init credential stores
await client.initCredentialStores();

// then it's done.

// Next time you just need to load this use again from state store
const user = await client.loadUserFromStateStore(username);
await client.setUserContext(user);

// do some invoke/query with this user's identity
// Enjoy!
```

## setting VAULT_TOKEN

1. Windows powershell

```powershell
$env:VAULT_TOKEN='6JtkGzUL0Wtoz7ffzrbtMkIE'
```

2. Linux bash

```bash
export VAULT_TOKEN='6JtkGzUL0Wtoz7ffzrbtMkIE'
```

## How to fix error with secrets engine

```bash
vault secrets disable secret
vault secrets enable -version=1 -path=secret kv
```

## How to cheeck stored data in vault

```bash
vault kv get secret/<PREVIOUSLY_SET_KEY>
```