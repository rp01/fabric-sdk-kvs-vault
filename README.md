# fabric-sdk-kvs-vault

vault from hashicorp kvs for fabric-sdk-node

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
    url: "http://127.0.0.1:8200"
    # token: "8vfJ8rIGgET3XDIsmVIuVHT6"
    apiVersion: "v1"

    # Specific to the CryptoSuite implementation. Software-based implementations like
    # CryptoSuite_ECDSA_AES.js requires a key store. PKCS#11 based implementations does
    # not.
    cryptoStore:
      # Specific to the underlying KeyValueStore that backs the crypto key store.
      url: "mongodb://localhost:27017"
      # token: "8vfJ8rIGgET3XDIsmVIuVHT6"
      collectionName: "crypto"
      apiVersion: "v1"
```

2. config fabric-sdk-node to use fabric-ca-kvs-mongo 

```javascript
const Client = require('fabric-client');

// this code config the fabric-sdk-node to use fabric-sdk-kvs-mongo
Client.setConfigSetting('key-value-store', 'fabric-sdk-kvs-mongo');

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

## Check the credentials from mongodb

```yaml
# suppose you followed the instructions above and make no change.
# and you start your mongodb like this
mongodb:
    container_name: mongo
    image: mongo
    ports:
      - 27017:27017
```
use mongo shell to see what is in the credentials store.

```
$ mongo
> show dbs;
...
org1  0.000GB
org2  0.000GB
> use org1;
switched to db org1
> show collections;
credential
crypto
> db.credential.find();
> db.crypto.find();
```

