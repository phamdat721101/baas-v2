FROM node:18-alpine
WORKDIR /go/src/github.com/hyperledger/fabric-samples/chaincode/baas/typescript
COPY . .
RUN npm install && npm run build && printf "ls\nnpm run start\n" > entrypoint.sh
EXPOSE 9999
CMD ["/bin/sh","entrypoint.sh"]