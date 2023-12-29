#!/usr/bin/env node
const args = require('minimist')(
  process.argv.slice(2),
  {
    string: ['_', 'rpc', 'privateKey', 'to', 'file', 'data', 'type']
  }
);

const { uploadToAddress, uploadToEthStorage, uploadToFlatDirectory } = require("./index");

const TYPE_STORAGE  = "2";
const TYPE_FLAT     = "3";

if (args.type === TYPE_FLAT) {
    uploadToFlatDirectory(args.rpc, args.privateKey, args.to, args.file);
} else if (args.type === TYPE_STORAGE) {
    uploadToEthStorage(args.rpc, args.privateKey, args.file);
} else {
    uploadToAddress(args.rpc, args.privateKey, args.to, args.file, args.data);
}
