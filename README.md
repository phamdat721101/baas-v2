Các bước setup chaincode cho Hyperledger Fabric 
Bước 1: cài đặt docker images, binary từ source chính thức của Hyperledger Fabric v2 (note: version >= 2.3)
Bước 2: tạo fabric network trong folder test-network bằng command
 
./network.sh up createChannel -ca -c mychannel


Bước 3: Cài đặt chaincode vào các peer (vẫn ở trong folder test-network)
a - Cấu hình đường dẫn 

export PATH=${PWD}/../bin:$PATH

export FABRIC_CFG_PATH=$PWD/../config/

b - Chạy script để cấu hình peer: 

. ./scripts/envVar.sh

c - Cài đặt chaincode cho các peer:

setGlobals 1

peer lifecycle chaincode install ../chaincode/baas/typescript/baas.tgz



setGlobals 2

peer lifecycle chaincode install ../chaincode/baas/typescript/baas.tgz

d - Kiểm tra chaincode đã được cài đặt:

setGlobals 1

peer lifecycle chaincode queryinstalled --peerAddresses localhost:7051 --tlsRootCertFiles organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

Chú ý: lưu lại kết quả chaincodeId được trả về để cấu hình chaincode docker 
Bước 4: Khởi chạy chaincode service -> trỏ vào đường dẫn baas
a - Copy chaincodeId lấy từ bước 3 để sửa vào file chaincode.env
b - Copy chaincodeId vào đoạn script chạy trong file package.json

"scripts": {
    "lint": "tslint -c tslint.json 'src/**/*.ts'",
    "pretest": "npm run lint",
    "test": "nyc mocha -r ts-node/register src/**/*.spec.ts",
    "start": "fabric-chaincode-node server --chaincode-address   baas.org1.example.com:9999 --chaincode-id baas_1.0:25398f34cf1667abe92bd498dad2ceb882a055417a5ad21e5d264cd2ec14c11a",
    "build": "tsc",
    "build:watch": "tsc -w",
    "prepublishOnly": "npm run build"
}

Bước 5: Build docker image cho chaincode service

docker build -t hyperledger/baas .

Bước 6: Khởi chạy docker chaincode 

docker run -it --rm --name baas.org1.example.com --hostname baas.org1.example.com --env-file chaincode.env --network=fabric_test hyperledger/baas

Bước 7: Khởi chạy docker cho channel network

export CHAINCODE_ID=baas_1.0:25398f34cf1667abe92bd498dad2ceb882a055417a5ad21e5d264cd2ec14c11a
# Approving chaincode from Org2
setGlobals 2

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --channelID mychannel --name baas --version 1.0 --package-id $CHAINCODE_ID --sequence 1
# Approving chaincode from Org1
setGlobals 1

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --channelID mychannel --name baas --version 1.0 --package-id $CHAINCODE_ID --sequence 1
# Committing chaincode
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --channelID mychannel --name baas --peerAddresses localhost:7051 --tlsRootCertFiles "$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --version 1.0 --sequence 1




