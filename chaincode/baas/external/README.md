# baas as an external service

See the "Chaincode as an external service" documentation for running chaincode as an external service.
This includes details of the external builder and launcher scripts which will peers in your Fabric network will require.

The baas chaincode requires two environment variables to run, `CHAINCODE_SERVER_ADDRESS` and `CHAINCODE_ID`, which are described in the `chaincode.env.example` file. Copy this file to `chaincode.env` before continuing.

**Note:** each organization in a Fabric network will need to follow the instructions below to host their own instance of the baas external service.

## Packaging and installing

Make sure the value of `CHAINCODE_SERVER_ADDRESS` in `chaincode.env` is correct for the baas external service you will be running.

The peer needs a `connection.json` configuration file so that it can connect to the external baas service.
Use the `CHAINCODE_SERVER_ADDRESS` value in `chaincode.env` to create the `connection.json` file with the following command (requires [jq](https://stedolan.github.io/jq/)):

```
env $(cat chaincode.env | grep -v "#" | xargs) jq -n '{"address":env.CHAINCODE_SERVER_ADDRESS,"dial_timeout": "10s","tls_required": false}' > connection.json
```

Add this file to a `code.tar.gz` archive ready for adding to a baas external service package:

```
tar cfz code.tar.gz connection.json
```

Package the baas external service using the supplied `metadata.json` file:

```
tar cfz baas-pkg.tgz metadata.json code.tar.gz
```

Install the `baas-pkg.tgz` chaincode as usual, for example:

```
peer lifecycle chaincode install ./baas-pkg.tgz
```

## Running the baas external service

To run the service in a container, build a baas docker image:

```
docker build -t hyperledger/baas-sample .
```

Edit the `chaincode.env` file to configure the `CHAINCODE_ID` variable before starting a baas container using the following command:

```
docker run -it --rm --name baas.org1.example.com --hostname baas.org1.example.com --env-file chaincode.env --network=net_test hyperledger/baas-sample
```

## Starting the baas external service

Complete the remaining lifecycle steps to start the baas chaincode!
