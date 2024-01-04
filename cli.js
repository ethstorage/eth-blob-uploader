#!/usr/bin/env node
const args = require('minimist')(
  process.argv.slice(2),
  {
    string: ['_', 'rpc', 'privateKey', 'to', 'file', 'data', 'type']
  }
);

const { uploadToAddress, uploadToEthStorage, uploadToFlatDirectory } = require("./index");
const color = require('colors-cli/safe')
const error = color.red;

const TYPE_STORAGE = "2";
const TYPE_FLAT_DIRECTORY = "3";

if (!args.rpc) {
    console.log(error("Invalid RPC"));
    return;
}
if (!args.privateKey) {
    console.log(error("Invalid private key"));
    return;
}
if (!args.file) {
    console.log(error("Invalid file path"));
    return;
}

if (args.type === TYPE_FLAT_DIRECTORY) {
    uploadToFlatDirectory(args.rpc, args.privateKey, args.file, args.to);
} else if (args.type === TYPE_STORAGE) {
    uploadToEthStorage(args.rpc, args.privateKey, args.file);
} else {
    if (!args.to) {
        console.log(error("Invalid to address"));
        return;
    }
    uploadToAddress(args.rpc, args.privateKey, args.file, args.to, args.data);
}
