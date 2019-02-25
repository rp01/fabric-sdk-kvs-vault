# fabric-sdk-kvs-vault

Key value store for fabric-sdk-node using Hashicorp's Vault

## Install

```bash
npm i fabric-sdk-kvs-vault
```

## Config

1. config your network definition to use vault credentialStore

```yaml
# your network.yaml
credentialStore:
    # [Optional]. Specific to FileKeyValueStore.js or similar implementations in other SDKs. Can be others
    # if using an alternative impl. For instance, CouchDBKeyValueStore.js would require an object
    # here for properties like url, db name, etc.
    # path: "./fabric-client-kv-org1"
    endpoint: "http://127.0.0.1:8200"
    token: "<VAULT_TOKEN>" # or can be set from env as VAULT_TOKEN
    apiVersion: "v1"

    # [Optional]. Specific to the CryptoSuite implementation. Software-based implementations like
    # CryptoSuite_ECDSA_AES.js in node SDK requires a key store. PKCS#11 based implementations does
    # not.
    cryptoStore:
      # Specific to the underlying KeyValueStore that backs the crypto key store.
      # path: "/tmp/fabric-client-kv-org1"
      endpoint: "http://127.0.0.1:8200"
      token: "<VAULT_TOKEN>" # or can be set from env as VAULT_TOKEN
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
$env:VAULT_TOKEN="<VAULT_TOKEN>"
```

2. Linux bash

```bash
export VAULT_TOKEN=<VAULT_TOKEN>
```

## How to fix error with secrets engine

Some Times you may get status 404 even in setting values.
just open another terminal tab/window run:

```bash
export VAULT_TOKEN=<TOKEN> 
export VAULT_ADDRESS='http(s)://<HOST>:<PORT>'
```
Then run the following command:

```bash
vault secrets disable secret
vault secrets enable -version=1 -path=secret kv
```

## How to cheeck stored data in vault

```bash
vault kv get secret/<PREVIOUSLY_SET_KEY>
```

## To enable debuging

run:
```node
process.env.DEBUG = 'VaultKVS';
```


